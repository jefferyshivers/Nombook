FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "test#{n}@example.com" }
    sequence(:username) { |n| "johndoe#{n}" }
    password 'f4k3p455w0rd'
  end
end
