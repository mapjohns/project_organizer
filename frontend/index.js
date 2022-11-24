document.addEventListener("DOMContentLoaded", () => {
    console.log("Loaded!")
    document.querySelector('input#NewProject').addEventListener('click', createProject)
  });

// Project class
class Project {
    constructor(id, name, description, due_date) {
        this.id = id
        this.name = name
        this.description = description
        this.due_date = due_date
    }

}

// Fetch request to get all projects
fetch('http://localhost:3000/projects')
.then(resp => resp.json())
.then(data => addProjects(data))

function addProjects(projects) {
    let addProject
    let container

    projects.map(function(a) {
        let project = new Project(a.id, a.name, a.description, a.due_date)
        container = document.createElement('div')
        container.className = "projects"

        // Add project name
        addProject = document.createElement('h2')
        addProject.innerHTML = project.name
        container.append(addProject)

        // Add project description
        addProject = document.createElement('h3')
        addProject.innerHTML = project.description
        container.append(addProject)

        // Add due date
        addProject = document.createElement('h3')
        addProject.innerHTML = `Due: ${new Date(project.due_date).toLocaleDateString()}`
        container.append(addProject)

        document.body.append(container)
    }
        )
}

// Creates project on submit
function createProject(e) {
    e.preventDefault();
    fetch('http://localhost:3000/projects', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: document.querySelector('input#nameField').value,
                    description: document.querySelector('input#descField').value,
                    due_date: new Date(document.querySelector('input#dateField').value)
                }) 
            })
            .then(resp => resp.json())
            .then(object => addProjects([object]))
            .then(Array.from(document.querySelectorAll('.newProjectForm')).map(a => a.value = ""))
}