let tasks = [];
let allContacts = [];
let currentTask = 0;
let currentIndex = 0;
let subtasks = [];
let selectedContacts = [];
let subtaskCount = 0;
let taskIdCounter = 0;
let currentDraggedElement;


/**
 * function opens render relevated sub functions for generating the page content 
 * includeHTML loads templates
 * updateHTML filters the Array tasks after 'category' : '' to generate the right code into each div / drag area with the correct progress status / category
 * renderBoard renders and generates the HTML code 
 */
async function init() {
    await loadTasks();
    await loadAllContacts();
    includeHTML();
    updateHTML();
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
    console.log(tasks); // Zeigt die geladenen Tasks an
}

function updateHTML() {
    let todo = tasks.filter(t => t['category'] == 'to-do');
    document.getElementById('to-do').innerHTML = '';
    for (let index = 0; index < todo.length; index++) {
        const element = todo[index];
        let technicalTask = element.taskcategory;
        let category = element.category;
        let title = element.title;
        let description = element.description;
        let subtaskCount = element.subtaskCount;
        let assignedTo = element.selectedContact ? generateContactHTML(element.selectedContact) : '';
        let priority = generatePriorityHTML(element);

        document.getElementById('to-do').innerHTML += getToDoHTML(technicalTask, title, description, subtaskCount, assignedTo, priority, index, todo, category);
    }

    let inprogress = tasks.filter(t => t['category'] == 'in-progress');
    document.getElementById('in-progress').innerHTML = '';
    for (let index = 0; index < inprogress.length; index++) {
        const element = inprogress[index];
        let technicalTask = element.taskcategory;
        let category = element.category;
        let title = element.title;
        let description = element.description;
        let subtaskCount = element.subtaskCount;
        let assignedTo = element.selectedContact ? generateContactHTML(element.selectedContact) : '';
        let priority = generatePriorityHTML(element);

        document.getElementById('in-progress').innerHTML += getToDoHTML(technicalTask, title, description, subtaskCount, assignedTo, priority, index, inprogress, category);
    }

    let awaitFeedback = tasks.filter(t => t['category'] == 'await-feedback');
    document.getElementById('await-feedback').innerHTML = '';
    for (let index = 0; index < awaitFeedback.length; index++) {
        const element = awaitFeedback[index];
        let technicalTask = element.taskcategory;
        let category = element.category;
        let title = element.title;
        let description = element.description;
        let subtaskCount = element.subtaskCount;
        let assignedTo = element.selectedContact ? generateContactHTML(element.selectedContact) : '';
        let priority = generatePriorityHTML(element);

        document.getElementById('await-feedback').innerHTML += getToDoHTML(technicalTask, title, description, subtaskCount, assignedTo, priority, index, awaitFeedback, category);
    }

    let done = tasks.filter(t => t['category'] == 'done');
    document.getElementById('done').innerHTML = '';
    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        let technicalTask = element.taskcategory;
        let category = element.category;
        let title = element.title;
        let description = element.description;
        let subtaskCount = element.subtaskCount;
        let assignedTo = element.selectedContact ? generateContactHTML(element.selectedContact) : '';
        let priority = generatePriorityHTML(element);

        document.getElementById('done').innerHTML += getToDoHTML(technicalTask, title, description, subtaskCount, assignedTo, priority, index, done, category);
    }
}

function generateContactHTML(selectedContact) {
    let contactHTML = '';
    for (let i = 0; i < selectedContact.length; i++) {
        let contact = selectedContact[i];
        contactHTML += `<div class="attributor-icon" style="background-color: ${contact.color}">${contact.initials}</div>`;
    }
    return contactHTML;
}

function generatePriorityHTML(task) {
    let priorityHTML = '';
    if (task.priorityHigh) {
        priorityHTML = '<div class="priority-icon"><img src="assets/img/icons/prio_high.png" alt="High Priority"></div>';
    } else if (task.priorityMedium) {
        priorityHTML = '<div class="priority-icon"><img src="assets/img/icons/prio_medium.png" alt="Medium Priority"></div>';
    } else if (task.priorityLow) {
        priorityHTML = '<div class="priority-icon"><img src="assets/img/icons/prio_low.png" alt="Low Priority"></div>';
    }
    return priorityHTML;
}




