class Api::V1::FollowsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:update, :destroy]

  def update
    follow = Follow.new(follow_params)
    follow.follower = User.find_by(id: params[:id])

    if follow.follower == current_user
      if follow.save
        render json: { saved: true, followers: follow.followed.followers, current_user_following: true }
      else
        render json: { error: follow.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'You do not have permission to make this request.' }
    end
  end

  def destroy
    follow = Follow.find_by(follow_params, follower_id: params[:id])

    if follow.follower == current_user
      if follow.destroy
        render json: { saved: true, followers: follow.followed.followers, current_user_following: false }
      else
        render json: { error: follow.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'You do not have permission to make this request.' }
    end
  end

  private

  def follow_params
    params.require(:follow).permit(:follower_id, :followed_id)
  end
end