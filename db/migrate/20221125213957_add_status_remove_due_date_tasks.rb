class AddStatusRemoveDueDateTasks < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :status, :string
    change_column_default :tasks, :status, "Incomplete"
    remove_column :tasks, :due_date
  end
end
