let tasks = [];
let allContacts = [];
let subtasks = [];
let selectedContacts = [];
let subtaskCount = 0;
let taskIdCounter = 0;

async function init() {
    await loadAllContacts();
    includeHTML();
    renderAddTaskContent();
    clearInput();
}

/**
 * This function renders the main add-task-content into the section with id = 'add-task-content'
 * container variable
 * 
 */

function renderAddTaskContent() {
    let container = document.getElementById('add-task-content');
    container.innerHTML = getAddTaskHTML();
    setupDropdown();
    renderContactOptions();
}

/**
 * This function returns the addTask HTML Code
 */

function getAddTaskHTML() {
    return getAddTaskHTMLLeftSide() + getAddTaskHTMLRightSide();
}

/**
 * 
 * @returns add task container left side html
 */

function getAddTaskHTMLLeftSide() {
    return /*html*/`
        <div>
            <h2>Title<p class="required-color">*</p></h2>
                <form>
                    <input id="task-title" class="inputfield-title" placeholder="Enter a title" type="text" required>
                </form>
            <h2>Description</h2>
                    <form>
                        <textarea id="task-description" class="textareafied-description" placeholder="Enter a Description" rows="10"></textarea>
                    </form>
            <h2>Assigned to</h2>
                <div>
                    <form><input id="dropdownInput" class="selectfield-task-assignment" placeholder="Select contacts to assign"></form>
                    <div id="task-assignment" class="dropdown-content"></div>
                    <div id="selected-contacts"></div>
                </div>
        </div>                
                
            
      <img class="mg-l-r" src="assets/img/icons/Vector 4.png" alt="">`;

}

function renderContactOptions() {
    let selectElement = document.getElementById('task-assignment');
    let contactsHTML = '';

    for (let i = 0; i < allContacts.length; i++) {
        const contact = allContacts[i];
        contactsHTML += `
            <div class="contact-container">
                <div class="contact-name-container">
                    <div class="initials-container" style="background-color: ${contact.color}">${contact.initials}</div>
                    <span>${contact.name}</span>
                </div>
                <input type="checkbox" id="contact-${i}" value="${contact.initials}" data-color="${contact.color}" data-name="${contact.name}" onclick="renderSelectedContacts('${contact.color}', '${contact.name}', '${contact.initials}')">
            </div>`;
    }
    selectElement.innerHTML = contactsHTML;
}

function renderSelectedContacts() {
    let checkboxes = document.querySelectorAll('#task-assignment input[type="checkbox"]:checked');
    let selectedContactsContainer = document.getElementById('selected-contacts');
    selectedContactsContainer.innerHTML = ''; // Clear previous selection

    selectedContacts = []; // Clear the array

    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        const color = checkbox.dataset.color;
        const name = checkbox.dataset.name;
        const initials = checkbox.value;

        // Push to selectedContacts array
        selectedContacts.push({ color, name, initials });

        const contactDiv = document.createElement('div');
        contactDiv.style.backgroundColor = color;
        contactDiv.classList.add('selected-contacts-container');
        contactDiv.textContent = initials;

        selectedContactsContainer.appendChild(contactDiv);
    }

    // Debug output
    console.log(selectedContacts);
}

function setupDropdown() {
    const input = document.getElementById('dropdownInput');
    const dropdown = document.getElementById('task-assignment');

    input.addEventListener('click', () => {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (event) => {
        if (!input.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    });
}

/**
 * 
 * @returns add task container right side html
 */

function getAddTaskHTMLRightSide() {
    return /*html*/`
      <div>
          <h2>Due Date<p class="required-color">*</p></h2>
              <form>
                  <input id="task-date" type="date" name="task-date" class="date-selector" required>
              </form>
              <h2>Prio</h2>
<div class="dp-flex-jc-sb">
    <input type="checkbox" id="task-high-priority" class="custom-checkbox-high" onclick="handleCheckboxClick(this)">
    <label for="task-high-priority" class="checkbox-container">
        <div class="checkbox-label-high">
            Urgent
            <img class="checkbox-image-high" src="assets/img/icons/prio_high.png" alt="priority high">
        </div>
    </label>
    <input type="checkbox" id="task-medium-priority" class="custom-checkbox-medium" onclick="handleCheckboxClick(this)">
    <label for="task-medium-priority" class="checkbox-container">
        <div class="checkbox-label-medium">
            Medium
            <img class="checkbox-image-medium" src="assets/img/icons/prio_medium.png" alt="priority medium">
        </div>
    </label>
    <input type="checkbox" id="task-low-priority" class="custom-checkbox-low" onclick="handleCheckboxClick(this)">
    <label for="task-low-priority" class="checkbox-container">
        <div class="checkbox-label-low">
            Low
            <img class="checkbox-image-low" src="assets/img/icons/prio_low.png" alt="priority low">
        </div>
    </label>
</div>
                <!-- options müssen ausgelesen werden -->  
          <h2>Category<p class="required-color">*</p></h2>
              <form>
                  <select class="selectfield-task-category" name="task category" id="task-category" required>
                      <option value="" >Select task category</option>
                      <option value="Technical Task">Technical Task</option>
                      <option value="User Story">User Story</option>
                  </select>
              </form>
                <!-- value muss ausgelesen werden für das Array, nachdem select, soll wieder die ersten Option angzeigt werden -->
                <h2>Subtasks</h2>
                    <form>
                        <div class="input-container">
                            <input type="text" class="inputfield-task-subtasks" id="task-subtasks" maxlength="50" placeholder="Add new subtask" onfocus="showInput()">
                            <button type="button" class="add-plus-button" id="add-plus-button" onclick="showInput()"><img src="assets/img/icons/add_subtask_icon.svg" alt=""></button>
                            <div class="subtask-btn-container" id="subtask-btn-container">
                                <button type="button" class="clear-button" onclick="clearInput()"><img src="assets/img/icons/delete_icon.svg" alt=""></button>
                                <button type="button" class="add-button" onclick="createSubtask()"><img src="assets/img/icons/check_edit_icon.svg" alt=""></button>
                            </div>
                        </div>
                        <div class="subtasks-container"></div>
                    </form>

          </div>`;
}

function handleCheckboxClick(clickedCheckbox) {
    const checkboxes = document.querySelectorAll('.dp-flex-jc-sb input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox !== clickedCheckbox) {
            checkbox.checked = false;
        }
    });
}

