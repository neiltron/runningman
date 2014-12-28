module Runningman
  class API < Grape::API
    resource :entries do
      before { authenticate! }

      post do
        entry = Entry.create(
          distance: params[:distance],
          duration: params[:duration],
          user: current_user
        )

        # if no date is specified, entry model defaults to Time.now
        entry.date = Time.parse(params[:date]) unless params[:date].nil?

        if entry.save
          entry
        else
          error!(entry.errors.full_messages.first, 400)
        end
      end

      get do
        e = current_user.get_entries(
          starts: params[:start_date],
          ends: params[:end_date]
        )

        {
          total: e[:entries].count,
          starts: e[:starts],
          ends: e[:ends],
          entries: e[:entries].map(&:as_json)
        }
      end

      delete ':id' do
        entry = Entry.find(params[:id])

        error!('401 Unauthorized', 401) unless entry.user == current_user

        entry.delete
      end
    end
  end
end
