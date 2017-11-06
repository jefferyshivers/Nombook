class Follow < ApplicationRecord
  belongs_to :follower, class_name: "User", foreign_key: "follower_id"
  belongs_to :followed, class_name: "User", foreign_key: "followed_id"

  validates :follower, presence: true
  validates :followed, presence: true
end