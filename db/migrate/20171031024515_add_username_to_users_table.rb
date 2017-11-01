class AddUsernameToUsersTable < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :username, :string, null: false, unique: true
    change_column :users, :email, :string, unique: true
  end
end
