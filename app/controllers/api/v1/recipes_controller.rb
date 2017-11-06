class Api::V1::RecipesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create, :update, :destroy]

  def show
    recipe = Recipe.find(params[:id])

    def current_user_liked
      if Like.find_by(user_id: current_user.id, recipe_id: params[:id])
        return true
      else
        return false
      end
    end

    render json: { 
      recipe: recipe, 
      steps: recipe.steps.order(:index_in_recipe), 
      forked_from: recipe.forked_from,
      owner: recipe.user,
      photo_url: recipe.photo.url,
      current_user_liked: current_user_liked,
      likes: recipe.likes
    }
  end

  def create
    recipe = Recipe.new(recipe_params)
    recipe.user = User.find(params[:user_id])
    
    if recipe.user == current_user
      if recipe.save
        Step.where(recipe_id: recipe.id).destroy_all
        steps = params[:steps]
        steps.each do |step, index|
          Step.create(recipe: recipe, index_in_recipe: step["index_in_recipe"], body: step["body"])
        end

        forked_from = params[:forked_from_id]
        if forked_from
          Fork.create(forked_from_id: forked_from, forker: recipe)
        end

        render json: { saved: true, location: "/recipes/#{recipe.id}" }
      else
        render json: { error: recipe.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: "You don't have permission to edit this recipe." }
    end
  end

  def update
    recipe = Recipe.find(params[:id])

    if recipe.user == current_user
      recipe.update(recipe_update_params)

      if recipe.save
        Step.where(recipe_id: recipe.id).destroy_all
        steps = params[:steps]
        steps.each do |step, index|
          Step.create(recipe: recipe, index_in_recipe: step["index_in_recipe"], body: step["body"])
        end

        render json: {
          saved: true, 
          recipe: recipe, 
          steps: recipe.steps.order(:index_in_recipe),
        }        
      else
        render json: { error: recipe.errors.full_messages, description: "There was a problem saving to the database." }, status: :unprocessable_entity
      end
    else
      render json: { error: "You don't have permission to edit this recipe." }
    end
  end

  def destroy
    recipe = Recipe.find(params[:id])

    if recipe.user == current_user
      if recipe.destroy
        Step.where(recipe_id: recipe.id).destroy_all
        Fork.where(forker: recipe).destroy_all
        Fork.where(forked_from: recipe).destroy_all

        render json: { deleted: true }
      else
        render json: { error: recipe.errors.full_messages, description: "There was a problem saving to the database." }, status: :unprocessable_entity        
      end
    else
      render json: { error: "You don't have permission to edit this recipe." }
    end
  end

  private

  def recipe_params
    params.require(:recipe).permit(:name, :description, :ingredients_body, :user_id, :forked_from_id, :photo)
  end

  def recipe_update_params
    params.require(:recipe).permit(:name, :description, :ingredients_body, :user_id, :photo)
  end
end