function clearInput() {
    document.getElementById('task-subtasks').value = '';
    removeInput();
}

function createSubtask() {
    let inputField = document.getElementById('task-subtasks');
    let subtaskText = inputField.value.trim();

    if (subtaskText === '') {
        alert('Please enter a subtask.');
        return;
    }

    let subtaskElement = document.createElement('div');
    subtaskElement.className = 'subtask';

    let subtaskTextElement = document.createElement('span');
    subtaskTextElement.className = 'subtask-text';
    subtaskTextElement.textContent = subtaskText;

    let editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Edit';
    editButton.onclick = () => editSubtask(subtaskElement, subtaskTextElement);

    let deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteSubtask(subtaskElement, subtaskText);

    subtaskElement.appendChild(subtaskTextElement);
    subtaskElement.appendChild(editButton);
    subtaskElement.appendChild(deleteButton);

    document.querySelector('.subtasks-container').appendChild(subtaskElement);

    subtasks.push(subtaskText);
    subtaskCount++; // Erhöhe den Subtask-Zähler
    clearInput();
    removeInput();
}

function editSubtask(subtaskElement, subtaskTextElement) {
    let oldText = subtaskTextElement.textContent;
    let newText = prompt('Edit your subtask:', oldText);

    if (newText !== null && newText.trim() !== '') {
        newText = newText.trim();
        subtaskTextElement.textContent = newText;
        let index = subtasks.indexOf(oldText);
        if (index !== -1) {
            subtasks[index] = newText;
        }
    }
}

function deleteSubtask(subtaskElement, subtaskText) {
    subtaskElement.remove();
    let index = subtasks.indexOf(subtaskText);
    if (index !== -1) {
        subtasks.splice(index, 1);
        subtaskCount--; // Verringere den Subtask-Zähler
    }
    subtaskElement.remove();
}

function showInput() {
    document.getElementById('task-subtasks').style.display = 'block';
    document.getElementById('add-plus-button').style.display = 'none';
    document.getElementById('subtask-btn-container').style.display = 'flex';
}

function removeInput() {
    document.getElementById('add-plus-button').style.display = 'flex';
    document.getElementById('subtask-btn-container').style.display = 'none';
}


function showButtons() {
    document.getElementById('subtask-btn-container').style.display = 'flex';
}

function clearTask() {
    init();
}

async function createTask() {
    let taskTitle = document.getElementById('task-title').value;
    let taskDescription = document.getElementById('task-description').value;
    let taskAssignment = document.getElementById('task-assignment').value;
    let taskDate = document.getElementById('task-date').value;
    let taskPriorityHigh = document.getElementById('task-high-priority').checked;
    let taskPriorityMedium = document.getElementById('task-medium-priority').checked;
    let taskPriorityLow = document.getElementById('task-low-priority').checked;
    let taskCategory = document.getElementById('task-category').value;

    tasks = [];
    let taskFireBase = await getData('tasks');
    let ids = Object.keys(taskFireBase || []);
    id = ids.length + 1;

    // Überprüfen, ob taskTitle, taskDate und taskCategory ausgefüllt sind
    if (taskTitle === '' || taskDate === '' || taskCategory === '') {
        alert('Bitte füllen Sie die Felder "Titel", "Datum" und "Kategorie" aus.');
        return; // Beenden der Funktion, wenn die Felder nicht ausgefüllt sind
    }

    let task = {
        'id': id,
        'category': 'to-do',
        'title': taskTitle,
        'description': taskDescription,
        'assignment': taskAssignment,
        'date': taskDate,
        'priorityHigh': taskPriorityHigh,
        'priorityMedium': taskPriorityMedium,
        'priorityLow': taskPriorityLow,
        'taskcategory': taskCategory,
        'subtaskCount': subtaskCount,
        'subtasks': subtasks.slice(), // Add a copy of the subtasks array
        'selectedContact': selectedContacts.slice(),
    };
    tasks.push(task);
    await postData('tasks', task);


    subtaskCount = 0;
    subtasks = [];
    directToBoard();
}

function directToBoard() {
    setTimeout(() => {
        window.location.href = 'board.html';
    }, 2000);
}


async function initializeTasks() {
    try {
        let response = await fetch('https://your-firebase-url.firebaseio.com/tasks.json');
        let data = await response.json();

        if (data) {
            tasks = Object.values(data);
            taskIdCounter = tasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1;
        } else {
            taskIdCounter = 1;
        }
    } catch (error) {
        console.error('Error fetching tasks from Firebase:', error);
    }
}

async function loadAllContacts() {
    allContacts = [];
    let contacts = await getData('contacts');
    let ids = Object.keys(contacts || []);
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let contact = contacts[id];
        contact.id = id;
        allContacts.push(contact);
    }
    console.log(allContacts);
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

function toggleDropdown() {
    var dropdownMenu = document.getElementById("dropdownMenu");
    if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
    } else {
        dropdownMenu.style.display = "block";
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropdown-toggle')) {
        var dropdowns = document.getElementsByClassName("dropdown-menu");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
}
