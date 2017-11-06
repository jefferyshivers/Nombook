class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :recipes

  # has_many :likes
  # has_many :likeds, through: :likes

  has_many :follower_follows, class_name: "Follow", foreign_key: "followed_id"
  has_many :followers, through: :follower_follows, source: :follower

  has_many :followed_follows, class_name: "Follow", foreign_key: "follower_id"
  has_many :followeds, through: :followed_follows, source: :followed

  mount_base64_uploader :profile_photo, ProfilePhotoUploader  
end
