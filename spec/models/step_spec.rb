require 'rails_helper'

RSpec.describe Step, type: :model do
  context "when the step is created" do
    let(:user) { create(:user) }
    let(:recipe) { Recipe.create(
      user: user, 
      name: "test recipe",
      description: "test description",
      ingredients_body: "test ingredients"
    )}
    let (:step) { Step.new(
      recipe: recipe,
      index_in_recipe: 0,
      body: "test step"
    )}

    it "has a recipe id attribute" do
      expect(step.recipe).to eq(recipe)
    end

    it "has an index_in_recipe attribute" do
      expect(step.index_in_recipe).to eq(0)
    end

    it "has a body attribute" do
      expect(step.body).to eq("test step")
    end    
  end

  context "when step information is missing" do
    let(:user) { create(:user) }
    let(:recipe) { Recipe.create(
      user: user, 
      name: "test recipe",
      description: "test description",
      ingredients_body: "test ingredients"
    )}

    it "is missing a recipe" do
      step = Step.new(
        index_in_recipe: 0,
        body: "test step"
      )

      step.save
      expect(Step.all.length).to eq(0)
    end

    it "is missing an index_in_recipe" do
      step = Step.new(
        recipe: recipe,
        body: "test step"
      )

      step.save
      expect(Step.all.length).to eq(0)
    end
    
    it "is missing a body" do
      step = Step.new(
        recipe: recipe,
        index_in_recipe: 0
      )

      step.save
      expect(Step.all.length).to eq(0)
    end
  end

  context "step validation" do
    let(:user) { create(:user) }
    let(:recipe) { Recipe.create(
      user: user, 
      name: "test recipe",
      description: "test description",
      ingredients_body: "test ingredients"
    )}

    describe Step do
      it { should have_valid(:recipe).when(recipe) }
      it { should_not have_valid(:recipe).when(nil) }

      it { should have_valid(:index_in_recipe).when(0) }
      it { should_not have_valid(:index_in_recipe).when(nil, "") }

      it { should have_valid(:body).when("test body") }
      it { should_not have_valid(:body).when(nil, "") }
    end
  end

  context "step is deleted" do
    let(:user) { create(:user) }
    let(:recipe) { Recipe.create(
      user: user, 
      name: "test recipe",
      description: "test description",
      ingredients_body: "test ingredients"
    )}

    it "no longer exists" do
      step = Step.create(
        recipe: recipe,
        index_in_recipe: 0,
        body: "test step"
      )

      step.delete
      expect(Step.all.length).to eq(0)
    end
  end
end
