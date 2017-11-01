# class Users::SessionsController < Devise::SessionsController
#   # before_action :configure_sign_in_params, only: [:create]
#   skip_before_action :verify_authenticity_token, only: [:create, :update, :destroy]
  
#   # def new
#   #   super
#   # end

#   def create 
#     binding.pry
#   end

#   # def destroy
#   #   sign_out(resource_name)
#   # end

#   protected

#   def configure_sign_in_params
#     devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute, :username, :avatar])
#   end
# end

class SessionsController < Devise::SessionsController  
  respond_to :json

  def create
    binding.pry
  end
end