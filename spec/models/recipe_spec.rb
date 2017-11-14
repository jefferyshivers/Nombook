require 'rails_helper'

RSpec.describe Follow, type: :model do
  context "recipe is created" do
    let(:user) { create(:user) }
    let(:recipe) { Recipe.create(
      user: user, 
      name: "test recipe",
      description: "test description",
      ingredients_body: "test ingredients"
    )}

    it "has a user attribute" do
      expect(recipe.user).to eq(user)
    end

    it "has a name attribute" do
      expect(recipe.name).to eq("test recipe")
    end

    it "has a description attribute" do
      expect(recipe.description).to eq("test description")
    end

    it "has an ingredients attribute" do
      expect(recipe.ingredients_body).to eq("test ingredients")
    end

    it "has a steps association" do
      expect(recipe.steps.length).to eq(0)
    end
  end

  context "when recipe information is missing" do
    let(:user) { create(:user) }
    
    it "is missing a user" do
      recipe = Recipe.new(
        name: 'test recipe',
        description: 'test description', 
        ingredients_body: 'test ingredients'
      )
      recipe.save

      expect(Recipe.all.length).to eq(0)
    end

    it "is missing a name" do
      recipe = Recipe.new(
        user: user,
        description: 'test description', 
        ingredients_body: 'test ingredients'
      )
      recipe.save

      expect(Recipe.all.length).to eq(0)
    end

    it "is missing a description" do
      recipe = Recipe.new(
        user: user,
        name: 'test recipe',
        ingredients_body: 'test ingredients'
      )
      recipe.save

      expect(Recipe.all.length).to eq(0)
    end

    it "is missing ingredients" do
      recipe = Recipe.new(
        user: user,
        name: 'test recipe',
        description: 'test description'
      )
      recipe.save

      expect(Recipe.all.length).to eq(0)
    end
  end

  context "recipe validation" do
    let(:user) { create(:user) }

    describe Recipe do
      it { should have_valid(:user).when(user) }
      it { should_not have_valid(:user).when(nil) }

      it { should have_valid(:name).when("test name") }
      it { should_not have_valid(:name).when(nil, "") }

      it { should have_valid(:description).when("test description") }
      it { should_not have_valid(:name).when(nil, "") }
      
      it { should have_valid(:ingredients_body).when("test ingredients") }
      it { should_not have_valid(:name).when(nil, "") }      
    end
  end

  context "updates recipe" do
    let(:user) { create(:user) }
    let(:recipe) { Recipe.create(
      user: user, 
      name: "test recipe",
      description: "test description",
      ingredients_body: "test ingredients"
    )}

    it "has updated attributes" do
      recipe.update(
        name: "new name", 
        description: "new description",
        ingredients_body: "new ingredients"
      )

      new_recipe = Recipe.find(recipe.id)
      expect(new_recipe.name).to eq("new name")
      expect(new_recipe.description).to eq("new description")
      expect(new_recipe.ingredients_body).to eq("new ingredients")
    end
  end

  context "deletes recipe" do
    let(:user) { create(:user) }
    let(:recipe) { Recipe.create(
      user: user, 
      name: "test recipe",
      description: "test description",
      ingredients_body: "test ingredients"
    )}

    it "no longer exists" do
      recipe.delete
      expect(Recipe.all.length).to eq(0)
    end
  end
end
