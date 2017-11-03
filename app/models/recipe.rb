class Recipe < ApplicationRecord
  belongs_to :user

  has_many :steps

  has_many :forker_forks, class_name: "Fork", foreign_key: "forked_from_id"
  has_many :forkers, through: :forker_forks, source: :forker

  has_one :forked_from_fork, class_name: "Fork", foreign_key: "forker_id"
  has_one :forked_from, through: :forked_from_fork, source: :forked_from

  validates :name, presence: true
  validates :ingredients_body, presence: true

  mount_base64_uploader :photo, RecipePhotoUploader
end