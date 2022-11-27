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

    addTaskForm() {
        let newButton = document.createElement('button')
        newButton.innerHTML = "Add Task"
        newButton.id = this.id
        newButton.addEventListener('click', toggleHidden)
        return newButton
    }

    addEditButton() {
        let editButton = document.createElement('button')
        editButton.innerHTML = "Edit"
        editButton.className = "editProject"
        editButton.addEventListener('click', console.log("POOTIS!"))
        return editButton
    }

    addEditProjectForm() {
        let array = ['name', 'description', 'due_date']
        let container = document.createElement('div')

        // Loops through array and creates elements for those 3 fields
        array.map(function(a) {
        let input = document.createElement('input')
        input.id = `pj${a.substring(0,2)}${this.id}`
        input.value = `${this.a}`
        let br = document.createElement('br')
        let label = document.createElement('label')
        label.setAttribute("for", `pj${a.substring(0,2)}${this.id}`)
        container.append(label, br, input)
    })
    let button = document.createElement('button')
    button.innerHTML = "Update"
    button.addEventListener('click', updateProject)

    }
}

function toggleHidden(e) {
    let taskForm = document.getElementById(`project${e.composedPath()[0].id}`).querySelector('button + div')
    taskForm.className === "" ? taskForm.className = "hiddenTaskForm" : taskForm.className = ""
}

// Fetch request to get all projects
fetch('http://localhost:3000/projects')
.then(resp => resp.json())
.then(data => addProjects(data))
.then(getTasks)

// Called by projects fetch, will add projects to the page
function addProjects(projects) {
    let addProject
    let container

    projects.map(function(a) {
        let project = new Project(a.id, a.name, a.description, a.due_date)
        container = document.createElement('div')
        container.className = "projects"
        container.id = `project${project.id}`

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
        container.append(addProject, project.addTaskForm())

        // Add task form
        taskForm = document.createElement('div')
        taskForm.className = "hiddenTaskForm"
        let taskArray = ['name']

        taskArray.map(function(a) {
            let formLabel = document.createElement('label')
            formLabel.innerHTML = `${a}`

            let CreateBR = document.createElement('br')

            let formInput = document.createElement('input')
            formInput.addEventListener("keydown", createTask)
            formInput.className = `${a}Field`

            taskForm.append(formLabel, CreateBR, formInput, CreateBR)
        })

        container.append(taskForm, project.addEditButton())
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

// Update Project
function updateProject(e) {

}



// Task class
class Task {
    constructor(id, name, project_id, status) {
        this.id = id
        this.name = name
        this.project_id = project_id
        this.status = status
    }
}

// Creates task and posts to db
function createTask(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        fetch('http://localhost:3000/tasks', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: e.composedPath()[0].value,
                project_id: e.composedPath()[2].id.slice(7)
            })
        })
        .then(resp => resp.json())
        .then(object => addTasksToProjects([object]))
        .then(e.composedPath()[0].value = "")
    }
}

// Fetch tasks and add to page called by Project Fetch
function getTasks() {
fetch('http://localhost:3000/tasks')
.then(resp => resp.json())
.then(data => addTasksToProjects(data))
}


function addTasksToProjects(tasks) {
    let taskInput
    let label
    tasks.map(function(a) {
        let testTask = new Task(a.id, a.name, a.project_id, a.status)
        // id use project#task#
        taskInput = document.createElement('input')
        taskInput.className = "tasks"
        taskInput.id = `task${testTask.id}`
        taskInput.type = 'checkbox'

        label = document.createElement('label')
        label.setAttribute("for", `${taskInput.id}`)
        label.innerHTML = `${testTask.name}`

        br = document.createElement('br')

        document.getElementById(`project${testTask.project_id}`).querySelector('h3 + h3').append(br, label, taskInput)
    })
}

