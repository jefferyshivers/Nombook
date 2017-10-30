class Step < ApplicationRecord
  belongs_to :recipe

  validates :index_in_recipe, presence: true
  validates :body, presence: true
end