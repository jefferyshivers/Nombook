class Api::V1::RecipesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create, :update, :destroy]

  def index
    render json: {'body': ['test']}
  end

  def show
    # render json: {'body': ['test']}
    recipe = Recipe.find(params[:id])
    render json: { recipe: recipe }
  end

  def create
    recipe = Recipe.new(recipe_params)
    recipe.user = User.find(params[:user_id])
    
    if recipe.save
      render json: { saved: true, location: "/recipes/#{recipe.id}" }
    else
      render json: { error: recipe.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
  end

  def destroy
  end

  private

  def recipe_params
    params.require(:recipe).permit(:name, :description, :ingredients_body, :user_id)
  end
end