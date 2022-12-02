class ProjectsController < ApplicationController

    def index
        projects = Project.all
        render json: projects, except: [:created_at, :updated_at]
    end

    def create
        project = Project.new(project_params)
        project.save
        render json: project, except: [:created_at, :updated_at]
    end

    def show
        project = Project.find_by(id: params[:id])
        render json: project, except: [:created_at, :updated_at]
    end

    def update
        project = Project.find_by(id: params[:id])
        if project.update(project_params)
        render json: project, except: [:created_at, :updated_at]
        else
            render json: project.errors
        end
    end

    def destroy
        project = Project.find_by(id: params[:id])
        project.destroy
    end

    private

    def project_params
        params.require(:project).permit(:name, :description, :due_date, :status)
    end
end
