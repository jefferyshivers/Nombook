class Api::V1::UsersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create, :update, :destroy]

  def index
    render json: {'body': ['test']}
  end

  def show
    render json: {'body': ['test']}
  end

  def create
  end

  def update
  end

  def destroy
  end

  def whoami
    if user_signed_in?
      render json: { current_user: current_user }
    else
      render json: { current_user: false }
    end
  end

  # def logout
  #   sign_out current_user
  # end
end