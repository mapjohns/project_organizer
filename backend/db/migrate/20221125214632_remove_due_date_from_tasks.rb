class RemoveDueDateFromTasks < ActiveRecord::Migration[6.1]
  def change
    remove_column :tasks, :dueDate
  end
end
