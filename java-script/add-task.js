let tasks = [];
let allContacts = [];
let subtasks = [];
let selectedContacts = [];
let subtaskCount = 0;
let taskIdCounter = 0;

async function init() {
    await loadAllContacts();
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
                <form>
                    <div class="assignment-select-container">
                        <input id="dropdownInput" class="assignment-task-assignment" placeholder="Select contacts to assign">
                        <div id="task-assignment" class="dropdown-content"></div>
                    </div>
                    <div id="selected-contacts"></div>
                </form>
            </div>
        </div>                
      <img class="mg-l-r-board" src="assets/img/icons/Vector 4.png" alt="">`;
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
                <input type="checkbox" id="contact-${i}" value="${contact.initials}" data-color="${contact.color}" data-name="${contact.name}" onclick="renderSelectedContacts()">
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
        contactDiv.classList.add('selected-contact');
        contactDiv.textContent = initials;

        selectedContactsContainer.appendChild(contactDiv);
    }
}

function setupDropdown() {
    const input = document.getElementById('dropdownInput');
    const dropdown = document.getElementById('task-assignment');
    const container = document.querySelector('.assignment-select-container');

    input.addEventListener('click', () => {
        const isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
        if (isOpen) {
            container.classList.remove('open');
        } else {
            container.classList.add('open');
        }
    });

    document.addEventListener('click', (event) => {
        if (!input.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = 'none';
            container.classList.remove('open');
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
          <h2>Category<p class="required-color">*</p></h2>
                <form>
                    <div class="custom-select-container">
                        <select class="selectfield-task-category" name="task category" id="task-category" required>
                            <option value="" disabled selected hidden>Select a category</option>
                            <option value="Technical Task">Technical Task</option>
                            <option value="User Story">User Story</option>
                        </select>
                    </div>
                </form>
            <h2>Subtasks</h2>
                    <form>
                        <div class="input-container">
                            <input type="text" class="inputfield-task-subtasks" id="task-subtasks" maxlength="50" placeholder="Add new subtask" onfocus="showInput()">
                            <button type="button" class="add-plus-button" id="add-plus-button" onclick="showInput()"><img src="assets/img/icons/add_subtask_icon.svg" alt=""></button>
                            <div class="subtask-btn-container" id="subtask-btn-container">
                                <button type="button" class="clear-button" onclick="clearInput()"><img src="assets/img/icons/delete_icon.svg" alt=""></button>
                                <img src="assets/img/icons/Vector 19.svg" alt="" class="vector-icon">
                                <button type="button" class="add-button" onclick="createSubtask()"><img src="assets/img/icons/check_edit_icon.svg" alt=""></button>
                            </div>
                        </div>
                        <div class="subtasks-container"></div>
                    </form>
        </div>`;
}

function setupCategoryDropdown() {
    const select = document.getElementById('task-category');
    const container = document.querySelector('.custom-select-container');

    select.addEventListener('click', () => {
        if (container.classList.contains('open')) {
            container.classList.remove('open');
        } else {
            container.classList.add('open');
        }
    });

    document.addEventListener('click', (event) => {
        if (!select.contains(event.target)) {
            container.classList.remove('open');
        }
    });
}

function handleCheckboxClick(clickedCheckbox) {
    const checkboxes = document.querySelectorAll('.dp-flex-jc-sb input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox !== clickedCheckbox) {
            checkbox.checked = false;
        }
    });
}

function createSubtask() {
    let inputField = document.getElementById('task-subtasks');
    let subtaskText = inputField.value.trim();

    if (subtaskText === '') {
        alert('Please enter a subtask.');
        clearInput();
        return;
    }

    subtasks.push(subtaskText);
    subtaskCount++; // Erhöhe den Subtask-Zähler
    clearInput();
    renderSubtasks();
}

function renderSubtasks() {
    let container = document.querySelector('.subtasks-container');
    container.innerHTML = ''; // Leere den Container

    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        container.innerHTML += getSubtasksHTML(subtask);
    }
}

function getSubtasksHTML(subtaskText) {
    return /*html*/`
        <div class="subtask">
            <div class="subtask-text-container">
                <img src="assets/img/icons/punkt.png" alt="">
                <span>${subtaskText}</span>
            </div>
            <div class="subtask-button">
                <img src="assets/img/icons/Subtasks_edit_icon.svg" alt="" class="edit-icon" onclick="editSubtask('${subtaskText}')">
                <img src="assets/img/icons/Vector 19.svg" alt="" class="vector-icon">
                <img src="assets/img/icons/Subtasks_delete_icon.svg" alt="" class="delete-icon" onclick="deleteSubtask('${subtaskText}')"> 
            </div>
        </div>
    `;
}


function editSubtask(subtaskText) {
    let newText = prompt('Edit your subtask:', subtaskText);

    if (newText !== null && newText.trim() !== '') {
        newText = newText.trim();
        let index = subtasks.indexOf(subtaskText);
        if (index !== -1) {
            subtasks[index] = newText;
        }
        renderSubtasks(); // Aktualisiere die Anzeige
    }
}

/**
 * deletes created Subtask inside subtask-container
 * @param {*} subtaskText 
 */

function deleteSubtask(subtaskText) {
    let index = subtasks.indexOf(subtaskText);
    if (index !== -1) {
        subtasks.splice(index, 1);
        subtaskCount--; 
        renderSubtasks();
    }
}

/**
 * clears the inputfield for adding a subtask
 */

function clearInput() {
    document.getElementById('task-subtasks').value = '';
    document.getElementById('subtask-btn-container').style.display = 'none'
    document.getElementById('add-plus-button').style.display = 'flex';
}

/**
 * shows the create subtask function icon and den clear input function icon
 */

function showInput() {
    document.getElementById('task-subtasks').style.display = 'block';
    document.getElementById('add-plus-button').style.display = 'none';
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
    let High = document.getElementById('task-high-priority').checked;
    let Medium = document.getElementById('task-medium-priority').checked;
    let Low = document.getElementById('task-low-priority').checked;
    let taskCategory = document.getElementById('task-category').value;
    console.log(taskDate);

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
        'date': new Date(taskDate),
        'priorityHigh': High,
        'priorityMedium': Medium,
        'priorityLow': Low,
        'taskcategory': taskCategory,
        'subtaskCount': subtaskCount,
        'subtasks': subtasks.slice(), // Add a copy of the subtasks array
        'selectedContact': selectedContacts.slice(),
    };
    tasks.push(task);
    await postData('tasks', task);


    subtaskCount = 0;
    subtasks = [];
    confirmationMessage();
    directToBoard();
}

function confirmationMessage() {
    document.getElementById('add-task-confirmation').classList.remove('d-none');
}

function directToBoard() {
    
    setTimeout(() => {
        window.location.href = 'board.html';
    }, 2000);
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
