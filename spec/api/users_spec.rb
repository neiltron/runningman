require 'spec_helper'

describe Runningman::API do
  include Rack::Test::Methods

  def app
    Runningman::API
  end

  describe 'users' do
    before(:all) do
      User.destroy_all
    end

    it 'can create a new account' do
      post '/api/1/users/signup', email: 'test@user.com', password: 'pass'

      expect(last_response.status).to eq(201)
    end

    it 'will return an error without a password on signup' do
      post '/api/1/users/signup', email: 'test@user.com'

      expect(last_response.status).to eq(400)
    end

    it 'will return an error with an invalid email' do
      post '/api/1/users/signup', email: 'tests', password: 'pass'

      expect(last_response.status).to eq(400)
    end

    it 'can login' do
      post '/api/1/users/signin', email: 'test@user.com', password: 'pass'

      resp = JSON.parse(last_response.body)

      expect(last_response.status).to eq(201)
      expect(resp['accesskey']).to_not be_nil
    end
  end
end
