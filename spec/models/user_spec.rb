require 'rails_helper'

RSpec.describe User, type: :model do
  context "when the user is created" do
    let (:user) { User.new(
      email: "test@email.com",
      username: "testusername",
      password: "testpassword")
    }

    it "has an email attribute" do
      expect(user.email).to eq("test@email.com")
    end

    it "has a username attribute" do
      expect(user.username).to eq("testusername")
    end

    it "has a password attribute" do
      expect(user.password).to eq("testpassword")
    end

    it "has a profile photo uploader" do
      expect(user.profile_photo).to be_a(ProfilePhotoUploader)
    end
  end

  context "when user information is missing" do
    it "is missing an email" do
      user = User.new(username: 'testusername', password: 'testpassword')
      user.save

      expect(User.all.length).to eq(0)
    end

    it "is missing a username" do
      user = User.new(email: 'test@email.com', password: 'testpassword')
      user.save
      
      expect(User.all.length).to eq(0)
    end

    it "is missing a password" do
      user = User.new(email: 'test@email.com', username: 'testpassword')
      user.save

      expect(User.all.length).to eq(0)
    end
  end

  context "user validation" do
    describe User do
      it { should have_valid(:email).when("test@email.com") }
      it { should_not have_valid(:email).when(nil, "", "testemail.com") }

      it { should have_valid(:username).when("testusername") }
      it { should_not have_valid(:username).when(nil, "") }

      it { should have_valid(:password).when("testpassword") }
      it { should_not have_valid(:password).when(nil, "") }
    end
  end

  context "updates profile" do
    it "has an updated password" do
      user = create(:user)

      user.update(email: "new@email.com", password: "newpassword")

      new_user = User.find(user.id)
      expect(new_user.email).to eq("new@email.com")
      expect(new_user.password).not_to eq(user.password)
    end
  end

  context "deletes profile" do
    it "no longer exists" do
      user = create(:user)

      user.delete
      expect(User.all.length).to eq(0)
    end
  end
end
