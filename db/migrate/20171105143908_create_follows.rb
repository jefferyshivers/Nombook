class CreateFollows < ActiveRecord::Migration[5.1]
  def change
    create_table :follows do |t|
      t.belongs_to :follower, null: false
      t.belongs_to :followed, null: false

      t.timestamps
    end

    add_index :follows, [:follower_id, :followed_id], unique: true
  end
end