function getToDoHTML(technicalTask, title, description, subtaskCount, assignedTo, priority, index, category) {
    return /*html*/`
        <div draggable="true" ondragstart="startDragging(${category[index]['id']})" class="task-container" onclick="openTask(${category[index]['id']})">
            <div class="to-do-title-container"><p class="to-do-title">${technicalTask}</p></div>
            <div><p class="to-do-task">${title}</p></div>
            <div><p class="to-do-task-description">${description}</p></div>
            <div class="progress-container">
                <div class="progress-wrapper">
                    <div class="progress-bar" id="progress-bar"></div>
                </div>
                <div class="progress-count" id="progress-count">${subtaskCount} Subtasks</div>
            </div>
            <div class="attributor-container">
                <div class="assigned-container">${assignedTo}</div> 
                <div>${priority}</div>
            </div>
            
        </div>`;
}





function openTask(taskId) {
    let container = document.getElementById('task-detail-view-container');
    let task = tasks.find(task => task.id === taskId);

    if (!task) {
        console.error('Task not found');
        return;
    }

    let technicalTask = task.taskcategory;
    let category = task.category;
    let title = task.title;
    let description = task.description;
    let dueDate = task.date;
    let priority = generateDetailedPriorityHTML(task);
    let assignedTo = generateDetailedContactHTML(task.selectedContact);

    let subtasks = '';
    if (task.subtasks && task.subtasks.length > 0) {
        for (let i = 0; i < task.subtasks.length; i++) {
            let subtask = task.subtasks[i];
            subtasks += `<div class="subtask-container-detail-view"><input type="checkbox" id="subtask-checkbox${i}"> ${subtask}</div>`;
        }
    }

    container.innerHTML = '';
    container.innerHTML = getTaskDetailViewHTML(taskId, technicalTask, title, subtasks, description, dueDate, priority, assignedTo, category);
    container.classList.remove('d-hide');
    container.classList.add('d-block');
}

function closeTask() {
    let container = document.getElementById('task-detail-view-container');
    container.classList.add('d-hide');
    container.classList.remove('d-block');
}

function getTaskDetailViewHTML(taskId, technicalTask, title, subtasks, description, dueDate, priority, assignedTo) {
    return /*html*/`
        <div id="detail-task${taskId}" class="detail-task-container">
            <div class="detail-task-overview">
                <div class="technical-task-container-detail"><p class="technical-task-detail">${technicalTask}</p><img class="close-detail-button" onclick="closeTask()" src="assets/img/icons/close__detailview_icon.svg" alt="close"></div>
                <div><p class="title-detail">${title}</p></div>
                <div><p class="description-detail">${description}</p></div>
                <div class="date-detail"><p>Due Date:</p>${dueDate}</div>
                <div class="priority-detail"><p>Priority:</p>${priority}</div>
                <div class="assigned-detail"><p>Assigned To:</p>
                    <div>${assignedTo}</div>
                </div>
                <div><p class="subtask-headline">Subtasks</p>${subtasks}</div>
            </div>    
        </div>`;
}

function generateDetailedContactHTML(selectedContact) {
    let contactHTML = '';
    for (let i = 0; i < selectedContact.length; i++) {
        let contact = selectedContact[i];
        contactHTML += `
            <div class="contact-detail">
                <div class="attributor-icon" style="background-color: ${contact.color}">${contact.initials}</div>
                <p>${contact.name}</p>
            </div>`;
    }
    return contactHTML;
}

function generateDetailedPriorityHTML(task) {
    let priorityHTML = '';
    if (task.priorityHigh) {
        priorityHTML = `
            <div class="priority-detail-container">
                <p>High</p> 
                <img src="assets/img/icons/prio_high.png" alt="High Priority"> 
            </div>`;
    } else if (task.priorityMedium) {
        priorityHTML = `
            <div class="priority-detail-container">
                <p>Medium</p>   
                <img src="assets/img/icons/prio_medium.png" alt="Medium Priority">
            </div>`;
    } else if (task.priorityLow) {
        priorityHTML = `
            <div class="priority-detail-container">
                <p>Low</p>
                <img src="assets/img/icons/prio_low.png" alt="Low Priority">
            </div>`;
    }
    return priorityHTML;
}





