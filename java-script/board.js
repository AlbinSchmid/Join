let tasks = [];
let allContacts = [];
let currentIndex = 0;
let subtasks = [];
let selectedContacts = [];
let subtaskCount = 0;
let taskIdCounter = 0;
let currentDraggedElement;


/**
 * function opens render relevated sub functions for generating the page content 
 * updateHTML filters the Array tasks after 'category' : '' to generate the right code into each div / drag area with the correct progress status / category
 * renderBoard renders and generates the HTML code 
 */
async function init() {
    await loadTasks();
    await loadAllContacts();
    updateHTML();
}





function searchTask(searchBar) {
    let searchTask = document.getElementById('search-field-board').value.toLowerCase();
    let searchTaskMobile = document.getElementById('search-field-board-mobile').value.toLowerCase();

    // Check if the searchbar is on desktop or on phone
    if (searchBar === 'desktop') {
        FilterAndShowTaskOnDesktop(searchTask);
    } else {
        FilterAndShowTaskOnMobile(searchTaskMobile);
    }
}

function FilterAndShowTaskOnDesktop(searchTask) {
    if (searchTask.length === 1) {
        updateHTML();
    } else {
        // Filter the tasks based on the search term
        let filteredTasks = tasks.filter(task => {
            let title = task['title'].toLowerCase();
            let description = task['description'].toLowerCase();
            return title.includes(searchTask) || description.includes(searchTask);
        });

        // Update the HTML to display only the filtered tasks
        updateHTML(filteredTasks);
    }
}


function FilterAndShowTaskOnMobile(searchTaskMobile) {
    if (searchTaskMobile.length === 1) {
        updateHTML();
    } else {
        // Filter the tasks based on the search term
        let filteredTasks = tasks.filter(task => {
            let title = task['title'].toLowerCase();
            let description = task['description'].toLowerCase();
            return title.includes(searchTaskMobile) || description.includes(searchTaskMobile);
        });

        // Update the HTML to display only the filtered tasks
        updateHTML(filteredTasks);
    }
}





/**
 * upadtes the HTML content on the board, when tasks are moved by drag&drop
 * filters after categorys inside the tasks array
 */
function updateHTML(filteredTasks = tasks) {
    const dragAreas = ['to-do', 'in-progress', 'await-feedback', 'done'];

    dragAreas.forEach(areaId => {
        let tasksInArea = filteredTasks.filter(t => t['category'] == areaId);
        const areaElement = document.getElementById(areaId);
        areaElement.innerHTML = '';

        for (let index = 0; index < tasksInArea.length; index++) {
            const element = tasksInArea[index];
            let taskcategory = element.taskcategory;
            let category = element.category;
            let title = element.title;
            let description = element.description;
            let subtaskCount = element.subtaskCount;
            let assignedTo = element.selectedContact ? generateContactHTML(element.selectedContact) : '';
            let priority = generatePriorityHTML(element);
            let backgroundColor = getBackgroundColor(taskcategory);

            areaElement.innerHTML += getToDoHTML(taskcategory, title, description, subtaskCount, assignedTo, priority, index, tasksInArea, backgroundColor);
        }
    });
}


/**
 * 
 * @param {*} selectedContact parameter for choosing the right object, within in the array
 * @returns contactHTML with for-loop through array tasks, individuell css design for overlapping effect
 */
function generateContactHTML(selectedContact) {
    if (!selectedContact || selectedContact.length === 0) {
        return '';
    }

    let contactHTML = '';
    for (let i = 0; i < selectedContact.length; i++) {
        let contact = selectedContact[i];
        const assignedContainerStyle = `margin-left: ${i === 0 ? '0' : '-10px'};`;
        contactHTML += `<div class="attributor-icon" style="background-color: ${contact.color}; ${assignedContainerStyle}">${contact.initials}</div>`;
    }
    return contactHTML;
}

