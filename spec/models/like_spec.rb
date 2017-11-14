require 'rails_helper'

RSpec.describe Like, type: :model do
  context "like is created" do
    let(:user) { create(:user) }
    let(:recipe) { create(:recipe, user: user) }
    let(:like) { Like.create(user: user, recipe: recipe) }

    it "has a user attribute" do
      expect(like.user).to eq(user)
    end

    it "has a recipe attribute" do
      expect(like.recipe).to eq(recipe)
    end
    
    it "creates the right associations to recipes" do
      expect(like.recipe.likes.length).to eq(1)
    end
  end

  context "when fork information is missing" do
    let(:user) { create(:user) }
    let(:recipe) { create(:recipe, user: user) }

    it "is missing a recipe" do
      like = Like.new(user: user)
      like.save

      expect(Like.all.length).to eq(0)
    end

    it "is missing a user" do
      like = Like.new(recipe: recipe)
      like.save

      expect(Like.all.length).to eq(0)
    end
  end

  context "like is deleted" do
    let(:user) { create(:user) }
    let(:recipe) { create(:recipe, user: user) }
    let(:like) { Like.create(user: user, recipe: recipe) }

    it "deletes the fork, and removes associations" do
      like.destroy

      expect(Like.all.length).to eq(0)
      expect(recipe.likes.length).to eq(0)
    end
  end
end
