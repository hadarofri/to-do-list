class Task {
    constructor(id, title, description, dueDate, status = 'todo') {
        this.id = id || Date.now();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.status = status;
    }

    createTaskElement() {
        const taskItem = document.createElement('li');
        taskItem.classList.add("newTask");
        taskItem.draggable = true;
        taskItem.style.listStyleType = "none";
        taskItem.ondragstart = drag;
        taskItem.id = this.id;

        // Title element
        const titleElement = document.createElement('h3');
        titleElement.textContent = this.title;

        // Description element
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = `Description: ${this.description}`;

        // Due date element
        const dueDateElement = document.createElement('p');
        dueDateElement.textContent = `Due Date: ${this.dueDate}`;


        // Create edit button
        const editButton = document.createElement('button');
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            const newTitle = prompt("Edit task title:", this.title);
            const newDueDate = prompt("Edit due date:", this.dueDate);
        
            // Update only if there’s input
            if (newTitle !== null && newTitle.trim() !== "") {
                this.title = newTitle;
                titleElement.textContent = this.title;
            }
            if (newDueDate !== null && newDueDate.trim() !== "") {
                this.dueDate = newDueDate;
                dueDateElement.textContent = `Due Date: ${this.dueDate}`;
            }
            updateTaskInLocalStorage(this);
        });

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteTaskFromLocalStorage(this.id);
            taskItem.remove();
        });
        
        

        // Append elements to task item
        taskItem.append(titleElement, descriptionElement, dueDateElement, editButton, deleteButton);

        return taskItem;
    }
}

// Load tasks from local storage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(taskData => {
        const task = new Task(taskData.id, taskData.title, taskData.description, taskData.dueDate, taskData.status);
        document.getElementById(`${taskData.status}-tasks`).querySelector('ul').appendChild(task.createTaskElement());
    });
}

// Save task to local storage
function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Delete task from local storage
function deleteTaskFromLocalStorage(taskId) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update updated task in local storage
function updateTaskInLocalStorage(updatedTask){
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Allowing drop by changing the defult settings
function allowDrop(event) {
    event.preventDefault();
}

// Store the task ID when dragging starts, so it can be retrieved during the drop.
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Handle the drop event, appending the dragged task to the new list.
function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const taskElement = document.getElementById(data);

    // Determine the new status from the column's ID
    const newStatus = event.target.closest(".task-column").id.replace('-tasks', '');

    // Update the task status in Local Storage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(task => {
        if (task.id == data) { // Use == to compare string and number
            task.status = newStatus; // Update the status
        }
        return task;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Move the task element to the new column in the UI
   const targetList = event.target.closest(".task-column").querySelector("ul");
    if (targetList) {
        const closestTask = event.target.closest("li"); // Get the closest task
        if (closestTask) {
            targetList.insertBefore(taskElement, closestTask); // Place above the closest task
        } else {
            targetList.appendChild(taskElement); // If no task is found, add to the end
        }
    }
    saveTaskOrder(); // Save the new order after dropping
}

function saveTaskOrder() {
    const tasks = [];
    document.querySelectorAll(".task-column").forEach(column => {
        const status = column.id.replace('-tasks', ''); // Get status from the column ID
        const taskIds = Array.from(column.querySelectorAll('li')).map(task => task.id);
        
        taskIds.forEach(id => {
            const taskData = JSON.parse(localStorage.getItem("tasks")).find(task => task.id == id);
            if (taskData) {
                taskData.status = status; // Update status for accuracy
                tasks.push(taskData);
            }
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Save the ordered array
}

document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

document.querySelector("#myButton").addEventListener("click", toggleForm);

function toggleForm() {
    const formContainer = document.getElementById("taskFormContainer");
    formContainer.style.display = formContainer.style.display === "none" ? "block" : "none";
    const addButton = document.getElementById("myButton");
    addButton.style.display = addButton.style.display === "none" ? "block" : "none";
}

// Handle form submission
document.getElementById("taskForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevents page reload

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("dueDate").value;

    if (title && dueDate) { // Only create if essential info is provided
        const task = new Task(Date.now().toString(), title, description, dueDate);
        document.getElementById('todo-tasks').querySelector('ul').appendChild(task.createTaskElement());
        saveTaskToLocalStorage(task);

        document.getElementById("taskForm").reset(); // Clear the form
        toggleForm(); // Hide the form
    }
});
