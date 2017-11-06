class Api::V1::LikesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:update, :destroy]

  def update
    like = Like.new(like_params)
    like.user = User.find_by(id: params[:id])

    if like.user == current_user
      if like.save
        render json: { saved: true, likes: like.recipe.likes, current_user_liked: true }
      else
        render json: { error: like.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'You do not have permission to make this request.' }
    end
  end

  def destroy
    like = Like.find_by(like_params, user_id: params[:id])
  
    if like.user == current_user
      if like.destroy
        render json: { saved: true, likes: like.recipe.likes, current_user_liked: false }
      else
        render json: { error: like.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'You do not have permission to make this request.' }
    end
  end

  private

  def like_params
    params.require(:like).permit(:user_id, :recipe_id)
  end
end