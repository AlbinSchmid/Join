let currentTask = 0;
const totalSubtasks = 2;

function init() {
    includeHTML();
    renderBoard();
}

function renderBoard() {
    let container = document.getElementById('to-do-id');
    container.innerHTML = '';
    /* for loop => Array anlegen, welches über addTask() gepusht wird in local storage und parameter an die Render Funktion übergibt */
    container.innerHTML = getToDoHTML();
}

function getToDoHTML() {
    return /*html*/`
        <div id="to-do${1}" class="to-do-task-container" onclick="openTask()"> <!-- draggable per ID parameter (Junus Video + Code enstprechend implementieren) -->
            <div class="to-do-title-container"><p class="to-do-title">User Story</p></div> <!-- HTML Code muss entsprechend umgeschrieben werden, sodass von der addTask() Funktion die richtigen Parameter übergeben werden -->
                <div><p class="to-do-task">Contact Form & Imprint</p></div> <!-- HTML Code muss entsprechend umgeschrieben werden, sodass von der addTask() Funktion die richtigen Parameter übergeben werden -->
                <div><p class="to-do-task-description">Create a contact form and imprint page...</p></div>
                <div class="progress-container">
                    <div class="progress-wrapper">
                        <div class="progress-bar" id="progress-bar"></div>
                    </div>
                    <div class="progress-count" id="progress-count">1/2 Subtasks</div>
                </div>
            <div class="attributor-container">
                <div><p class="attributor-icon">FE</p></div> <!-- auswählen bei addTask() -->
                <div><img src="assets/img/icons/prio_baja_high.svg" alt=""></div> <!-- auswählen bei addTask() -->
            </div>
        </div>`;
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