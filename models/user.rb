class User
  include Mongoid::Document
  include Mongoid::Timestamps

  field :email
  field :password

  validates :password, presence: true
  validates :email,
            presence: true,
            uniqueness: true,
            format: { with: /@/ }
end
