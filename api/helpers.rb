module Runningman
  class API < Grape::API
    helpers do
      def logger
        API.logger
      end

      def current_user
        accesskey = env['HTTP_X_ACCESSKEY'] || params[:accesskey] || nil
        User.where(authentication_token: accesskey).first || false
      end

      def authenticate!
        error!('401 Unauthorized', 401) unless current_user
      end
    end
  end
end
