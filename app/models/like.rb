class Like < ApplicationRecord
  belongs_to :user
  belongs_to :recipe

  validates :user, presence: true, uniqueness: { scope: :recipe }
  validates :recipe, presence: true
end