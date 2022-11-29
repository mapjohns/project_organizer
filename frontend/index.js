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
        editButton.id = `editButton${this.id}`
        editButton.addEventListener('click', toggleUpdateFormVisibility)
        return editButton
    }

    addEditProjectForm() {
        let container = document.createElement('div')
        container.id = this.id
        container.className = "hiddenUpdateForm"

        // Name
        let nameInput = document.createElement('input')
        nameInput.id = `updateName${this.id}`
        nameInput.value = this.name
        let nameLabel = document.createElement('label')
        nameLabel.setAttribute("for", nameInput.id)
        nameLabel.innerHTML = "Name"

        // Description
        let descriptionInput = document.createElement('input')
        descriptionInput.value = this.description
        descriptionInput.id = `updateDescription${this.id}`
        let descriptionLabel = document.createElement('label')
        descriptionLabel.setAttribute("for", descriptionInput.id)
        descriptionLabel.innerHTML = "Description"

        // Due Date
        let dueDateInput = document.createElement('input')
        dueDateInput.value = new Date(this.due_date).toLocaleDateString()
        dueDateInput.id = `updateDate${this.id}`
        let dueDateLabel = document.createElement('label')
        dueDateLabel.setAttribute("for", dueDateInput.id)
        dueDateLabel.innerHTML = "Due: "
        

        // Creates Update button and then adds eventlistener to call updateProject
        let updateButton = document.createElement('button')
        updateButton.innerHTML = "Update"
        updateButton.addEventListener('click', updateProject)

        // Creates Delete button and then adds eventlistener to call deleteProject
        let deleteButton = document.createElement('button')
        deleteButton.innerHTML = "Delete"
        deleteButton.addEventListener('click', deleteProject)

        // Create line break
        let br = document.createElement('br')

        container.append(nameLabel, br, nameInput, br, descriptionLabel, br, descriptionInput, br, dueDateLabel, br, dueDateInput, br, updateButton, br, deleteButton)
        return container
    }
}

// Functions to hide forms
function toggleHidden(e) {
    let taskForm = document.getElementById(`project${e.composedPath()[0].id}`).querySelector('button + div')
    taskForm.className === "" ? taskForm.className = "hiddenTaskForm" : taskForm.className = ""
}

function toggleUpdateFormVisibility(e) {
   let path = document.getElementById(`project${e.composedPath()[0].id.substring(10)}`).querySelector('div + button + div')
   path.className === "" ? path.className = "hiddenUpdateForm" : path.className = ""
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
        container.append(addProject,  document.createElement('ol'), project.addTaskForm())

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

        container.append(taskForm,project.addEditButton(), project.addEditProjectForm())
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
    let projectID = e.composedPath()[2].id.substring(7)
    let nameField = document.getElementById(`updateName${projectID}`)
    let descField = document.getElementById(`updateDescription${projectID}`)
    let dateField = document.getElementById(`updateDate${projectID}`)

    e.preventDefault();
    fetch(`http://localhost:3000/projects/${projectID}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            name: nameField.value,
            description: descField.value,
            due_date: new Date(dateField.value)
        })
    })
    .then(resp => resp.json())
    .then(function(object) {
        document.getElementById(`project${object.id}`).querySelector('h2').innerHTML = object.name
        document.getElementById(`project${object.id}`).querySelector('h3').innerHTML = descField.value
        document.getElementById(`project${object.id}`).querySelector('h3 + h3').innerHTML = dateField.value
    })
}

// Delete Project
function deleteProject(e) {
    deleteID = e.composedPath()[2].id.substring(7)
    fetch(`http://localhost:3000/projects/${deleteID}`, {
        method: 'DELETE',
    })
    .then(console.log("SUCCESS"))
    .then(document.getElementById(e.composedPath()[2].id).remove())
}

// Task class
class Task {
    constructor(id, name, project_id, status) {
        this.id = id
        this.name = name
        this.project_id = project_id
        this.status = status
    }

    addTaskOptions() {
        let taskID = this.id

        let taskContainer = document.createElement('div')
        taskContainer.id = `task${taskID}`

        let taskName = document.createElement('li')
        taskName.innerHTML = this.name
        taskName.id = `projectTask${taskID}`
        taskName.addEventListener('click', function(){
            taskContainer.querySelector('div div').className === "" ? taskContainer.querySelector('div div').className = "" : taskContainer.querySelector('div div').className = "hiddenTaskForm"
        })


        let secondContainer = document.createElement('div')
        secondContainer.className = "hiddenTaskForm"

        taskContainer.append(taskName)
        taskContainer.querySelector('li').after(secondContainer)

        taskName.addEventListener('click', function(){
            taskContainer.querySelector('div div').className === "" ? taskContainer.querySelector('div div').className = "hiddenTaskForm" : taskContainer.querySelector('div div').className = ""
        })

        let array = ["Update", "Delete", "Complete"]
        array.map(function(a) {
            let button = document.createElement('button')
            button.innerHTML = a
            button.id = `${a}Task${taskID}`
            taskContainer.querySelector('div div').appendChild(button)
        })
        return taskContainer
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
    tasks.map(function(a) {
        let task = new Task(a.id, a.name, a.project_id, a.status)
        document.getElementById(`project${task.project_id}`).querySelector('h3 + h3 + ol').append(task.addTaskOptions())
    })
}

