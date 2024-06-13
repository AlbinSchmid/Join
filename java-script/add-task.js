let tasks = [];
let allContacts = [];
let subtasks = [];
let selectedContacts = [];
let subtaskCount = 0;
let taskIdCounter = 0;


/**
 * init function which starts all relevant functions which are necessary to render the page content
 */
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
            <div class="jc-center">
                <form class="contacts-form">
                    <div class="assignment-select-container">
                        <input id="dropdownInput" class="assignment-task-assignment" placeholder="Select contacts to assign">
                        <div id="task-assignment" class="dropdown-content"></div>
                    </div>
                    <div id="selected-contacts"></div>
                </form>
            </div>
        </div>                
      <img class="mg-l-r" src="assets/img/icons/Vector 4.png" alt="">`;
}

/**
 * renders the contact options, which are selectable
 */
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

/**
 * renders the selected contacts below the choose window
 */
function renderSelectedContacts() {
    let checkboxes = document.querySelectorAll('#task-assignment input[type="checkbox"]:checked');
    let selectedContactsContainer = document.getElementById('selected-contacts');
    selectedContactsContainer.innerHTML = ''; 
    selectedContacts = []; 

    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        const color = checkbox.dataset.color;
        const name = checkbox.dataset.name;
        const initials = checkbox.value;

        selectedContacts.push({ color, name, initials });

        const contactDiv = document.createElement('div');
        contactDiv.style.backgroundColor = color;
        contactDiv.classList.add('selected-contacts-container');
        contactDiv.textContent = initials;

        selectedContactsContainer.appendChild(contactDiv);
    }
}

/**
 * opens the dropdown menu and adds the eventlistener with a click event
 */
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
                        <input type="checkbox" id="task-medium-priority" class="custom-checkbox-medium" onclick="handleCheckboxClick(this)" checked>
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
                    <form class="subtask-form">
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

/**
 * opens the task category dropdown menu with eventlistener click event
 */
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

/**
 * 
 * @param {*} clickedCheckbox recieves the input out of the checkboxes for the priority election 
 */
function handleCheckboxClick(clickedCheckbox) {
    const checkboxes = document.querySelectorAll('.dp-flex-jc-sb input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox !== clickedCheckbox) {
            checkbox.checked = false;
        }
    });
}

/**
 * 
 * @returns creates a new subtask and pushes the information into the array subtask for rendering afterwards
 */
function createSubtask() {
    let inputField = document.getElementById('task-subtasks');
    let subtaskText = inputField.value.trim();

    if (subtaskText === '') {
        alert('Please enter a subtask.');
        clearInput();
        return;
    }

    subtasks.push(subtaskText);
    subtaskCount++; 
    clearInput();
    renderSubtasks();
}

/**
 * recives the the subtask text out of the array and calls subTaskHTML function
 */
function renderSubtasks() {
    let container = document.querySelector('.subtasks-container');
    container.innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        container.innerHTML += getSubtasksHTML(subtask);
    }
}

/**
 * 
 * @param {*} subtaskText 
 * @returns subtask html generated by the input field
 */
function getSubtasksHTML(subtaskText) {
    return /*html*/`
        <div class="subtask" data-subtask-text="${subtaskText}">
            <div class="subtask-text-container">
                <img src="assets/img/icons/punkt.png" alt="">
                <span>${subtaskText}</span>
            </div>
            <div class="subtask-button">
                <img src="assets/img/icons/Subtasks_edit_icon.svg" alt="" class="edit-icon" onclick="editSubtask('${subtaskText}')">
                <img src="assets/img/icons/Vector 19.svg" alt="" class="vector-icon">
                <img src="assets/img/icons/Subtasks_delete_icon.svg" alt="" class="delete-icon" onclick="deleteSubtask('${subtaskText}')"> 
            </div>
        </div>`;
}


/**
 * 
 * @param {*} subtaskText edit form validation pop up window for the subtasks content
 */
function editSubtask(subtaskText) {
    let index = subtasks.indexOf(subtaskText);
    if (index !== -1) {
        // Erstelle ein neues Input-Feld und fülle es mit dem aktuellen Subtask-Text
        let subtaskElement = document.querySelector(`[data-subtask-text="${subtaskText}"]`);
        subtaskElement.innerHTML = `
            <div class="subtask-edit-container">
                <input type="text" class="input-edit-subtask" value="${subtaskText}" onblur="saveEditedSubtask(this, ${index})" />
                <button class="add-button" onclick="saveEditedSubtask(this.previousElementSibling, ${index})"><img src="assets/img/icons/check_edit_icon.svg" alt=""></button>
            </div>`;
        subtaskElement.querySelector('.input-edit-subtask').focus();
    }
}

function saveEditedSubtask(input, index) {
    let newText = input.value.trim();
    if (newText !== '' && index !== -1) {
        subtasks[index] = newText;
        renderSubtasks();
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

/**
 * resets the addTask content and refreshs the page
 */
function clearTask() {
    deleteSubtask();
    init();
}

/**
 * 
 * @returns creates the an object which is pushed into the firebase array tasks, which includes all informations choosen by in input fields
 */
async function createTask() {
    let taskTitle = document.getElementById('task-title').value;
    let taskDescription = document.getElementById('task-description').value;
    let taskAssignment = document.getElementById('task-assignment').value;
    let taskDate = document.getElementById('task-date').value;
    let High = document.getElementById('task-high-priority').checked;
    let Medium = document.getElementById('task-medium-priority').checked;
    let Low = document.getElementById('task-low-priority').checked;
    let taskCategory = document.getElementById('task-category').value;
    tasks = [];
    let taskFireBase = await getData('tasks');
    let ids = Object.keys(taskFireBase || []);
    id = ids.length + 1;
  
    if (taskTitle === '' || taskDate === '' || taskCategory === '') {
        alert('Bitte füllen Sie die Felder "Titel", "Datum" und "Kategorie" aus.');
        return; 
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
        'subtasks': subtasks.slice(),
        'selectedContact': selectedContacts.slice(),
    };

    tasks.push(task);
    await postData('tasks', task);
    subtaskCount = 0;
    subtasks = [];
    confirmationMessage();
    directToBoard();
}

/**
 * confirmation message after a task is created
 */
function confirmationMessage() {
    document.getElementById('add-task-confirmation').classList.remove('d-none');
}

/**
 * board.html is called and will be shown after a timeout of 2 secs
 */
function directToBoard() {
    setTimeout(() => {
        window.location.href = 'board.html';
    }, 2000);
}

/**
 * loads all Contacts out of the firebase array allContacts
 */
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
}

/**
 * toggle the dropdown menu
 */
function toggleDropdown() {
    let dropdownMenu = document.getElementById("dropdownMenu");
    if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
    } else {
        dropdownMenu.style.display = "block";
    }
}

/**
 * 
 * @param {} event activates the dropdown menu 
 */
window.onclick = function (event) {
    if (!event.target.matches('.dropdown-toggle')) {
        let dropdowns = document.getElementsByClassName("dropdown-menu");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
}
