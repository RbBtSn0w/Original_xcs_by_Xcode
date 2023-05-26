#!/usr/bin/ruby

begin_time = Time.now

require 'optparse'
require 'fileutils'
require 'set'

$sourcePath = "/Library/Server/Xcode/Repositories/git"
$destinationPath = "/Library/Developer/XcodeServer/HostedRepositories"
repositoriesSeenSoFar = Set.new([])
optparse = OptionParser.new do |opts|
  opts.on( '-s', '--sourcePath PATH', "Repositories source path (e.g. /Library/Server/Xcode/Repositories/git)" ) do |sourcePath|
    $sourcePath = sourcePath
  end
  opts.on( '-d', '--destinationPath PATH', "Repositories destination path (e.g. /Library/Developer/XcodeServer/HostedRepositories)" ) do |destinationPath|
    $destinationPath = destinationPath
  end
end
optparse.parse!

puts "Migrating Xcode Server v1 hosted repositories from #{$sourcePath} to #{$destinationPath}"

if File.exists?($sourcePath)
    Dir.foreach($sourcePath) do |item|
        begin
            next if item == "." or item == ".."
            fullRepositoryPath = File.join($sourcePath, item)
            puts "Processing repository at #{fullRepositoryPath}"
            if File.directory?(fullRepositoryPath)
                extensionStrippedItem = item
                if item.end_with?(".git")
                    extensionStrippedItem = item[0..-5]
                end
                if repositoriesSeenSoFar.include?(extensionStrippedItem)
                    puts "Skipping copy of v1 repository #{extensionStrippedItem} because we have already copied a repository with that name"
                else
                    repositoriesSeenSoFar.add(extensionStrippedItem)
                    newFullRepositoryPathMinusExtension = File.join($destinationPath, extensionStrippedItem)
                    puts "Copying v1 hosted repository from #{fullRepositoryPath} to #{newFullRepositoryPathMinusExtension}"
                    dittoCommand = "/usr/bin/ditto #{fullRepositoryPath} #{newFullRepositoryPathMinusExtension}"
                    puts "Running #{dittoCommand}"
                    `#{dittoCommand}`
                    if $?.exitstatus != 0
                        puts "Exited with a non-zero code #{$?.exitstatus}"
                    end
                    Dir.chdir $destinationPath do
                        lnCommand = "/bin/ln -s #{extensionStrippedItem} #{extensionStrippedItem}.git"
                        puts "Running #{lnCommand}"
                        `#{lnCommand}`
                        if $?.exitstatus != 0
                            puts "Exited with a non-zero code #{$?.exitstatus}"
                        end
                    end
                    chownCommand = "/usr/sbin/chown -Rf root:_www #{newFullRepositoryPathMinusExtension}"
                    puts "Running #{chownCommand}"
                    `#{chownCommand}`
                    if $?.exitstatus != 0
                        puts "Exited with a non-zero code #{$?.exitstatus}"
                    end
                end
            else
                puts "Skipping copy of v1 repository because it is not a directory (#{fullRepositoryPath})"
            end
        rescue Exception => e
           puts "Exception raised: #{e.inspect}" 
        end
    end
else
    puts "Nothing to migrate, skipping"
end

if repositoriesSeenSoFar.size() > 0
    puts "Migrated #{repositoriesSeenSoFar.size()} repositories (#{repositoriesSeenSoFar.to_a.join(', ')})"
end

end_time = Time.now
puts "Done (duration: #{(end_time - begin_time) * 1000} milliseconds)"
