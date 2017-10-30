class Recipe < ApplicationRecord
  belongs_to :user

  validates :name, presence: true
  validates :ingredients_body, presence: true
end