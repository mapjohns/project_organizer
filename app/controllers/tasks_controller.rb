class TasksController < ApplicationController

    def create
        task = Task.new(name: params[:name], project_id: params[:project_id])
        task.save
        render json: task, except: [:created_at, :updated_at]
    end

    private

    def task_params
        params.require(:task).permit(:name, :project_id, :status)
    end
end
