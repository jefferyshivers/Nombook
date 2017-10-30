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
end