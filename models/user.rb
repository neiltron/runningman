class User
  include Mongoid::Document
  include Mongoid::Timestamps

  field :email
  field :password, default: nil
  field :password_hash
  field :password_salt
  field :authentication_token

  has_many :entries

  validates :email,
            presence: true,
            uniqueness: true,
            format: { with: /@/ }

  after_save :encrypt_pass

  def authenticated?(password)
    password_hash == password_digest(password)
  end

  def encrypt_pass
    return if password.nil?

    # skip save callbacks to avoid infiniteloops
    update_without_save_callback do
      self.password_hash = password_digest(password)
      self.password = nil
      self.authentication_token = new_token
      save
    end
  end

  def update_without_save_callback
    User.skip_callback(:save, :after, :encrypt_pass)

    yield

    User.set_callback(:save, :after, :encrypt_pass)
  end

  def get_entries(opts)
    # end date defaults to 'now' if no end date is specified
    # start date default to 2 weeks before the end date
    ends = Time.parse(opts[:ends] || Time.now.to_s)
    starts = opts[:starts].nil? ? ends - 1_209_600 : Time.parse(opts[:starts])
    res = entries.where(:date.gte => starts, :date.lte => ends)

    {
      total: res.count,
      starts: starts,
      ends: ends,
      entries: res
    }
  end

  protected

  def salt
    if password_salt.nil? || password_salt.empty?
      update_without_save_callback do
        time = Time.now.utc
        secret = Digest::SHA1.hexdigest("--#{time}--")
        self.password_salt = Digest::SHA1.hexdigest("--#{time}--#{secret}--")
        save
      end
    end

    password_salt
  end

  def password_digest(password)
    Digest::SHA1.hexdigest("--#{salt}--#{password}--")
  end

  def new_token
    password_digest("--#{Time.now.utc}--")
  end

  # borrowed from devise. thanks devise.
  # constant-time comparison algorithm to prevent timing attacks
  def secure_compare(a, b)
    return false if a.blank? || b.blank? || a.bytesize != b.bytesize
    l = a.unpack "C#{a.bytesize}"
    res = 0
    b.each_byte { |byte| res |= byte ^ l.shift }
    res == 0
  end
end
