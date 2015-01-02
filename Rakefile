require 'rubygems'
require 'bundler'

begin
  Bundler.setup(:default, :development)
rescue Bundler::BundlerError => e
  $stderr.puts e.message
  $stderr.puts 'Run `bundle install` to install missing gems'
  exit e.status_code
end

require 'rake'
require 'rspec/core'
require 'rspec/core/rake_task'

RSpec::Core::RakeTask.new(:spec) do |spec|
  spec.pattern = FileList['spec/api/*_spec.rb']
end

require 'rubocop/rake_task'
RuboCop::RakeTask.new(:rubocop)

task default: [:rubocop, :spec]


namespace :db do
  desc "Generate dummy data"
  task :fakedata do
    require_relative 'config/environment'

    # since this is for testing purposes, we'll add all test data to the very first user.
    # presumeably this is our test user
    user = User.first

    200.times do
      duration = '%.2f' % (rand(45) * 0.25 + 12)
      distance = '%.2f' % (rand(10) * 0.25 + 1)
      date = Time.now - (rand(240) * 21600)

      Entry.create!( user: user, duration: duration, distance: distance, date: date )
    end
  end
end