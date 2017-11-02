class AddForks < ActiveRecord::Migration[5.1]
  def change
    create_table :forks do |t|
      t.belongs_to :forked_from, null: false
      t.belongs_to :forker, null: false

      t.timestamps
    end

    add_index :forks, [:forked_from_id, :forker_id]
  end
end
