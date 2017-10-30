Rails.application.routes.draw do
  devise_for :users

  root "static_pages#index"

  namespace :api do
    namespace :v1 do

      resources :users do
        resources :recipes
      end

      resources :recipes do
        resources :steps
      end
    end
  end

  get "*path", to: "static_pages#index"
end
