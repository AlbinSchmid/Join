let tasks = [];
let priorityHighDates = [];
let dateToday = new Date();
let closest;
let formatDate = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};


async function init() {
    await loadTasks();
    sortDates();
    showHTML();
}


async function loadTasks() {
    tasks = [];
    let task = await getData('tasks');
    let ids = Object.keys(task || []);
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let allTasks = task[id];
        tasks.push(allTasks);
    }
}


function sortDates() {
    let priorityHigh = tasks.filter(t => t['priorityHigh'] == true);
    for (let i = 0; i < priorityHigh.length; i++) {
        priorityHighDates.push(priorityHigh[i]['date']);
    }

    // Vergleicht die Datums und verwendet das naheliegendste 
    [closest] = priorityHighDates.sort((a, b) => {
        const [aDate, bDate] = [a, b].map(d => Math.abs(new Date(d) - dateToday));
        return aDate - bDate;
    });
}


function showHTML() {
    let todo = tasks.filter(t => t['category'] == 'to-do');
    let done = tasks.filter(t => t['category'] == 'done');
    let priorityHigh = tasks.filter(t => t['priorityHigh'] == true);
    let inprogress = tasks.filter(t => t['category'] == 'in-progress');
    let awaitFeedback = tasks.filter(t => t['category'] == 'await-feedback');
    document.getElementById('to-do').innerHTML = `${todo.length}`;
    document.getElementById('done').innerHTML = `${done.length}`;
    document.getElementById('priority-high').innerHTML = `${priorityHigh.length}`;
    document.getElementById('deadline').innerHTML = `Oktober 10.2020`; // Muss noch angepasst werden normal mit ('en-US', fromatDate)
    document.getElementById('tasks').innerHTML = `${tasks.length}`;
    document.getElementById('task-in-progress').innerHTML = `${inprogress.length}`;
    document.getElementById('awaiting-feedback').innerHTML = `${awaitFeedback.length}`;
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


function changePencilImg(element) {
    document.getElementById('pencil-img').setAttribute('src', './assets/img/icons/summary/pencil-white.png');
}

function resetPencilImg(element) {
    document.getElementById('pencil-img').setAttribute('src', './assets/img/icons/summary/pencil-darkblue.png');
}

function changeCheckImg(element) {
    document.getElementById('check-img').setAttribute('src', './assets/img/icons/summary/check-white.png');
}

function resetCheckImg(element) {
    document.getElementById('check-img').setAttribute('src', './assets/img/icons/summary/check-darkblue.png');
}


function loadBoardPage() {
    window.location.href = "http://127.0.0.1:5500/board.html";
}