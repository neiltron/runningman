require 'spec_helper'

describe Runningman::API do
  include Rack::Test::Methods

  def app
    Runningman::API
  end

  describe 'users' do
    it 'can create a new account' do
      post '/api/1/users/auth/signup', email: 'test@user.com', password: 'pass'

      expect(last_response.status).to eq(201)
    end

    it 'can login' do
      post '/api/1/users/auth/signin', email: 'test@user.com', password: 'pass'

      resp = JSON.parse(last_response.body)

      expect(last_response.status).to eq(201)
      expect(resp['accesskey']).to_not be_nil
    end
  end
end
