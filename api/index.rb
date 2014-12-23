%w(
  rubygems bundler/setup grape json date uri mongoid boxer
).each do |lib|
  require lib
end

%w( users entries ).each do |api|
  require_relative api
end

module Runningman
  class API < Grape::API
    version '1'
    prefix 'api'

    format :json
    content_type :txt, 'text/plain'

    get do
      200
    end
  end
end
