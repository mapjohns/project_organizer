document.addEventListener("DOMContentLoaded", () => {
    console.log("Loaded!")
  });


fetch('http://localhost:3000/projects')
.then(resp => resp.json())
.then(data => addProjects(data))

function addProjects(projects) {
    let addProject
    let container
    projects.map(function(a) {
        container = document.createElement('div')
        container.className = "projects"
        addProject = document.createElement('h1')
        addProject.innerHTML = a['name']
        container.append(addProject)
        document.body.append(container)
    }
        )
}