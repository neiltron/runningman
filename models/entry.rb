class Entry
  include Mongoid::Document
  include Mongoid::Timestamps

  field :distance, type: Float
  field :duration, type: Float
  field :date, type: Time, default: Time.now.to_s

  belongs_to :user

  def as_json(*)
    {
      id: id.to_s,
      date: date.to_s,
      distance: distance,
      duration: duration
    }
  end
end
