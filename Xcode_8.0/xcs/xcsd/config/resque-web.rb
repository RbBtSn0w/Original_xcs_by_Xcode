require 'redis'
require 'resque'
$redis = Redis.new(:path => '/Library/Developer/XcodeServer/Database/redis.sock')
Resque.redis = $redis