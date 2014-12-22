#!/usr/bin/env ruby
# encoding: UTF-8

$LOAD_PATH.unshift ::File.dirname(__FILE__)

ENV['RACK_ENV'] ||= "development"

if ENV['RACK_ENV'] == 'development'
  log = File.new("log/development.log", "a+")
  $stdout.reopen(log)
  $stderr.reopen(log)
end

require 'config/environment'
require 'rack/cors'
require 'api/index'

use Rack::Cors do
  allow do
    origins '*'
    resource '/api/*', :headers => :any, :methods => [:get, :post, :options, :put, :delete]
  end
end

use Rack::Session::Cookie, :key => 'rack.session', :secret => ENV['SESSION_SECRET'] || 'therunn1ngman'
use Rack::Deflater

run Runningman::API
