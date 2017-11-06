class CreateLikes < ActiveRecord::Migration[5.1]
  def change
    create_table :likes do |t|
      t.belongs_to :user, null: false
      t.belongs_to :recipe, null: false

      t.timestamps
    end

    add_index :likes, [:user_id, :recipe_id], unique: true    
  end
end
