module Runningman
  class API < Grape::API
    resource :users do
      post :signup do
        user = User.create(email: params[:email], password: params[:password])

        if user.save
          user
        else
          error!(user.errors.full_messages.first, 400)
        end
      end

      post :signin do
        user = User.where(email: params[:email]).first

        401 if user.nil?

        if user && user.authenticated?(params[:password])
          user
        else
          401
        end
      end
    end
  end
end
