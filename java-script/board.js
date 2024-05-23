let tasks = [];

let currentTask = 0;
const totalSubtasks = 2;


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

function init() {
    includeHTML();
    renderBoard();
}

function renderBoard() {
    let container = document.getElementById('to-do-id');
    let technicalTask = tasks[0].category;
    let subtask = tasks[0].subtasks;
    let description = tasks[0].description;
    let subtaskCount = tasks[0].subtaskCount;
    let assignedTo = tasks[0].assignment;
    let priority = tasks[0].priorityMedium;
    container.innerHTML = '';
    /* for loop => Array anlegen, welches über addTask() gepusht wird in local storage und parameter an die Render Funktion übergibt */
    container.innerHTML = getToDoHTML(technicalTask, subtask, description, subtaskCount, assignedTo, priority);
}

function getToDoHTML(technicalTask, subtask, description, subtaskCount, assignedTo, priority) {
    return /*html*/`
        <div id="to-do${1}" class="to-do-task-container" onclick="openTask()"> <!-- draggable per ID parameter (Junus Video + Code enstprechend implementieren) -->
            <div class="to-do-title-container"><p class="to-do-title">${technicalTask}</p></div> <!-- HTML Code muss entsprechend umgeschrieben werden, sodass von der addTask() Funktion die richtigen Parameter übergeben werden -->
                <div><p class="to-do-task">${subtask}</p></div> <!-- HTML Code muss entsprechend umgeschrieben werden, sodass von der addTask() Funktion die richtigen Parameter übergeben werden -->
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

function addTask() {
    
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