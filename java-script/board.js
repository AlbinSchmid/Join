let tasks = [];
let allContacts = [];
let currentIndex = 0;
let subtaskCount = 0;
let taskIdCounter = 0;
let currentDraggedElement;

document.addEventListener("init", async () => {
  await initBoard();
});
/**
 * function opens render relevated sub functions for generating the page content
 * updateHTML filters the Array tasks after 'category' : '' to generate the right code into each div / drag area with the correct progress status / category
 * renderBoard renders and generates the HTML code
 */

async function initBoard() {
  await loadTasks();
  await loadAllContacts();
  updateHTML();
}

function searchTask(searchBar) {
  let searchTask = document
    .getElementById("search-field-board")
    .value.toLowerCase();
  let searchTaskMobile = document
    .getElementById("search-field-board-mobile")
    .value.toLowerCase();

  // Check if the searchbar is on desktop or on phone
  if (searchBar === "desktop") {
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
    let filteredTasks = tasks.filter((task) => {
      let title = task["title"].toLowerCase();
      let description = task["description"].toLowerCase();
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
    let filteredTasks = tasks.filter((task) => {
      let title = task["title"].toLowerCase();
      let description = task["description"].toLowerCase();
      return (
        title.includes(searchTaskMobile) ||
        description.includes(searchTaskMobile)
      );
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
  const dragAreas = ["to-do", "in-progress", "await-feedback", "done"];

  dragAreas.forEach((areaId) => {
    let tasksInArea = filteredTasks.filter((t) => t["category"] == areaId);
    const areaElement = document.getElementById(areaId);
    areaElement.innerHTML = "";

    for (let index = 0; index < tasksInArea.length; index++) {
      const element = tasksInArea[index];
      let taskcategory = element.taskcategory;
      let category = element.category;
      let title = element.title;
      let description = element.description;
      let subtaskCount = element.subtaskCount;
      let assignedTo = element.selectedContact
        ? generateContactHTML(element.selectedContact)
        : "";
      let priority = generatePriorityHTML(element);
      let backgroundColor = getBackgroundColor(taskcategory);

      areaElement.innerHTML += getToDoHTML(
        element,
        taskcategory,
        title,
        description,
        subtaskCount,
        assignedTo,
        priority,
        index,
        tasksInArea,
        backgroundColor
      );
    }

    // Überprüfung, ob die dragarea leer ist
    const noTaskContainer = areaElement.previousElementSibling;
    if (tasksInArea.length === 0) {
      noTaskContainer.classList.remove("d-hide");
    } else {
      noTaskContainer.classList.add("d-hide");
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
    return "";
  }

  let contactHTML = "";
  for (let i = 0; i < selectedContact.length; i++) {
    let contact = selectedContact[i];
    const assignedContainerStyle = `margin-left: ${i === 0 ? "0" : "-10px"};`;
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
  let priorityHTML = "";
  if (task.priorityHigh) {
    priorityHTML =
      '<div class="priority-icon"><img src="assets/img/icons/prio_high.png" alt="High Priority"></div>';
  } else if (task.priorityMedium) {
    priorityHTML =
      '<div class="priority-icon"><img src="assets/img/icons/prio_medium.png" alt="Medium Priority"></div>';
  } else if (task.priorityLow) {
    priorityHTML =
      '<div class="priority-icon"><img src="assets/img/icons/prio_low.png" alt="Low Priority"></div>';
  }
  return priorityHTML;
}

/**
 *
 * @param {} taskcategory
 * @returns defines the background color depending on the choosen taskcategory
 */
function getBackgroundColor(taskcategory) {
  let backgroundColor = "";

  if (taskcategory === "Technical Task") {
    backgroundColor = "technical-task-color";
  } else if (taskcategory === "User Story") {
    backgroundColor = "user-story-color";
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
function getToDoHTML(
  task,
  taskcategory,
  title,
  description,
  subtaskCount,
  assignedTo,
  priority,
  index,
  category,
  backgroundColor
) {
  const total = task.subtasks.length;
  const selected = task.subtasks.filter((it) => it.selected).length;
  let percent = Math.round((selected / total) * 100);
  if (isNaN(percent)) {
    percent = 0;
  }

  // Überprüfen, ob Subtasks vorhanden sind
  const progressContainerClass = total > 0 ? "" : "d-hide";

  return /*html*/ `
    <div draggable="true" ondragstart="startDragging('${task.firebaseId}')" class="task-container" onclick="openTask(${category[index].id})">
      <div class="to-do-title-container">
        <p class="to-do-title ${backgroundColor}">${taskcategory}</p>
      </div>
      <div><p id="to-do-task" class="to-do-task">${title}</p></div>
      <div><p class="to-do-task-description">${description}</p></div>
      <div class="progress-container ${progressContainerClass}">
        <div class="progress-wrapper">
          <div class="progress-bar" id='progress-bar${category[index]["id"]}' style="width:${percent}%;"></div>
        </div>
        <div class="progress-count" id="progress-count${category[index]["id"]}">${selected}/${total} Subtasks</div>
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
function updateProgressBar(taskId, subTaskId) {
  const task = getTaskById(taskId);
  const subTask = task.subtasks[subTaskId];
  const subTaskDocumentId = `subtask-${taskId}-${subTaskId}`;
  subTask.selected = document.getElementById(subTaskDocumentId).checked;

  let totalSubtasks = document.querySelectorAll(
    '.subtask-container-detail-view input[type="checkbox"]'
  ).length;
  let completedSubtasks = document.querySelectorAll(
    '.subtask-container-detail-view input[type="checkbox"]:checked'
  ).length;

  let percent = (completedSubtasks / totalSubtasks) * 100;
  percent = Math.round(percent);

  document.getElementById(`progress-bar${taskId}`).style.width = percent + "%";
  document.getElementById(
    `progress-count${taskId}`
  ).innerHTML = `${completedSubtasks}/${totalSubtasks} Subtasks`;

  updateSubtaks(taskId);
}

/**
 * calls the getTaskDetailViewHTML where are more informations rendered, and also a callback function for the progress bar
 * @param {*} taskId parameter necessary to get right task container and open the right content
 * @param {*} callback
 * @returns
 */
function openTask(taskId, callback) {
  let container = document.getElementById("task-detail-view-container");
  let task = getTaskById(taskId);
  currentTask = tasks.findIndex((task) => task.id === taskId);

  let technicalTask = task.taskcategory;
  let category = task.category;
  let title = task.title;
  let description = task.description;
  let dueDate = formatDateForSave(task.date);
  let priority = generateDetailedPriorityHTML(task);
  let assignedTo = generateDetailedContactHTML(task.selectedContact);
  let backgroundColor = getBackgroundColor(task.taskcategory); // Hintergrundfarbe basierend auf taskcategory setzen
  let subtasks = "";
  if (task.subtasks && task.subtasks.length > 0) {
    for (let i = 0; i < task.subtasks.length; i++) {
      let subtask = task.subtasks[i];
      subtasks += `<div class="subtask-container-detail-view"><input ${
        subtask?.selected ? "checked" : ""
      } id="subtask-${taskId}-${i}" type="checkbox" onclick="updateProgressBar(${taskId}, ${i})"> ${
        subtask.text
      }</div>`;
    }
  }

  container.innerHTML = "";
  container.innerHTML = getTaskDetailViewHTML(
    taskId,
    technicalTask,
    title,
    subtasks,
    description,
    dueDate,
    priority,
    assignedTo,
    category,
    backgroundColor // Hintergrundfarbe weitergeben
  );
  container.classList.remove("d-hide");
  container.classList.add("d-block");
  container.dataset.callback = callback;
}

/**
 * closes the fullscreen task view
 */
function closeTask() {
  let container = document.getElementById("task-detail-view-container");
  container.classList.add("d-hide");
  container.classList.remove("d-block");
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
function getTaskDetailViewHTML(
  taskId,
  technicalTask,
  title,
  subtasks,
  description,
  dueDate,
  priority,
  assignedTo,
  category,
  backgroundColor 
) {
  return /*html*/ `
 <div id="detail-task${taskId}" class="detail-task-container "> 
 <div class="detail-task-overview">
 <div class="technical-task-container-detail"><p class="technical-task-detail ${backgroundColor}">${technicalTask}</p><img class="close-detail-button" onclick="closeTask()" src="assets/img/icons/close__detailview_icon.svg" alt="close"></div>
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
 * @param {*} edit function for editing the opened task
 */
function editTask(taskId) {
  const task = tasks.find((task) => task.id === taskId);
  setFormularToEdit(task);
  showTaskForm();
}

/**
 *
 * @param {*} subtasks
 * @returns subtask html content
 */
function generateSubtasksHTML(task) {
  const subtasks = task.subtasks;
  console.log(subtasks);
  let subtasksHTML = "";
  if (subtasks && subtasks.length > 0) {
    for (let i = 0; i < subtasks.length; i++) {
      let subtask = subtasks[i];
      subtasksHTML += `<div class="subtask">
 <div class="subtask-text-container">
 <img src="assets/img/icons/punkt.png" alt="">
 <span>${subtask.text}</span>
 </div>
 <div class="subtask-button">
 <img src="assets/img/icons/Subtasks_edit_icon.svg" alt="" class="edit-icon" onclick="editEditSubtask('${subtask}')">
 <img src="assets/img/icons/Vector 19.svg" alt="" class="vector-icon">
 <img src="assets/img/icons/Subtasks_delete_icon.svg" alt="" class="delete-icon" onclick="deleteEditSubtask(${task.id}, ${i})"> 
 </div>
 </div>`;
    }
  }
  return subtasksHTML;
}

/**
 * deletes Subtask 
 * @param {*} taskId 
 * @param {*} subTaskIndex 
 */
async function deleteEditSubtask(taskId, subTaskIndex) {
  const task = getTaskById(taskId);
  delete task.subtasks[subTaskIndex];
  await updateSubtaks(taskId);
}

/**
 *
 * @param {*} task
 * @returns edit priority html content
 */
function getEditPriorityHTML(task) {
  let priorityHighChecked = task.priorityHigh ? "checked" : "";
  let priorityMediumChecked = task.priorityMedium ? "checked" : "";
  let priorityLowChecked = task.priorityLow ? "checked" : "";

  let priorityHTML = /*html*/ `
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
function getEditTaskHTML(
  taskId,
  title,
  description,
  dueDate,
  priority,
  contacts,
  subtasks
) {
  return /*html*/ `
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
 <div id="pre-selected-contacts${taskId}" class="edit-contacts-loaded">${contacts}</div>
 <h3 class="margin-board">Subtasks</h3>
 <form class="subtask-form-edit">
 <div class="input-container board-input-width">
 <input type="text" class="inputfield-task-subtasks board-input-width" id="task-subtasks" maxlength="50" placeholder="Add new subtask" onfocus="showInput()">
 <button type="button" class="add-plus-button" id="add-plus-button" onclick="showInput()"><img src="assets/img/icons/add_subtask_icon.svg" alt=""></button>
 <div class="subtask-btn-container" id="subtask-btn-container">
 <button type="button" class="clear-button" onclick="clearInput()"><img src="assets/img/icons/delete_icon.svg" alt=""></button>
 <img src="assets/img/icons/Vector 19.svg" alt="" class="vector-icon">
 <button type="button" class="add-button" onclick="createSubtask(${taskId})"><img src="assets/img/icons/check_edit_icon.svg" alt=""></button>
 </div>
 </div>
 <div class="subtasks-container">
 <div>${subtasks}</div>
</div>
 </form>
 <div class="save-btn-container"><button class="save-btn" type="button" onclick="saveTask(${taskId})">OK <img src="assets/img/icons/check_edit_btn.png" alt=""></button></div>
 </div>
 </div>
 `;
}

async function updateSubtaks(taskId) {
  const task = getTaskById(taskId);

  await putData(`tasks/${task.firebaseId}`, task);
  initBoard();
}


/**
 *
 * @param {*} taskId
 * @returns deletes choosen task
 */
async function deleteTask(taskId) {
  try {
    let tasks = await getData("tasks");
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
  document.getElementById("task-detail-view-container").classList.add("d-hide");
  document
    .getElementById("task-detail-view-container")
    .classList.remove("d-block");
  initBoard();
}

/**
 * closes edit task window
 */
function closeEdit() {
  let container = document.getElementById("edit-container");
  let containerTask = document.getElementById("task-detail-view-container");
  container.classList.add("d-hide");
  container.classList.remove("d-block");
  containerTask.classList.add("d-hide");
  containerTask.classList.remove("d-block");
}

/**
 *
 * @param {*} selectedContact
 * @returns contact name is added for the detail view
 */
function generateDetailedContactHTML(selectedContact) {
  if (!selectedContact || selectedContact.length === 0) {
    return "";
  }

  let contactHTML = "";
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
  let priorityHTML = "";
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
    priorityHTML = "";
  }
  return priorityHTML;
}

/**
 * calls the addTask function on the board.html
 */
function addTask(category = "to-do") {
    showTaskForm();
    document.getElementById("task-form-category").value = category;
}

function showTaskForm() {
    let container = document.getElementById("addTask-board");
    container.classList.remove("d-none");
}


/**
 * closes the addTask window
 */
function closeAddTask() {
  document.getElementById("addTask-board").classList.add("d-none");
}

function getTaskById(taskId) {
  return tasks.find((it) => it.id === taskId);
}



/**
 * resets the addTask window
 */
function clearTask() {
  initBoard();
}

/**
 *
 * @param {*} index start dragging tasks container and makes them moveable for drag&drop
 */
function startDragging(firebaseId) {
  currentDraggedElement = firebaseId;
}

/**
 *
 * @param {*} ev event allows to drop task container inside new category / dragarea
 */
function allowDrop(dragEvent) {
  dragEvent.preventDefault();
}

/**
 *
 * @param {*} category delivers the new category information to the firebase array tasks to update the page content
 */
async function moveTo(category) {
  await putData(`tasks/${currentDraggedElement}/category`, category);
  initBoard();
}

/**
 * loads the tasks array from firebase
 */
async function loadTasks() {
  tasks = [];
  let loadedTasks = await getData("tasks");
  for (const [firebaseId, task] of Object.entries(loadedTasks)) {
    tasks.push({
      ...task,
      firebaseId: firebaseId,
      subtasks: task.subtasks?.filter((it) => !!it) ?? [],
    });
  }
}

/**
 * loads all contacts out of the firebase array allContacts
 */
async function loadAllContacts() {
  allContacts = [];
  let contacts = await getData("contacts");
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
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}
