class Project < ApplicationRecord
    has_many :tasks, dependent: :destroy
    validate :complete_project, on: :update

    def complete_project
    if self.tasks.select {|task| task.status == "Incomplete"}.count != 0
        errors.add(:status, "Must complete all tasks")
    end
    end    
end
