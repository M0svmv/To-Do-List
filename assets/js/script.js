// Get references to DOM elements
const newTask = document.getElementById("task");
const newTaskBtn = document.getElementById("newTaskBtn");
const form = document.getElementById("form");
const tasks = document.getElementById("tasks");

// Create containers for tasks and completed tasks
const toDoTasks = document.createElement("div");
const completedTasks = document.createElement("div");

// Add styles to the containers
completedTasks.classList.add("stylesCompleted");
toDoTasks.classList.add("styles");

// Messages to display when there are no tasks
const noTasksMessage = document.createElement("p");
const noCompletedTasksMessage = document.createElement("p");
noTasksMessage.innerText = "There are no tasks right now";
noCompletedTasksMessage.innerText = "There are no completed tasks";
noTasksMessage.id = "noTasksMessage";
noCompletedTasksMessage.id = "noCompletedTasksMessage";

// Completed tasks heading
const pCom = document.createElement("p");
pCom.style.paddingBottom = "10px";
pCom.textContent = "Completed Tasks";

// Append containers to the tasks element
tasks.appendChild(toDoTasks);
tasks.appendChild(completedTasks);

// Load tasks from localStorage on window load
window.onload = () => {
    const tasksList = JSON.parse(localStorage.getItem("tasksList")) || [];
    const doneTasksList = JSON.parse(localStorage.getItem("doneTasksList")) || [];

    // Display tasks in the to-do list
    if (tasksList.length > 0) {
        for (let task of tasksList) {
            addTask(task);
        }
    } else {
        toDoTasks.appendChild(noTasksMessage);
    }

    // Display completed tasks
    if (doneTasksList.length > 0) {
        for (let task of doneTasksList) {
            addDoneTask(task);
        }
    } else {
        completedTasks.appendChild(noCompletedTasksMessage);
    }

    // Add completed tasks heading
    completedTasks.prepend(pCom);
};

// Save a new task to localStorage
function saveToStorage(task) {
    const tasksList = JSON.parse(localStorage.getItem("tasksList")) || [];
    tasksList.push(task);
    localStorage.setItem("tasksList", JSON.stringify(tasksList));
}

// Delete a task from localStorage
function deleteFromStorage(delTask) {
    let tasksList = JSON.parse(localStorage.getItem("tasksList")) || [];
    tasksList = tasksList.filter(task => task !== delTask);
    localStorage.setItem("tasksList", JSON.stringify(tasksList));

    if (tasksList.length === 0) {
        toDoTasks.appendChild(noTasksMessage);
    }
}

// Delete a completed task from localStorage
function deleteFromStorageCompleted(delTask) {
    let doneTasksList = JSON.parse(localStorage.getItem("doneTasksList")) || [];
    doneTasksList = doneTasksList.filter(task => task !== delTask);
    localStorage.setItem("doneTasksList", JSON.stringify(doneTasksList));

    if (doneTasksList.length === 0) {
        completedTasks.appendChild(noCompletedTasksMessage);
    }
}

// Mark a task as completed
function doneTasks(task) {
    let tasksList = JSON.parse(localStorage.getItem("tasksList")) || [];
    let doneTasksList = JSON.parse(localStorage.getItem("doneTasksList")) || [];

    tasksList = tasksList.filter(t => t !== task);
    doneTasksList.push(task);
    localStorage.setItem("tasksList", JSON.stringify(tasksList));
    localStorage.setItem("doneTasksList", JSON.stringify(doneTasksList));

    addDoneTask(task);
}

// Add a new task to the to-do list
function addTask(task) {
    const span = document.createElement("span");
    const taskBody = document.createElement("div");
    const btnsDiv = document.createElement("div");
    const doneBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    span.textContent = task;

    doneBtn.classList.add("doneBtn");
    const doneBtnImg = document.createElement("img");
    doneBtnImg.setAttribute("src", "./assets/imgs/check.svg");
    doneBtn.appendChild(doneBtnImg);

    deleteBtn.classList.add("deleteBtn");
    const deleteBtnImg = document.createElement("img");
    deleteBtnImg.setAttribute("src", "./assets/imgs/delete.svg");
    deleteBtn.appendChild(deleteBtnImg);

    doneBtn.onclick = () => {
        taskBody.remove();
        doneTasks(task);
        if (JSON.parse(localStorage.getItem("tasksList")).length === 0) {
            toDoTasks.appendChild(noTasksMessage);
        }
    };

    deleteBtn.onclick = () => {
        taskBody.remove();
        deleteFromStorage(task);
    };

    taskBody.classList.add("taskContainer");
    btnsDiv.classList.add("btnsContainer");

    taskBody.appendChild(span);
    btnsDiv.appendChild(doneBtn);
    btnsDiv.appendChild(deleteBtn);
    taskBody.appendChild(btnsDiv);
    toDoTasks.prepend(taskBody);

    // Remove "No tasks" message
    const noTasksMessageElement = document.getElementById("noTasksMessage");
    if (noTasksMessageElement) {
        noTasksMessageElement.remove();
    }
}

// Mark a task as incomplete and move it back to the to-do list
function undoTasks(task) {
    let tasksList = JSON.parse(localStorage.getItem("tasksList")) || [];
    let doneTasksList = JSON.parse(localStorage.getItem("doneTasksList")) || [];

    doneTasksList = doneTasksList.filter(t => t !== task);
    tasksList.unshift(task);
    localStorage.setItem("tasksList", JSON.stringify(tasksList));
    localStorage.setItem("doneTasksList", JSON.stringify(doneTasksList));

    addTask(task);

    if (doneTasksList.length === 0) {
        completedTasks.appendChild(noCompletedTasksMessage);
    }
}

// Add a task to the completed tasks list
function addDoneTask(task) {
    const span = document.createElement("span");
    const taskBody = document.createElement("div");
    const btnsDiv = document.createElement("div");
    const undoBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    span.textContent = task;

    undoBtn.classList.add("undoBtn");
    const undoBtnImg = document.createElement("img");
    undoBtnImg.setAttribute("src", "./assets/imgs/undo.svg");
    undoBtn.appendChild(undoBtnImg);

    deleteBtn.classList.add("deleteBtn");
    const deleteBtnImg = document.createElement("img");
    deleteBtnImg.setAttribute("src", "./assets/imgs/delete.svg");
    deleteBtn.appendChild(deleteBtnImg);

    undoBtn.onclick = () => {
        taskBody.remove();
        undoTasks(task);
    };

    deleteBtn.onclick = () => {
        taskBody.remove();
        deleteFromStorageCompleted(task);
    };

    taskBody.classList.add("taskContainer");
    btnsDiv.classList.add("btnsContainer");

    taskBody.appendChild(span);
    btnsDiv.appendChild(undoBtn);
    btnsDiv.appendChild(deleteBtn);
    taskBody.appendChild(btnsDiv);
    completedTasks.appendChild(taskBody);

    // Remove "No completed tasks" message
    const noCompletedTasksMessageElement = document.getElementById("noCompletedTasksMessage");
    if (noCompletedTasksMessageElement) {
        noCompletedTasksMessageElement.remove();
    }
}

// Add event listener to the new task button
newTaskBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const task = newTask.value.trim();
    if (task.length > 0) {
        addTask(task);
        saveToStorage(task);
        newTask.value = "";
    }
});
