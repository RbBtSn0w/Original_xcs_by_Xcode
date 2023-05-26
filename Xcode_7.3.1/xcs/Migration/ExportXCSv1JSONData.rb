#!/usr/bin/env /Applications/Server.app/Contents/ServerRoot/usr/bin/ruby

# This script runs in the context of upgrade/migration of Xcode Server when Xcode Server v2 is started for the first time.
# It dumps a JSON representation of bot data to the path supplied by the --exportPath option.

begin_time = Time.now

ENV['BUNDLE_GEMFILE'] = "/Applications/Server.app/Contents/ServerRoot/usr/share/collabd/gems/Gemfile"
$LOAD_PATH << "/Applications/Server.app/Contents/ServerRoot/usr/share/collabd/server/ruby/lib"

require 'optparse'
require 'rubygems'
require 'bundler/setup'
require 'fileutils'
require 'collaboration'
require 'json'
require 'set'

$exportPath = "/tmp"
optparse = OptionParser.new do |opts|
  opts.on( '-e', '--exportPath PATH', "JSON export path" ) do |exportPath|
    $exportPath = exportPath
  end
end
optparse.parse!

$svc = Collaboration::ServiceClient.new
session = $svc.execute('AuthService', 'currentOrNewSession')
$svc.authorizationRef = Collaboration.sharedSecret
$svc.session_guid = $svc.execute('AuthService', 'enterMagicalAuthRealm').guid
pingWasSuccessful = $svc.execute('ContentService', 'ping')
puts "Successfully pinged collabd? #{pingWasSuccessful}"

puts "Dumping JSON representation of all bots"
allBots = $svc.execute('ContentService', 'entitiesForType:', 'com.apple.entity.Bot')
puts "Got #{allBots.length} bots from the server"

`/bin/mkdir -p #{$exportPath}`

for bot in allBots

  botGUID = bot.guid
  
  begin
    botJSONOutputPath = "#{$exportPath}/bot-#{botGUID}.json"
    puts "Writing JSON represenation for #{botGUID} to #{botJSONOutputPath}"
    File.open(botJSONOutputPath, 'w') { |f|
     f.write(bot.to_json)
    }
    puts "Wrote JSON represenation successfully"
  rescue Exception => e
    puts "Exception writing JSON representation for bot #{botGUID}: #{e.inspect}"
  end  
  
  begin
    puts "Fetching custom email notifications for bot"
    successNotifications = $svc.execute('ContentService', 'emailSubscriptionListForEntityGUID:withNotificationType:', botGUID, "com.apple.notifications.BotSucceeded") || []
    failureNotifications = $svc.execute('ContentService', 'emailSubscriptionListForEntityGUID:withNotificationType:', botGUID, "com.apple.notifications.BotFailed") || []
    notifications = {'success' => successNotifications.map { |n| n.strip }, 'failure' => failureNotifications.map { |n| n.strip }}
    puts "Fetched custom email notifications as #{notifications.inspect}"
    
    notificationsJSONOutputPath = "#{$exportPath}/notifications-#{botGUID}.json"
    puts "Writing JSON represenation for #{botGUID} notifications to #{notificationsJSONOutputPath}"
    File.open(notificationsJSONOutputPath, 'w') { |f|
      f.write(notifications.to_json)
    }
    puts "Wrote JSON represenation successfully"
  rescue Exception => e
    puts "Exception fetching/writing notifications for bot #{botGUID}: #{e.inspect}"
  end  
  
end

def sanitizeExternalID(externalID)
  if (externalID == "authenticated")
    return "*:authenticated"
  end
  if (externalID.start_with?("group:"))
    return externalID[6..-1]
  end
  return externalID
end

begin
  puts "Fetching service ACLs for bot creator/viewers"
  defaultBotGroup = $svc.execute('ContentService', 'entityForTinyID:', 'defaultbotgroup')
  defaultSCMRepoGroup = $svc.execute('ContentService', 'entityForTinyID:', 'defaultscmrepogroup')
  botCreatorViewerACLs = $svc.execute('ContentService', 'aclsForEntityGUID:', defaultBotGroup.guid);
  hostedRepositoryCreatorACLs = $svc.execute('ContentService', 'aclsForEntityGUID:', defaultSCMRepoGroup.guid);
    
  puts "Mapping service ACLs format to XCS2 format"
  botCreatorSet = Set.new
  botViewerSet = Set.new
  hostedRepositoryCreatorSet = Set.new
  
  for acl in botCreatorViewerACLs
    externalID = acl.userExternalID
    action = acl.action
    allow = acl.allow
    if externalID != "servermgr_xcode" && allow == true
      externalID = sanitizeExternalID(externalID)
      if action == "write"
        botCreatorSet.add(externalID)
      elsif action == "read"
        botViewerSet.add(externalID)
      end
    end
  end
  
  # All bot creators can be removed from the bot viewers list
  botViewerSet.subtract(botCreatorSet)
  
  for acl in hostedRepositoryCreatorACLs
    externalID = acl.userExternalID
    action = acl.action
    allow = acl.allow
    if externalID != "servermgr_xcode" && allow == true
      externalID = sanitizeExternalID(externalID)
      # <rdar://problem/17924679> Xcode Server should auto-promote hosted respository creators from * to *:authenticated
      if externalID == "*"
        puts "Hosted repository creators were configured for anyone access, upgrading to *:authenticated access"
        externalID = "*:authenticated"
      end
      if action == "write"
        hostedRepositoryCreatorSet.add(externalID)
      end
    end
  end
  
  serviceACLs = {"botCreatorExternalIDs" => botCreatorSet.to_a, "botViewerExternalIDs" => botViewerSet.to_a, "hostedRepositoryCreatorExternalIDs" => hostedRepositoryCreatorSet.to_a}
  serviceACLSJSONOutputPath = "#{$exportPath}/acls.json"
  puts "Mapped service ACLs are: #{serviceACLs.inspect}"
  
  puts "Writing JSON represenation for service ACLs to #{serviceACLSJSONOutputPath}"
  File.open(serviceACLSJSONOutputPath, 'w') { |f|
    f.write(serviceACLs.to_json)
  }
  puts "Wrote JSON represenation successfully"
rescue Exception => e
  puts "Exception fetching/writing JSON representation for service ACLs: #{e.inspect}"
end

end_time = Time.now
puts "Done (duration: #{(end_time - begin_time) * 1000} milliseconds)"
