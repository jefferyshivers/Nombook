class CreateStepsTable < ActiveRecord::Migration[5.1]
  def change
    create_table :steps do |t|
      t.belongs_to :recipe, null: false
      t.integer :index_in_recipe, null: false
      t.string :body, null: false

      t.timestamps
    end
  end
end
