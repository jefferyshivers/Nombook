FactoryBot.define do
  factory :recipe do
    sequence(:name) { |n| "test recipe #{n}" }
    sequence(:description) { |n| "test recipe description #{n}" }
    sequence(:ingredients_body) { |n| "test recipe ingredients #{n}" }
  end
end
