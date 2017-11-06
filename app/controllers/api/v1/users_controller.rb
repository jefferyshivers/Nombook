class Api::V1::UsersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create, :update, :destroy]

  def show
    user = User.find_by(username: params[:id])

    def current_user_following
      if Follow.find_by(follower: current_user, followed: User.find_by(username: params[:id]))
        return true
      else
        return false
      end
    end

    render json: { 
      user: user, 
      profile_photo: user.profile_photo.url, 
      following: user.followeds,
      followers: user.followers,
      current_user_following: current_user_following,
      recipes: user.recipes.order(created_at: :desc)
    }
  end

  def update
    user = User.find(params[:id])

    if user == current_user
      user.update(user_params)

      if user.save
        render json: { saved: true, user: user, recipes: user.recipes.order(created_at: :desc) }
      else
        render json: { error: user.errors.full_messages, description: "There was a problem saving to the database." }, status: :unprocessable_entity        
      end
    end
  end

  def whoami
    if user_signed_in?
      render json: { current_user: current_user }
    else
      render json: { current_user: false }
    end
  end

  private

  def user_params
    params.require(:user).permit(:description, :profile_photo)
  end
end