document.addEventListener("DOMContentLoaded", () => {
    console.log("Loaded!")
    console.log(new Date())
    document.querySelector('input#NewProject').addEventListener('click', Project.createProject)
  });

let projects = []
// Project class
class Project {
    constructor(id, name, description, due_date, status) {
        this.id = id
        this.name = name
        this.description = description
        this.due_date = due_date
        this.status = status
    }

    // Creates project on submit
    static createProject(e) {
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

    // Updates Project
    updateProject(e) {
        e.preventDefault()
        console.log(e)
        let projectID = e.composedPath()[3].id.substring(7)
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
            document.getElementById(`project${object.id}`).querySelector('h3 + h3').innerHTML = `Due: ${dateField.value}`
        })
    }

    // Completes Project
    completeProject(e) {
        let projectClass = `project${e.composedPath()[0].id.substring(10)}`
        console.log(e.composedPath()[0])
        if(!!e.composedPath()[3].querySelector('.incompleteTask')) {
            e.preventDefault()
            alert("All tasks have not been completed for this project!")
        }
        else {
            e.preventDefault()
        fetch(`http://localhost:3000/projects/${e.composedPath()[0].id.substring(10)}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                status: "Complete"
            })
        })
        .then(resp => resp.json())
        .then(object => document.querySelector(`#${projectClass}`).classList.replace(document.querySelector(`#${projectClass}`).classList[1], `${object.status.toLocaleLowerCase()}Project`))
        .then(console.log("Success!"))
    }
    }

    // Deletes project
    deleteProject(e) {
        let deleteID = e.composedPath()[2].id.substring(7)
        e.preventDefault()
        fetch(`http://localhost:3000/projects/${deleteID}`, {
            method: 'DELETE',
        })
        .then(console.log("SUCCESS"))
        .then(document.getElementById(e.composedPath()[2].id).remove())
    }

    static addProjectsToDOM(project) {
        let addProject
        let container
        container = document.createElement('div')
        container.className = "projects"
        container.classList.add(`${project.status.toLocaleLowerCase()}Project`)
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
        let taskForm = document.createElement('div')
        taskForm.className = "hiddenTaskForm"
        let addTaskForm = document.createElement('form')

        let taskFormLabel = document.createElement('label')
        taskFormLabel.innerHTML = "Name"

        let taskFormInput = document.createElement('input')
        taskFormInput.addEventListener("keydown", createTask)

        addTaskForm.append(taskFormLabel)
        addTaskForm.querySelector('label').after(taskFormInput)

        taskForm.append(addTaskForm)

        container.append(taskForm,project.addEditButton(), project.addEditProjectForm())
        document.body.append(container)
    }

    bark() {
        console.log("WOOF!")
    }

    static addProjectToProjects(a) {
        projects.push(a)
    }

    addTaskForm() {
        let newButton = document.createElement('button')
        newButton.innerHTML = "Add Task"
        newButton.id = `addTaskP${this.id}`
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
        updateButton.addEventListener('click', this.updateProject)

        // Creates Delete button and then adds eventlistener to call deleteProject
        let deleteButton = document.createElement('button')
        deleteButton.innerHTML = "Delete"
        deleteButton.addEventListener('click', this.deleteProject)

        // Creates Complete button
        let completeButton = document.createElement('button')
        completeButton.innerHTML = "Complete"
        completeButton.id = `comProject${this.id}`
        completeButton.addEventListener('click', this.completeProject)

        // Create line break
        let br = document.createElement('br')

        container.append(document.createElement('form'))
        container.firstChild.append(nameLabel, br, nameInput, br, descriptionLabel, br, descriptionInput, br, dueDateLabel, dueDateInput, updateButton, completeButton)
        container.append(deleteButton)
        return container
    }
}

