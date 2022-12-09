class AddDefaultValueToProjectStatus < ActiveRecord::Migration[6.1]
  def change
    change_column_default :projects, :status, "Incomplete"
  end
end
