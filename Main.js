class Task {
    constructor(title, description, dueDate) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
    }

    createTaskElement() {
        const taskItem = document.createElement('li');
        taskItem.classList.add("newTask");
        taskItem.draggable = true;
        taskItem.style.listStyleType = "none";
        taskItem.ondragstart = drag;

        // Set a unique ID for drag and drop
        taskItem.id = Math.random().toString(36).slice(2, 11);

        // Title element
        const titleElement = document.createElement('h3');
        titleElement.textContent = this.title;

        // Description element
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = `Description: ${this.description}`;

        // Due date element
        const dueDateElement = document.createElement('p');
        dueDateElement.textContent = `Due Date: ${this.dueDate}`;

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => taskItem.remove());

        // Append elements to task item
        taskItem.append(titleElement, descriptionElement, dueDateElement, deleteButton);

        return taskItem;
    }
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
    const task = document.getElementById(data);

// Locate the closest `.task-column`'s <ul> to append the dropped task.    
    const targetList = event.target.closest(".task-column").querySelector("ul");
    if (targetList) {
        targetList.appendChild(task);
    }
}

document.querySelector("#myButton").addEventListener("click", () => {
    const title = prompt("Enter task title:");
    const description = prompt("Enter task description:");
    const dueDate = prompt("Enter due date (e.g., 2024-12-31):");

    const task = new Task(title, description, dueDate);
    const taskElement = task.createTaskElement();

    document.getElementById('undone-tasks').querySelector('ul').appendChild(taskElement);
});