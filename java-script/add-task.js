let tasks = [];

function init() {
    includeHTML();
    renderAddTaskContent();
}

/**
 * This function renders the main add-task-content into the section with id = 'add-task-content'
 * container variable
 * 
 */

function renderAddTaskContent() {
    let container = document.getElementById('add-task-content');
    container.innerHTML = getAddTaskHTML();
}

/**
 * This function returns the addTask HTML Code
 */

function getAddTaskHTML() {
  return getAddTaskHTMLLeftSide() + getAddTaskHTMLRightSide();
}

function getAddTaskHTMLLeftSide() {
    return /*html*/`
      <div>
          <h2>Title<p class="required-color">*</p></h2>
              <form>
                  <input required id="task-title" class="inputfield-title" placeholder="Enter a title" type="text">
              </form>
          <h2>Description</h2>
                <form>
                    <textarea id="task-description" class="textareafied-description" placeholder="Enter a Description" rows="10"></textarea>
                </form>
                    <!-- contacts müssen geladen werden und entsprechend als option + value gerendert werden -->
          <h2>Assinged to</h2>
                <form>
                    <select class="selectfield-task-assingment" name="task category" id="task-assignment">
                        <option value="" >Select contacts to assign</option>
                        <option value="Max Mustermann">Max Mustermann</option>
                        <option value="Beate Test">Beate Test</option>
                    </select>
                    <!-- Contact icons müssen in div gerendert werden -->
                    <div>

                    </div>
                </form>
            </div>
      <img class="mg-l-r" src="assets/img/icons/Vector 4.png" alt="">`;           
}

function getAddTaskHTMLRightSide() {
    return /*html*/`
      <div>
          <h2>Due Date<p class="required-color">*</p></h2>
              <form>
                  <input id="task-date" type="date" name="task-date" class="date-selector">
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
                  <select class="selectfield-task-category" name="task category" id="task-category">
                      <option value="" >Select task category</option>
                      <option value="Technical Task">Technical Task</option>
                      <option value="User Story">User Story</option>
                  </select>
              </form>
                <!-- value muss ausgelesen werden für das Array, nachdem select, soll wieder die ersten Option angzeigt werden -->
          <h2>Subtasks</h2>
              <form>
                  <select class="selectfield-task-subtasks" name="Subtasks" id="task-subtasks">
                      <option value="">Add new subtask</option>
                      <option value="Contact Form">Contact Form</option>
                      <option value="Write Legal Imprint">Write Legal Imprint</option>
                  </select>
                  <div> <!-- Subtasks müssen in div-container gerendert werden -->

                  </div>
              </form>
          </div>`;
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
    let subTask = document.getElementById('task-subtasks').value;
    
    let task = {
      title: taskTitle,
      description: taskDescription,
      assignment: taskAssignment,
      date: taskDate,
      priorityHigh: taskPriorityHigh,
      priorityMedium: taskPriorityMedium,
      priorityLow: taskPriorityLow,
      category: taskCategory,
      subTask: subTask
      };
    
    tasks.push(task);
    localStorage.setItem('tasks',JSON.stringify(tasks));
    init();
    
    console.log('Task gespeichert:', task);
    console.log('Alle Tasks:', tasks);

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
  