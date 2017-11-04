Rails.application.routes.draw do
  root "static_pages#index"

  devise_for :users

  devise_scope :user do
     get 'logout' => "devise/sessions#destroy"
  end

  namespace :api do
    namespace :v1 do
      resources :users do
        resources :recipes

        get "whoami", on: :collection
      end

      resources :recipes do
        resources :steps
      end
    end
  end

  get "*path", to: "static_pages#index"
end
