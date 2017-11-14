require 'rails_helper'

RSpec.describe Follow, type: :model do
  context "follow is created" do
    let(:users) { create_list(:user, 2) }
    let(:follow) { Follow.create(follower: users.first, followed: users.last) }

    it "has a follower attribute" do
      expect(follow.follower).to eq(users.first)
    end

    it "has a followed attribute" do
      expect(follow.followed).to eq(users.last)
    end
    
    it "creates the right associations to users" do
      expect(follow.follower.followeds.length).to eq(1)
      expect(follow.followed.followers.length).to eq(1)
      expect(follow.follower.followers.length).to eq(0)
      expect(follow.followed.followeds.length).to eq(0)    
    end
  end

  context "follow is deleted" do
    let(:users) { create_list(:user, 2) }
    let(:follow) { Follow.create(follower: users.first, followed: users.last) }
    
    it "deletes the follow, and removes associations" do
      follow.destroy

      expect(Follow.all.length).to eq(0)
      expect(follow.follower.followeds.length).to eq(0)
      expect(follow.followed.followers.length).to eq(0)
      expect(follow.follower.followers.length).to eq(0)
      expect(follow.followed.followeds.length).to eq(0)    
    end
  end
end