/**
 * 
 * @param {} task 
 * @returns priority image for updateHTML with if else query
 */
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

/**
 * 
 * @param {} taskcategory 
 * @returns defines the background color depending on the choosen taskcategory
 */
function getBackgroundColor(taskcategory) {
    let backgroundColor = '';

    if (taskcategory === 'Technical Task') {
        backgroundColor = 'technical-task-color';
    } else if (taskcategory === 'User Story') {
        backgroundColor = 'user-story-color';
    }
    return backgroundColor;
}



/**
 * parameters got from updateHTML() to render the right content 
 * @param {*} technicalTask 
 * @param {*} title 
 * @param {*} description 
 * @param {*} subtaskCount 
 * @param {*} assignedTo 
 * @param {*} priority 
 * @param {*} index 
 * @param {*} category 
 * @returns HTML for the board content
 */
function getToDoHTML(taskcategory, title, description, subtaskCount, assignedTo, priority, index, category, backgroundColor) {
    return /*html*/`
        <div draggable="true" ondragstart="startDragging(${category[index]['id']})" class="task-container" onclick="openTask(${category[index]['id']})">
            <div class="to-do-title-container">
                <p class="to-do-title ${backgroundColor}">${taskcategory}</p>
            </div>
            <div ><p id="to-do-task" class="to-do-task">${title}</p></div>
            <div><p class="to-do-task-description">${description}</p></div>
            <div class="progress-container">
                <div class="progress-wrapper">
                    <div class="progress-bar" id='progress-bar${category[index]['id']}'></div>
                </div>
                <div class="progress-count" id="progress-count${category[index]['id']}">0/${subtaskCount} Subtasks</div>
            </div>
            <div class="attributor-container">
                <div class="assigned-container">${assignedTo}</div> 
                <div>${priority}</div>
            </div>
        </div>`;
}


/**
 * updates progressBar but does not work correctly yet
 */
function updateProgressBar(i) {
    let totalSubtasks = document.querySelectorAll('.subtask-container-detail-view input[type="checkbox"]').length;
    let completedSubtasks = document.querySelectorAll('.subtask-container-detail-view input[type="checkbox"]:checked').length;
    console.log(completedSubtasks);

    let percent = (completedSubtasks / totalSubtasks) * 100;
    percent = Math.round(percent);

    document.getElementById(`progress-bar${i}`).style.width = percent + "%";
    document.getElementById(`progress-count${i}`).innerHTML = `${completedSubtasks}/${totalSubtasks} Subtasks`;
}

/**
 * calls the getTaskDetailViewHTML where are more informations rendered, and also a callback function for the progress bar
 * @param {*} taskId parameter necessary to get right task container and open the right content
 * @param {*} callback 
 * @returns 
 */
function openTask(taskId, callback) {
    let container = document.getElementById('task-detail-view-container');
    let task = tasks.find(task => task.id === taskId);
    currentTask = tasks.findIndex(task => task.id === taskId);

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
            subtasks += `<div class="subtask-container-detail-view"><input type="checkbox" id="subtask-checkbox${i}" onclick="updateProgressBar(${taskId})"> ${subtask}</div>`;
        }
    }

    container.innerHTML = '';
    container.innerHTML = getTaskDetailViewHTML(taskId, technicalTask, title, subtasks, description, dueDate, priority, assignedTo, category);
    container.classList.remove('d-hide');
    container.classList.add('d-block');
    // document.getElementById('body').classList.add('overflow-hidden');
    container.dataset.callback = callback;
}

/**
 * closes the fullscreen task view
 */
function closeTask() {
    let container = document.getElementById('task-detail-view-container');

    if (typeof container.dataset.callback === 'function') {
        let task = tasks.find(task => task.id === taskId);
        container.dataset.callback(task.subtasks.length);
    }

    container.classList.add('d-hide');
    container.classList.remove('d-block');
    // document.getElementById('body').classList.remove('overflow-hidden');
}

