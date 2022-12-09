class TasksController < ApplicationController

    def index
        tasks = Task.all
        render json: tasks, except: [:created_at, :updated_at]

    end
    
    def create
        task = Task.new(name: params[:name], project_id: params[:project_id])
        task.save
        render json: task, except: [:created_at, :updated_at]
    end

    def update
        task = Task.find_by(id: params[:id])
        task.update(task_params)
        task.save
        render json: task, except: [:created_at, :updated_at]
    end

    def destroy
        task = Task.find_by(id: params[:id])
        task.destroy
    end
    private

    def task_params
        params.require(:task).permit(:name, :project_id, :status)
    end
end
