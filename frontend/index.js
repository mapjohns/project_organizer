document.addEventListener("DOMContentLoaded", () => {
    console.log("Loaded!")
    document.querySelector('input#NewProject').addEventListener('click', createProject)
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
        addProject.innerHTML = `Due: ${new Date(a['due_date']).toLocaleDateString()}`
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