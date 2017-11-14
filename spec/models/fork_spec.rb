require 'rails_helper'

RSpec.describe Fork, type: :model do
  context "fork is created" do
    let(:user) { create(:user) }
    let(:recipes) { build_pair(:recipe, user: user) }
    let(:fork) { Fork.create(forker: recipes.first, forked_from: recipes.last) }

    it "has a forker attribute" do
      expect(fork.forker).to eq(recipes.first)
    end

    it "has a forked_from attribute" do
      expect(fork.forked_from).to eq(recipes.last)
    end
    
    it "creates the right associations to recipes" do
      expect(fork.forker.forked_from).to eq(recipes.last)
      expect(fork.forker.forkers.length).to eq(0)
      expect(fork.forked_from.forked_from).to eq(nil)
      expect(fork.forked_from.forkers.length).to eq(1)
    end
  end

  context "when fork information is missing" do
    let(:user) { create(:user) }
    let(:recipe) { create(:recipe, user: user) }

    it "is missing a forker" do
      fork = Fork.new(forked_from: recipe)
      fork.save

      expect(Fork.all.length).to eq(0)
    end

    it "is missing a forked_from" do
      fork = Fork.new(forker: recipe)
      fork.save

      expect(Fork.all.length).to eq(0)
    end
  end

  context "fork is deleted" do
    let(:user) { create(:user) }
    let(:recipes) { build_pair(:recipe, user: user) }
    let(:fork) { Fork.create(forker: recipes.first, forked_from: recipes.last) }

    it "deletes the fork, and removes associations" do
      fork.destroy

      expect(Fork.all.length).to eq(0)
      expect(fork.forker.forked_from).to eq(nil)
      expect(fork.forked_from.forkers.length).to eq(0)
    end
  end
end
