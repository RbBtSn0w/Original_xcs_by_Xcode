#!/usr/bin/ruby

begin_time = Time.now

if Process.euid != 0
  puts "Must be run as root"
  Kernel.exit!
end

puts "Archiving Xcode Server v1 service data"

if File.exists?("/Library/Server/Xcode")
    `/bin/mv /Library/Server/Xcode /Library/Server/XcodeServer_v1.backup`
else
    puts "Xcode Server v1 service data does not exist, nothing to do"
end

end_time = Time.now
puts "Done (duration: #{(end_time - begin_time) * 1000} milliseconds)"
