let tasks = [];
let currentTask = 0;
let currentIndex = 1;
let currentDraggedElement;


function loadTasks() {
    // Holen der Tasks aus dem Local Storage
    const tasksFromStorage = localStorage.getItem('tasks');
    
    // Überprüfen, ob Tasks im Local Storage vorhanden sind
    if (tasksFromStorage) {
        // Parsen des JSON-Strings in ein JavaScript-Array und der globalen Variable zuweisen
        tasks = JSON.parse(tasksFromStorage);
    } else {
        // Falls keine Tasks im Local Storage sind, leeres Array setzen
        tasks = [];
    }
}

loadTasks();
console.log(tasks); // Zeigt die geladenen Tasks an


/**
 * function opens render relevated sub functions for generating the page content 
 * includeHTML loads templates
 * updateHTML filters the Array tasks after 'category' : '' to generate the right code into each div / drag area with the correct progress status / category
 * renderBoard renders and generates the HTML code 
 */
function init() {
    includeHTML();
    renderBoard();
}

/**
 * render function, filter category = "to-do","in-progress","await-feedback","done"
 */
function renderBoard() {
    let technicalTask = tasks[0].category;
    let title = tasks[0].title;
    let description = tasks[0].description;
    let subtaskCount = tasks[0].subtaskCount;
    let assignedTo = tasks[0].assignment;
    let priority = tasks[0].priority;
   
    updateHTML(technicalTask, title, description, subtaskCount, assignedTo, priority, currentIndex);
    currentIndex++;
}



function updateHTML(technicalTask, title, description, subtaskCount, assignedTo, priority, currentIndex) {
    let todo = tasks.filter(t => t['category'] == 'to-do');

    document.getElementById('to-do').innerHTML = '';

    for (let index = 0; index < todo.length; index++) {
        const element = open[index];
        document.getElementById('to-do').innerHTML += getToDoHTML(technicalTask, title, description, subtaskCount, assignedTo, priority, currentIndex, element);
    }
}


function getToDoHTML(technicalTask, title, description, subtaskCount, assignedTo, priority, index) {
    return /*html*/`
        <div id="${index}" class="task-container" onclick="openTask(${index})"> <!-- draggable per ID parameter (Junus Video + Code enstprechend implementieren) -->
            <div class="to-do-title-container"><p class="to-do-title">${technicalTask}</p></div> <!-- HTML Code muss entsprechend umgeschrieben werden, sodass von der addTask() Funktion die richtigen Parameter übergeben werden -->
                <div><p class="to-do-task">${title}</p></div> <!-- HTML Code muss entsprechend umgeschrieben werden, sodass von der addTask() Funktion die richtigen Parameter übergeben werden -->
                <div><p class="to-do-task-description">${description}</p></div>
                <div class="progress-container">
                    <div class="progress-wrapper">
                        <div class="progress-bar" id="progress-bar"></div>
                    </div>
                    <div class="progress-count" id="progress-count">${subtaskCount} Subtasks</div>
                </div>
            <div class="attributor-container">
                <div><p class="attributor-icon">${assignedTo}</p></div> <!-- auswählen bei addTask() -->
                <div><img src="${priority}" alt=""></div> <!-- auswählen bei addTask() -->
            </div>
        </div>`;
}

function openTask(index) {
    let container = document.getElementById('task-detail-view-container');
    let task = tasks[index];

    let technicalTask = task.category;
    let title = task.title;
    let description = task.description;
    let dueDate = task.date;
    let priority = task.priority;
    let assignedTo = task.assignment;
    
    let subtasks = '';
    if (task.subtasks && task.subtasks.length > 0) {
        for (let i = 0; i < task.subtasks.length; i++) {
            let subtask = task.subtasks[i];
            subtasks += `<div class="subtask-container-detail-view"><input type="checkbox" id="subtask-checkbox${i}"> ${subtask}</div>`;
        }
    }

    container.innerHTML = '';
    container.innerHTML = getTaskDetailViewHTML(index, technicalTask, title, subtasks, description, dueDate, priority, assignedTo);
    container.classList.remove('d-hide');
    container.classList.add('d-block');
}

function closeTask() {
    let container = document.getElementById('task-detail-view-container');
    container.classList.add('d-hide');
    container.classList.remove('d-block');
}

function getTaskDetailViewHTML(index, technicalTask, title, subtasks, description, dueDate, priority, assignedTo) {
    return /*html*/`
        <div id="detail-task${index}" class="detail-task-container">
            <div class="detail-task-overview">
                <div class="technical-task-container-detail"><p class="technical-task-detail">${technicalTask}</p><img class="close-detail-button" onclick="closeTask()" src="assets/img/icons/close__detailview_icon.svg" alt="close"></div>
                <div><p class="title-detail">${title}</p></div>
                <div><p class="description-detail">${description}</p></div>
                <div class="date-detail"><p>Due Date:</p>${dueDate}</div>
                <div class="priority-detail"><p>Priority:</p>${priority}</div>
                <div class="assigned-detail"><p>Assigned To:</p>
                    <div>${assignedTo}</div>
                </div>
                <div><p>Subtasks</p>${subtasks}</div>
            </div>    
        </div>`;
}


function addTask() {
    
}

function startDragging(id) {
    currentDraggedElement = id;
}

function updateProgressBar() {
    let percent = (currentTask / totalSubtasks) * 100; // Verwendung von totalSubtasks
    percent = Math.round(percent);
    document.getElementById('progress-bar').style.width = percent + "%";
    document.getElementById('progress-count').innerHTML = (currentTask + 1) + "/" + totalSubtasks + " Subtasks"; // Aktualisierung der Subtask-Anzeige
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}