/**
 * 
 * @param {*} taskId 
 * @param {*} technicalTask 
 * @param {*} title 
 * @param {*} subtasks 
 * @param {*} description 
 * @param {*} dueDate 
 * @param {*} priority 
 * @param {*} assignedTo 
 * @returns fullscreen View with more informations then the normal board view, parameters deliever the right objects and their value out of the Array tasks
 */
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
                    <div class="detail-view-contacts-list">${assignedTo}</div>
                </div>
                <div><p class="subasks-headline">Subtasks</p>${subtasks}</div>
                <div class="edit-delete">
                        <div onclick="deleteTask(${taskId})" class="edit-delete-btn cp">
                            <img src="./assets/img/icons/contact/delete_black.png" alt="delete">
                            <img src="./assets/img/icons/contact/delete_blue.png" alt="delete">
                            <span>Delete</span>
                        </div>
                        <img src="assets/img/icons/Vector 19.svg" alt="" class="vector-icon">
                        <div onclick="editTask(${taskId})" class="edit-delete-btn cp">
                            <img src="./assets/img/icons/contact/edit_black.png" alt="edit">
                            <img src="./assets/img/icons/contact/edit_blue.png" alt="edit">
                            <span>Edit</span>
                        </div>
                    </div>
            </div>    
        </div>`;
}

/**
 * 
 * @param {*} edit function for editing the  
 */
function editTask(taskId) {
    let container = document.getElementById('edit-container');
    let task = tasks.find(task => task.id === taskId);
    currentTask = tasks.findIndex(task => task.id === taskId);

    let title = task.title;
    let description = task.description;
    let dueDate = task.date;
    let priority = getEditPriorityHTML(task);
    let contacts = generateContactHTML(task.selectedContact);
    let subtasks = generateSubtasksHTML(task.subtasks);

    container.innerHTML = '';
    container.innerHTML = getEditTaskHTML(taskId, title, description, dueDate, priority, contacts, subtasks);
    document.getElementById('task-detail-view-container').classList.add('d-hide');
    document.getElementById('task-detail-view-container').classList.remove('d-block');
    container.classList.remove('d-hide');
    container.classList.add('d-block');

    setupDropdown();
    renderContactOptions(taskId)
}

/**
 * 
 * @param {*} subtasks 
 * @returns subtask html content
 */
function generateSubtasksHTML(subtasks) {
    let subtasksHTML = '';
    if (subtasks && subtasks.length > 0) {
        for (let i = 0; i < subtasks.length; i++) {
            let subtask = subtasks[i];
            subtasksHTML += `<div class="subtask">
                <div class="subtask-text-container">
                    <img src="assets/img/icons/punkt.png" alt="">
                    <span>${subtask}</span>
                </div>
                <div class="subtask-button">
                    <img src="assets/img/icons/Subtasks_edit_icon.svg" alt="" class="edit-icon" onclick="editEditSubtask('${subtask}')">
                    <img src="assets/img/icons/Vector 19.svg" alt="" class="vector-icon">
                    <img src="assets/img/icons/Subtasks_delete_icon.svg" alt="" class="delete-icon" onclick="deleteEditSubtask('${subtask}')"> 
                </div>
            </div>`;
        }
    }
    return subtasksHTML;
}

/**
 * 
 * @param {*} task 
 * @returns edit priority html content
 */
function getEditPriorityHTML(task) {
    let priorityHighChecked = task.priorityHigh ? 'checked' : '';
    let priorityMediumChecked = task.priorityMedium ? 'checked' : '';
    let priorityLowChecked = task.priorityLow ? 'checked' : '';

    let priorityHTML = /*html*/`
        <h2 class="prio">Prio</h2>
        <div class="dp-flex-jc-sb prio-design-board">
            <input type="checkbox" id="task-high-priority" class="custom-checkbox-high" onclick="handleCheckboxClick(this)" ${priorityHighChecked}>
            <label for="task-high-priority" class="checkbox-container">
                <div class="checkbox-label-high">
                    Urgent
                    <img class="checkbox-image-high" src="assets/img/icons/prio_high.png" alt="priority high">
                </div>
            </label>
            <input type="checkbox" id="task-medium-priority" class="custom-checkbox-medium" onclick="handleCheckboxClick(this)" ${priorityMediumChecked}>
            <label for="task-medium-priority" class="checkbox-container">
                <div class="checkbox-label-medium">
                    Medium
                    <img class="checkbox-image-medium" src="assets/img/icons/prio_medium.png" alt="priority medium">
                </div>
            </label>
            <input type="checkbox" id="task-low-priority" class="custom-checkbox-low" onclick="handleCheckboxClick(this)" ${priorityLowChecked}>
            <label for="task-low-priority" class="checkbox-container">
                <div class="checkbox-label-low">
                    Low
                    <img class="checkbox-image-low" src="assets/img/icons/prio_low.png" alt="priority low">
                </div>
            </label>
        </div>`;
    return priorityHTML;
}

/**
 * 
 * @param {*} taskId 
 * @param {*} title 
 * @param {*} description 
 * @param {*} dueDate 
 * @param {*} priority 
 * @param {*} contacts 
 * @param {*} subtasks 
 * @returns edit task html code with inputfields to edit exisiting content
 */
function getEditTaskHTML(taskId, title, description, dueDate, priority, contacts, subtasks) {
    return /*html*/`
        <div id="edit-task${taskId}" class="edit-task-layout">
        <div class="edit-task-container">
            <div class="close-btn-edit-container"><img class="close-detail-button" onclick="closeEdit()" src="assets/img/icons/close__detailview_icon.svg" alt="close"></div>
            <h3 class="margin-board">Title</h3>
            <form>
                <input id="task-title" value="${title}" class="inputfield-title input-field-respnsive-width" placeholder="Enter a title" type="text" required>
            </form>
            <h3 class="margin-board">Description</h3>
            <form>
                <textarea id="task-description" class="textareafied-description input-field-respnsive-width" placeholder="Enter a Description" rows="10">${description}</textarea>
            </form>
            <h3 class="margin-board">Due Date</h3>
            <form>
                <input id="task-date" value="${dueDate}" type="date" name="task-date" class="date-selector input-field-respnsive-width" required>
            </form>
            <div>${priority}</div>
            <h3 class="margin-board">Assigned to</h3>
                <div>
                    <form class="contacts-form">
                        <div class="assignment-select-container board-input-width">
                            <input id="dropdownInput" class="assignment-task-assignment board-input-width" placeholder="Select contacts to assign">
                            <div id="task-assignment" class="dropdown-content-board board-input-width"></div>
                        </div>
                        <div id="selected-contacts" class="board-contact-div-edit"></div>
                    </form>
                </div>
            <div  id="pre-selected-contacts${taskId}" class="edit-contacts-loaded">${contacts}</div>
            <h3 class="margin-board">Subtasks</h3>
            <form class="subtask-form-edit">
                        <div class="input-container board-input-width">
                            <input type="text" class="inputfield-task-subtasks board-input-width" id="task-subtasks" maxlength="50" placeholder="Add new subtask" onfocus="showInput()">
                            <button type="button" class="add-plus-button" id="add-plus-button" onclick="showInput()"><img src="assets/img/icons/add_subtask_icon.svg" alt=""></button>
                            <div class="subtask-btn-container" id="subtask-btn-container">
                                <button type="button" class="clear-button" onclick="clearInput()"><img src="assets/img/icons/delete_icon.svg" alt=""></button>
                                <img src="assets/img/icons/Vector 19.svg" alt="" class="vector-icon">
                                <button type="button" class="add-button" onclick="createSubtask()"><img src="assets/img/icons/check_edit_icon.svg" alt=""></button>
                            </div>
                        </div>
                        <div class="subtasks-container"></div>
                    </form>
            <div>${subtasks}</div>
            <div class="save-btn-container"><button class="save-btn" type="button" onclick="saveTask(${taskId})">OK <img src="assets/img/icons/check_edit_btn.png" alt=""></button></div>
            </div>
        </div>
    `;
}

/**
 * 
 * @param {*} taskId 
 * @returns taskId will be checked inside array and edited changes will be pushed into the firebase array tasks and initiates init() for refreshing the content
 */
async function saveTask(taskId) {
    let taskTitle = document.getElementById('task-title').value;
    let taskDescription = document.getElementById('task-description').value;
    let taskAssignment = document.getElementById('task-assignment').value;
    let taskDate = document.getElementById('task-date').value;
    let High = document.getElementById('task-high-priority').checked;
    let Medium = document.getElementById('task-medium-priority').checked;
    let Low = document.getElementById('task-low-priority').checked;
    let tasks = await getData('tasks');
    let firebaseId = null;

    for (let [key, value] of Object.entries(tasks)) {
        if (value.id === taskId) {
            firebaseId = key;
            break;
        }
    }

    if (!firebaseId) {
        console.error(`Task with ID ${taskId} not found.`);
        return;
    }

    let updatedTask = {
        ...tasks[firebaseId],
        'title': taskTitle,
        'description': taskDescription,
        'assignment': taskAssignment,
        'date': taskDate,
        'priorityHigh': High,
        'priorityMedium': Medium,
        'priorityLow': Low,
        'subtaskCount': subtaskCount,
        'subtasks': subtasks.slice(),
        'selectedContact': selectedContacts.slice(),
    };

    await putData(`tasks/${firebaseId}`, updatedTask);
    document.getElementById('edit-container').classList.remove('d-block');
    document.getElementById('edit-container').classList.add('d-hide');

    init();
}

/**
 * 
 * @param {*} taskId 
 * @returns deletes choosen task 
 */
async function deleteTask(taskId) {
    try {
        let tasks = await getData('tasks');
        let firebaseId = null;

        for (let [key, value] of Object.entries(tasks)) {
            if (value.id === taskId) {
                firebaseId = key;
                break;
            }
        }

        if (!firebaseId) {
            console.error(`Task with ID ${taskId} not found.`);
            return;
        }

        await deleteData(`tasks/${firebaseId}`);
        delete tasks[firebaseId];

    } catch (error) {
        console.error(`Failed to delete task with ID ${taskId}:`, error);
    }
    document.getElementById('task-detail-view-container').classList.add('d-hide');
    document.getElementById('task-detail-view-container').classList.remove('d-block');
    // document.getElementById('body').classList.remove('overflow-hidden');
    init();
}


/**
 * closes edit task window
 */
function closeEdit() {
    let container = document.getElementById('edit-container');
    let containerTask = document.getElementById('task-detail-view-container');
    container.classList.add('d-hide');
    container.classList.remove('d-block');   
    containerTask.classList.add('d-hide');
    containerTask.classList.remove('d-block');
}

/**
 * 
 * @param {*} selectedContact 
 * @returns contact name is added for the detail view
 */
function generateDetailedContactHTML(selectedContact) {
    if (!selectedContact || selectedContact.length === 0) {
        return '';
    }

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

/**
 * 
 * @param {*} task 
 * @returns priority images with extra text besides the image
 */
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
    } else {
        priorityHTML = '';
    }
    return priorityHTML;
}

/**
 * calls the addTask function on the board.html 
 */
function addTask() {
    let container = document.getElementById('addTask-board');
    container.classList.remove('d-none');
    container.innerHTML = '';

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

/**
 * calls the getAddTaskHTML which is divided into 4 parts, cause of the fullscreen view on the board.html
 */
function getAddTaskHTML() {
    let containerHeader = document.getElementById('addTask-board-header');
    let container = document.getElementById('addTask-board-render-container');
    let containerFooter = document.getElementById('addTask-board-footer');
    containerHeader.innerHTML += getAddTaskHTMLHeader();
    container.innerHTML += getAddTaskHTMLLeftSide() + getAddTaskHTMLRightSide();
    containerFooter.innerHTML += getAddTaskHTMLFooter();
    setupDropdown();
    renderContactOptions();
}

/**
 * @returns the left side of the addTask content window
 */
function getAddTaskHTMLLeftSide() {
    return /*html*/`
        <div>
            <h2>Title<p class="required-color">*</p></h2>
                <form>
                    <input id="task-title" class="inputfield-title-board" placeholder="Enter a title" type="text" required>
                </form>
            <h2>Description</h2>
                    <form>
                        <textarea id="task-description" class="textareafied-description-board" placeholder="Enter a Description" rows="10"></textarea>
                    </form>
            <h2>Assigned to</h2>
                <div>
                    <form class="contacts-form">
                        <div class="assignment-select-container">
                            <input id="dropdownInput" class="assignment-task-assignment" placeholder="Select contacts to assign">
                            <div id="task-assignment" class="dropdown-content-board"></div>
                        </div>
                        <div id="selected-contacts"  class="board-contact-div-add-task"></div>
                    </form>
                </div>
        </div>                
      <img class="mg-l-r-board" src="assets/img/icons/Vector 4.png" alt="">`;
}

/**
 * initiates the dropdown menu for task assignment
 */
function setupDropdown() {
    const input = document.getElementById('dropdownInput');
    const dropdown = document.getElementById('task-assignment');
    const container = document.querySelector('.assignment-select-container');

    input.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
        container.classList.toggle('open', !isOpen);
    });

    document.addEventListener('click', (event) => {
        if (!input.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = 'none';
            container.classList.remove('open');
        }
    });
}

/**
 * renders the contact options within the left HTML side
 */
function renderContactOptions(taskId) {
    let selectElement = document.getElementById('task-assignment');
    let contactsHTML = '';

    for (let i = 0; i < allContacts.length; i++) {
        const contact = allContacts[i];
        contactsHTML += `
            <div class="contact-container" onclick="toggleContactSelection(${i}, ${taskId})">
                <div class="contact-name-container">
                    <div class="initials-container" style="background-color: ${contact.color}">${contact.initials}</div>
                    <span>${contact.name}</span>
                </div>
                <input type="checkbox" id="contact-${i}" value="${contact.initials}" data-color="${contact.color}" data-name="${contact.name}" onclick="toggleContactSelection(${i}, ${taskId})" style="cursor: pointer;">
            </div>`;
    }
    selectElement.innerHTML = contactsHTML;
}

function toggleContactSelection(index, taskId) {
    let checkbox = document.getElementById(`contact-${index}`);
    checkbox.checked = !checkbox.checked;
    renderSelectedContacts(taskId);
}

/**
 * renders the selected contacts and creates the div content with the contact infos informations
 */
function renderSelectedContacts(taskId) {
    // document.getElementById(`pre-selected-contacts${taskId}`).innerHTML = '';
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
        contactDiv.style.backgroundColor = color; `margin-left: ${i === 0 ? '0' : '-30px'};`;
        contactDiv.classList.add('attributor-icon-board');
        contactDiv.textContent = initials;

        selectedContactsContainer.appendChild(contactDiv);
    };
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
                            <div class="subtask-btn-container board-design-buttons" id="subtask-btn-container">
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
 * 
 * @returns addTask header HTML
 */
function getAddTaskHTMLHeader() {
    return /*html*/`
        <div class="addTask-board-header-content">
            <span>Add Task</span>
            <img class="close-detail-button" src="assets/img/icons/close__detailview_icon.svg" alt="close" onclick="closeAddTask()">
        </div>`;
}

/**
 * closes the addTask window 
 */
function closeAddTask() {
    document.getElementById('addTask-board').classList.add('d-none');
}

/**
 * 
 * @returns addTask footer HTML
 */
function getAddTaskHTMLFooter() {
    return /*html*/`
        <div class="add-task-footer-board">
            <div class="dp-flex"><p class="required-color">*</p>This field is required</div>
            <div class="footer-btn-container">
                <button onclick="clearTask()" class="clear-task-btn">Clear X</button>
                <button id="create-task" onclick="createTask()" class="create-task-btn">Create Task<img src="assets/img/icons/check.svg" alt=""></button><!-- Alert! Task added to Board -> Weiterleitung auf board.html -->
            </div>
        </div>`;
}

/**
 * 
 * @param {*} clickedCheckbox parameter to check the input of the checkbox
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
 * @returns creates a subtask within the addTask window
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
 * renders the HTML content of the subtask created
 */
function renderSubtasks() {
    let container = document.querySelector('.subtasks-container');
    container.innerHTML = ''; // Leere den Container

    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        container.innerHTML += getSubtasksHTML(subtask);
    };
}

/**
 * 
 * @param {*} subtaskText 
 * @returns the html subtask text within div containers 
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
 * @param {*} subtaskText edits the created and rendered subtask
 */
function editSubtask(subtaskText) {
    let index = subtasks.indexOf(subtaskText);
    if (index !== -1) {
        let subtaskElement = document.querySelector(`[data-subtask-text="${subtaskText}"]`);
        if (subtaskElement) {
            subtaskElement.innerHTML = `
                <div class="subtask-edit-container">
                    <input type="text" class="input-edit-subtask" value="${subtaskText}" onblur="saveEditedSubtask(this, ${index})" />
                    <button class="add-button" onclick="saveEditedSubtask(this.previousElementSibling, ${index})"><img src="assets/img/icons/check_edit_icon.svg" alt=""></button>
                </div>`;
            subtaskElement.querySelector('.input-edit-subtask').focus();
        } else {
            console.error('Subtask element not found for:', subtaskText);
        }
    }
}

/**
 * 
 * @param {*} input 
 * @param {*} index saves the edited subtask text and calls the render subtask function to be up to date
 */
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
 * resets the addTask window 
 */
function clearTask() {
    init();
}

/**
 * 
 * @returns the selected options out of the addTask window and pushes them into the json array, also updates the firebase 
 */
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
        'date': taskDate,
        'priorityHigh': taskPriorityHigh,
        'priorityMedium': taskPriorityMedium,
        'priorityLow': taskPriorityLow,
        'taskcategory': taskCategory,
        'subtaskCount': subtaskCount,
        'subtasks': subtasks.slice(),
        'selectedContact': selectedContacts.slice(),
    };

    tasks.push(task);
    await postData('tasks', task);
    subtaskCount = 0;
    subtasks = [];
    document.getElementById('addTask-board').classList.add('d-none');
    init();
}

/**
 * 
 * @param {*} index start dragging tasks container and makes them moveable for drag&drop
 */
function startDragging(index) {
    currentDraggedElement = index - 1;
}

/**
 * 
 * @param {*} ev event allows to drop task container inside new category / dragarea
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * 
 * @param {*} category delivers the new category information to the firebase array tasks to update the page content
 */
async function moveTo(category) {
    tasks = [];
    let taskFireBase = await getData('tasks');
    let ids = Object.keys(taskFireBase || []);
    let id = ids[currentDraggedElement];
    await putData(`tasks/${id}/category`, category);
    await getData('tasks');
    init();
}

/**
 * loads the tasks array from firebase
 */
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

/**
 * loads all contacts out of the firebase array allContacts
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

function formatDateForSave(date) {
    // Assuming date is in the format "yyyy-MM-dd"
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
}