// Functions to hide forms
function toggleHidden(e) {
    let taskForm = document.querySelector(`#${e.composedPath()[0].id} + div`)
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
    projects.map(function(a) {
        let project = new Project(a.id, a.name, a.description, a.due_date, a.status)
        // Runs class method to add project to DOM
        Project.addProjectToProjects(project)
        Project.addProjectsToDOM(project)
    }
        )
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

        // div to house other elements
        let taskContainer = document.createElement('div')
        taskContainer.id = `task${taskID}`

        // li to display name, adds event listener to hide/unhide button options, and has a boolean to add a className for strikethrough
        let taskName = document.createElement('li')
        taskName.innerHTML = this.name
        taskName.id = `projectTask${taskID}`
        taskName.addEventListener('click', function(){
            taskContainer.querySelector('div div').className === "" ? taskContainer.querySelector('div div').className = "hiddenTaskForm" : taskContainer.querySelector('div div').className = ""
        })

        this.status === "Complete" ? taskName.className = "strikeThrough" : taskName.className = "incompleteTask"


        // div that will hide and house the buttons
        let secondContainer = document.createElement('div')
        secondContainer.className = "hiddenTaskForm"

        taskContainer.append(taskName)
        taskContainer.querySelector('li').after(secondContainer)


        // Array and function to create and append those 3 buttons to secondContainer div
        let array = ["Update", "Delete", "Complete"]
        array.map(function(a) {
            let button = document.createElement('button')
            button.innerHTML = a
            button.id = `${a.toLocaleLowerCase()}Task${taskID}`
            taskContainer.querySelector('div div').appendChild(button)
        })

        // Add Update Task Form After Update Button
        let hiddenUpdateForm = document.createElement('div')
        hiddenUpdateForm.className = "hiddenTaskForm"
        taskContainer.querySelector('div div button').after(hiddenUpdateForm)

        // Add Name input field to hidden div
        let taskUpdateForm = document.createElement('form')
        let taskInput = document.createElement('input')
        let taskInputLabel = document.createElement('label')
        taskInput.id = `updateTaskNameField${this.id}`
        taskInput.addEventListener("keydown", updateTask)
        taskInputLabel.innerHTML = "Name"

        taskUpdateForm.append(taskInputLabel)
        taskUpdateForm.lastChild.after(taskInput)

        taskContainer.querySelector('div div button + div').appendChild(taskUpdateForm)
        
        // Add button event listeners
        taskContainer.querySelector('div div button').addEventListener('click', function() {taskContainer.querySelector('div div button + div').className === "" ? taskContainer.querySelector('div div button + div').className = "hiddenTaskForm" : taskContainer.querySelector('div div button + div').className = "" })
        taskContainer.querySelector('div div button + div + button').addEventListener('click', deleteTask)
        taskContainer.querySelector('div div button + div + button + button').addEventListener('click', completeTask)

        return taskContainer
    }

}

// Fetch tasks and add to page called by Project Fetch
function getTasks() {
fetch('http://localhost:3000/tasks')
.then(resp => resp.json())
.then(data => addTasksToProjects(data))
}


// Adds task to project on page, calls the Task class
function addTasksToProjects(tasks) {
    tasks.map(function(a) {
        let task = new Task(a.id, a.name, a.project_id, a.status)
        document.getElementById(`project${task.project_id}`).querySelector('h3 + h3 + ol').append(task.addTaskOptions())
    })
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
                project_id: e.composedPath()[3].id.slice(7)
            })
        })
        .then(resp => resp.json())
        .then(object => addTasksToProjects([object]))
        .then(e.composedPath()[0].value = "")
    }
}

// Update Task
function updateTask(e) {
    let updateId = e.composedPath()[0].id
    let updateValue = e.composedPath()[0]
    if (e.key === "Enter") {
        e.preventDefault()
        fetch(`http://localhost:3000/tasks/${updateId.substring(19)}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(
                {name: updateValue.value}
            )
        })
        .then(resp => resp.json())
        .then(object => document.querySelector(`#projectTask${updateId.substring(19)}`).innerHTML = object.name)
        .then(updateValue.value = "")
        .then(console.log("Success!"))
    }
}

// Delete Task
function deleteTask(e) {
    let deleteId = e.composedPath()[0].id.substring(10)
    e.preventDefault();
    fetch(`http://localhost:3000/tasks/${deleteId}`, {
        method: 'DELETE',
    })
    .then(console.log("SUCCESS"))
    .then(document.getElementById(e.composedPath()[2].id).remove())
}

// Complete Task
function completeTask(e) {
    let taskId = e.composedPath()[0].id.substring(12)
    e.preventDefault();
    fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            status: "Complete"
        })
    })
    .then(e.composedPath()[2].querySelector('li').className = "strikeThrough")
}