class ProjectsController < ApplicationController

    def index
        projects = Project.all
        render json: projects, except: [:created_at, :updated_at]
    end
end
