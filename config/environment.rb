$stdout.sync = true

require 'rubygems'
require 'bundler'
Bundler.setup

%w( mongoid ).each do |config|
  require_relative config
end

%w( user entry ).each do |model|
  require_relative "../models/#{model}"
end
