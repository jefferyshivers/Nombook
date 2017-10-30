class CreateRecipesTable < ActiveRecord::Migration[5.1]
  def change
    create_table :recipes do |t|
      t.belongs_to :user, null: false
      t.string :name, null: false
      t.string :description, null: false
      t.string :ingredients_body, null: false

      t.timestamps
    end
  end
end
