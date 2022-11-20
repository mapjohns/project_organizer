document.addEventListener("DOMContentLoaded", () => {
    console.log("Loaded!")
  });


// Fetch request to get all projects
fetch('http://localhost:3000/projects')
.then(resp => resp.json())
.then(data => addProjects(data))

function addProjects(projects) {
    let addProject
    let container
    projects.map(function(a) {
        container = document.createElement('div')
        container.className = "projects"

        // Add project name
        addProject = document.createElement('h2')
        addProject.innerHTML = a['name']
        container.append(addProject)

        // Add project description
        addProject = document.createElement('h3')
        addProject.innerHTML = a['description']
        container.append(addProject)

        // Add due date
        addProject = document.createElement('h3')
        addProject.innerHTML = `Due: ${a['due_date']}`
        container.append(addProject)

        document.body.append(container)
    }
        )
}

// Project class
class Project {
    constructor(name, description, due_date) {
        this.name = name
        this.description = description
        this.due_date = due_date
    }
}