function addTask() {
    let container = document.getElementById('addTask-board');
    container.classList.remove('d-none');
    container.innerHTML = '';  // Clear the container

    let headerContainer = document.createElement('div');
    headerContainer.id = 'addTask-board-header';
    headerContainer.className = 'addTask-board-header';

    let renderContainer = document.createElement('div');
    renderContainer.id = 'addTask-board-render-container';
    renderContainer.className = 'addTask-board-render-container';

    let footerContainer = document.createElement('div');
    footerContainer.id = 'addTask-board-footer';
    footerContainer.className = 'addTask-board-footer';

    container.appendChild(headerContainer);
    container.appendChild(renderContainer);
    container.appendChild(footerContainer);

    getAddTaskHTML();
}

function getAddTaskHTML() {
    let containerHeader = document.getElementById('addTask-board-header');
    let container = document.getElementById('addTask-board-render-container');
    let containerFooter = document.getElementById('addTask-board-footer');
    containerHeader.innerHTML += getAddTaskHTMLHeader();
    container.innerHTML +=  getAddTaskHTMLLeftSide() + getAddTaskHTMLRightSide();
    containerFooter.innerHTML += getAddTaskHTMLFooter();
    setupDropdown();
    renderContactOptions(); // Ensure contacts are rendered
}

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
                        <input id="dropdownInput" class="selectfield-task-assignment" placeholder="Select contacts to assign">
                        <div id="task-assignment" class="dropdown-content"></div>
                        <div id="selected-contacts"></div>
                    </div>
                </form>
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

        selectedContacts.push({ color, name, initials });

        const contactDiv = document.createElement('div');
        contactDiv.style.backgroundColor = color;
        contactDiv.classList.add('selected-contacts-container');
        contactDiv.textContent = initials;

        selectedContactsContainer.appendChild(contactDiv);
    }

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
                <div class="custom-select-container">
                    <select class="selectfield-task-category" name="task category" id="task-category" required>
                        <option value="" disabled selected hidden>Select a category</option>
                        <option value="Technial Task">Technial Task</option>
                        <option value="User Story">User Story</option>
                    </select>
                </div>
            </form>
                <!-- value muss ausgelesen werden für das Array, nachdem select, soll wieder die ersten Option angzeigt werden -->
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

function getAddTaskHTMLHeader() {
    return /*html*/`
        <div class="addTask-board-header-content">
            <span>Add Task</span>
            <img class="close-detail-button" src="assets/img/icons/close__detailview_icon.svg" alt="close" onclick="closeAddTask()">
        </div>
    `
}

function closeAddTask() {
    document.getElementById('addTask-board').classList.add('d-none');
}

function getAddTaskHTMLFooter() {
    return /*html*/`
        <div class="add-task-footer-board">
            <div class="dp-flex"><p class="required-color">*</p>This field is required</div>
            <div class="footer-btn-container">
                <button onclick="clearTask()" class="clear-task-btn">Clear X</button>
                <button id="create-task" onclick="createTask()" class="create-task-btn">Create Task<img src="assets/img/icons/check.svg" alt=""></button><!-- Alert! Task added to Board -> Weiterleitung auf board.html -->
            </div>
        </div>
    `
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
    document.getElementById('addTask-board').classList.add('d-none');
    init();
}

function startDragging(index) {
    currentDraggedElement = index - 1;
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(category) {
    tasks = [];
    let taskFireBase = await getData('tasks');
    let ids = Object.keys(taskFireBase || []);
        let id = ids[currentDraggedElement];
    await putData(`tasks/${id}/category`, category);
    await getData('tasks');
    init();
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

// Funktion zur Aktualisierung der Fortschrittsanzeige
function updateProgressBar() {
    let totalSubtasks = tasks.length; // Die Länge von tasks als totalSubtasks übernehmen
    if (totalSubtasks === 0) {
        // Vermeiden von Division durch 0
        document.getElementById('progress-bar').style.width = "0%";
        document.getElementById('progress-count').innerHTML = "0/0 Subtasks";
        return;
    }
    
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