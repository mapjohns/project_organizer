class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.string :name
      t.datetime :dueDate

      t.timestamps
    end
  end
end
