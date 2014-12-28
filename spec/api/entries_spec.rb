require 'spec_helper'

describe Runningman::API do
  include Rack::Test::Methods

  def app
    Runningman::API
  end

  def tomorrow
    Date.parse((Time.now + 86_400).to_s).strftime('%Y-%m-%d')
  end

  before(:all) do
    User.destroy_all
    @user = User.create!(email: 'test@user.com', password: 'pass')
  end

  describe 'entries' do
    it 'returns 401 unauthorized if no accesskey is present' do
      post '/api/1/entries', distance: '2.1', duration: '78'

      expect(last_response.status).to eq(401)
    end

    it 'can be created without a date' do
      post '/api/1/entries',
           distance: '2.1', duration: '78',
           accesskey: @user.authentication_token

      expect(last_response.status).to eq(201)
    end

    it 'can be created with a date' do
      post '/api/1/entries',
           distance: '1.8', duration: '58', date: '2014/08/10',
           accesskey: @user.authentication_token

      expect(last_response.status).to eq(201)
    end

    it 'can be retrieved without a start and end date, defaults to 2 weeks' do
      get '/api/1/entries', accesskey: @user.authentication_token

      resp = JSON.parse(last_response.body)

      expect(last_response.status).to eq(200)
      expect(resp['total']).to eq(1)
      expect(resp['entries'].first['distance']).to eq(2.1)
    end

    it 'can be retrieved with an end date only' do
      get '/api/1/entries',
          end_date: '2014/08/11', accesskey: @user.authentication_token

      resp = JSON.parse(last_response.body)

      expect(last_response.status).to eq(200)
      expect(resp['total']).to eq(1)
      expect(resp['entries'].first['distance']).to eq(1.8)
    end

    it 'can be retrieved with a custom start and end date' do
      # set the start/end duration to one day, excluding both tests posts
      get '/api/1/entries',
          start_date: '2014/08/08', end_date: '2014/08/09',
          accesskey: @user.authentication_token

      resp = JSON.parse(last_response.body)

      expect(last_response.status).to eq(200)
      expect(resp['total']).to eq(0)

      # set a longer duration, including both tests
      get '/api/1/entries',
          start_date: '2014/08/08', end_date: tomorrow,
          accesskey: @user.authentication_token

      resp = JSON.parse(last_response.body)

      expect(last_response.status).to eq(200)
      expect(resp['total']).to eq(2)
    end

    it 'should be sorted newest-first' do
      # first test entry above has an implied date of today
      # second post has a date of August 10, 2014
      # so the first post should be newest and the first in entry list
      get '/api/1/entries',
          start_date: '2014/08/08', end_date: tomorrow,
          accesskey: @user.authentication_token

      resp = JSON.parse(last_response.body)

      expect(resp['entries'].first['distance']).to eq(2.1)
    end

    it 'can be deleted by ID' do
      get '/api/1/entries',
          start_date: '2014/08/08', end_date: tomorrow,
          accesskey: @user.authentication_token

      resp = JSON.parse(last_response.body)

      delete '/api/1/entries/' + resp['entries'].last['id'].to_s,
             accesskey: @user.authentication_token

      expect(last_response.status).to eq(200)
    end
  end
end
