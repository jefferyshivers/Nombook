class Fork < ApplicationRecord
  belongs_to :forked_from, class_name: "Recipe", foreign_key: "forked_from_id"
  belongs_to :forker, class_name: "Recipe", foreign_key: "forker_id"

  validates :forked_from, uniqueness: { scope: :forker }
end