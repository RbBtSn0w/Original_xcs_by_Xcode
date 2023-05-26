#!/usr/bin/ruby

begin_time = Time.now

if Process.euid != 0
  puts "Must be run as root"
  Kernel.exit!
end

require 'fileutils'

puts "Migrating Xcode Server v1 hosted repositories"
v1RepositoriesRootPath = "/Library/Server/Xcode/Repositories/git"

if File.exists?(v1RepositoriesRootPath)
    Dir.foreach(v1RepositoriesRootPath) do |item|
        next if item == "." or item == ".."
        fullRepositoryPath = File.join(v1RepositoriesRootPath, item)
        if File.directory?(fullRepositoryPath)
            extensionStrippedItem = item
            if item.end_with?(".git")
                extensionStrippedItem = item[0..-5]
            end
            newFullRepositoryPathMinusExtension = File.join("/Library/Developer/XcodeServer/HostedRepositories", extensionStrippedItem)
            puts "Copying v1 hosted repository from #{fullRepositoryPath} to #{newFullRepositoryPathMinusExtension}"
            `ditto #{fullRepositoryPath} #{newFullRepositoryPathMinusExtension}`
            `chown -R root:_www #{newFullRepositoryPathMinusExtension}`
            Dir.chdir "/Library/Developer/XcodeServer/HostedRepositories" do
                `ln -s #{extensionStrippedItem} #{extensionStrippedItem}.git`
            end
            else
            puts "Skipping copy of v1 repository because it is not a directory (#{fullRepositoryPath})"
        end
    end
else
    puts "Nothing to migrate, skipping"
end

end_time = Time.now
puts "Done (duration: #{(end_time - begin_time) * 1000} milliseconds)"
