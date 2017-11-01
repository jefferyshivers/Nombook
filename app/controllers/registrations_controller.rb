# class Users::RegistrationsController < Devise::RegistrationsController
#   # before_action :configure_sign_up_params, only: [:create]

#   def create
#     super
#   end

#   protected

#    def configure_sign_up_params
#      devise_parameter_sanitizer.permit(:sign_up, keys: [:attribute, :username, :state, :img, :avatar])
#    end
# end

class RegistrationsController < Devise::RegistrationsController  
  respond_to :json
end