let currentTask = 0;
const totalSubtasks = 2;

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