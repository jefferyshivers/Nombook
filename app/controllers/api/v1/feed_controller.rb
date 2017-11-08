class Api::V1::FeedController < ApplicationController
  # skip_before_action :verify_authenticity_token, only: [:show]

  def index
    user = User.find_by(username: params[:id])

    if user = current_user
      render_feed(user, 0)
    else
      render json: { error: "You do not have permission to access this data." }, status: :unprocessable_entity        
    end
  end

  # def show
  #   user = User.find_by(username: params[:id])

  #   if user = current_user
  #     offset = params[:id]

  #     render json {

  #     }
  #   else

  #   end
  # end

  private

  def render_feed(me, offset)
    feed = []
    followeds = me.followeds

    me.recipes.each do |recipe|
      feed << recipe
    end
    followeds.each do |followed|
      followed.recipes.each do |recipe|
        feed << recipe
      end
    end

    feed.sort_by {|a| a.created_at}

    forks_likes = []
    feed.each do |recipe, index|
      likes = recipe.likes.length
      forks = recipe.forkers.length

      forks_likes << {
        id: recipe.id,
        likes: likes,
        forks: forks
      }
    end

    profiles = []
    feed.each do |recipe, index|
      url = recipe.user.profile_photo.thumb.url
      username = recipe.user.username

      profiles << {
        recipe_id: recipe.id,
        thumb_url: url,
        username: username
      }
    end
    
    render json: { 
      feed: {
        recipes: feed,
        forks_likes: forks_likes,
        profiles: profiles,
        count: 0,
        offset: 0
      }
    }
  end
end