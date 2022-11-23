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

    private

    def project_params
        params.require(:project).permit(:name, :description, :due_date)
    end
end
