let tasks = [];

function init() {
    includeHTML();
    loadTasks();
    filterToDo();
    filterDone();
    filterProgress();
    filterFeedback();
    document.getElementById('tasks').innerHTML = `${tasks.length}`;
}

function loadTasks() {
    let tasksAsString = localStorage.getItem('tasks');
    tasks = tasksAsString ? JSON.parse(tasksAsString) : [];
}


function filterToDo() {
    let todo = tasks.filter(t => t['category'] == 'to-do');
    document.getElementById('to-do').innerHTML = `${todo.length}`;
}


function filterDone() {
    let done = tasks.filter(t => t['category'] == 'done');
    document.getElementById('done').innerHTML = `${done.length}`;
}


function filterProgress() {
    let inprogress = tasks.filter(t => t['category'] == 'in-progress');
    document.getElementById('task-in-progress').innerHTML = `${inprogress.length}`;
}


function filterFeedback() {
    let awaitFeedback = tasks.filter(t => t['category'] == 'await-feedback');
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