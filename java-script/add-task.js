let tasks = [];
let allContacts = [];
let subtasks = [];
let subtaskCount = 0;
let taskIdCounter = 0;


function init() {
    includeHTML();
    loadTasks()
    loadAllContacts();
    renderAddTaskContent();
    
    document.querySelector('.subtasks-container').innerHTML = '';
    clearInput();

    console.log(allContacts);
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
                </div>
        </div>                
                
            
      <img class="mg-l-r" src="assets/img/icons/Vector 4.png" alt="">`;
      
}

function renderContactOptions() {
    let selectElement = document.getElementById('task-assignment');
    let optionsHTML = '';
    for (let i = 0; i < allContacts.length; i++) {
        const contact = allContacts[i];
        optionsHTML += `
            <div class="contact-container">
                <div class="contact-name-container">
                    <div class="initials-container" style="background-color: ${contact.color}">${contact.initials}</div>
                    <span>${contact.name}</span>
                </div>
                
                <input type="checkbox">
            </div>`;
    }
    selectElement.innerHTML = optionsHTML;
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

document.addEventListener('DOMContentLoaded', init);

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
                  <input type="checkbox" id="task-high-priority" class="custom-checkbox-high">
                  <label for="task-high-priority" class="checkbox-container">
                      <div class="checkbox-label-high">
                            Urgent
                          <img class="checkbox-image-high" src="assets/img/icons/prio_high.png" alt="priority high">
                      </div>
                  </label>
                  <input type="checkbox" id="task-medium-priority" class="custom-checkbox-medium">
                  <label for="task-medium-priority" class="checkbox-container">
                      <div class="checkbox-label-medium">
                          Medium
                          <img class="checkbox-image-medium" src="assets/img/icons/prio_medium.png" alt="priority medium">
                      </div>
                  </label>
                  <input type="checkbox" id="task-low-priority" class="custom-checkbox-low">
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

function createTask() { 
    let taskTitle = document.getElementById('task-title').value;
    let taskDescription = document.getElementById('task-description').value;
    let taskAssignment = document.getElementById('task-assignment').value;
    let taskDate = document.getElementById('task-date').value;
    let taskPriorityHigh = document.getElementById('task-high-priority').checked;
    let taskPriorityMedium = document.getElementById('task-medium-priority').checked;
    let taskPriorityLow = document.getElementById('task-low-priority').checked;
    let taskCategory = document.getElementById('task-category').value;

    // Überprüfen, ob taskTitle, taskDate und taskCategory ausgefüllt sind
    if (taskTitle === '' || taskDate === '' || taskCategory === '') {
        alert('Bitte füllen Sie die Felder "Titel", "Datum" und "Kategorie" aus.');
        return; // Beenden der Funktion, wenn die Felder nicht ausgefüllt sind
    }
    
    let task = {
        'id': taskIdCounter, // ID hinzufügen
        'category' : 'to-do',
        'title': taskTitle,
        'description': taskDescription,
        'assignment': taskAssignment,
        'date': taskDate,
        'priorityHigh': taskPriorityHigh,
        'priorityMedium': taskPriorityMedium,
        'priorityLow': taskPriorityLow,
        'taskcategory': taskCategory,
        'subtaskCount': subtaskCount,
        'subtasks': subtasks.slice() // Add a copy of the subtasks array
    };
    taskIdCounter = taskIdCounter + 1; // Erhöhe die Task-ID für den nächsten Task
    tasks.push(task);
    saveTasks() 
    subtaskCount = 0;
    subtasks = [];
    directToBoard();
}

function directToBoard() {
    setTimeout(() => {
        window.location.href = 'board.html';
    }, 2000);
}

function saveTasks() {
    let tasksAsString = JSON.stringify(tasks);
    localStorage.setItem('tasks' , tasksAsString);
}

function loadTasks() {
    let tasksAsString = localStorage.getItem('tasks');
    tasks = tasksAsString ? JSON.parse(tasksAsString) : [];
}

function loadAllContacts() {
    let allContactsAsString = localStorage.getItem('allContacts');
    allContacts = allContactsAsString ? JSON.parse(allContactsAsString) : [];
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
  window.onclick = function(event) {
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
  