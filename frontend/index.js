document.addEventListener("DOMContentLoaded", () => {
    console.log("Loaded!")
  });


fetch('http://localhost:3000/projects')
.then(resp => resp.json())
.then(data => addProjects(data))

function addProjects(projects) {
    let addProject
    projects.map(function(a) {
        addProject = document.createElement('h1'),
        addProject.innerHTML = a['name']
        document.querySelector('.projects').append(addProject)
    }
        )
}