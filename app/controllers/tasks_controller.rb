class TasksController < ApplicationController

    def create
        task = Task.new(name: params[:name], project_id: params[:project_id])
        render json: task, except: [:created_at, :updated_at]
    end
end
