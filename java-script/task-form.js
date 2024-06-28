let contacts;
let subtasks;
let selectedContacts;
let isEdit = false;

document.addEventListener("init", () => {
  initTaskForm();
});

async function initTaskForm() {
  contacts = {};
  subtasks = [];
  setupSubmit();
  await contactsInit();
  calendarDate();
}

async function contactsInit() {
  function toggleDropdown() {
    const container = document.querySelector(".assignment-select-container");
    const dropdown = document.getElementById("task-assignment");
    const input = document.getElementById("contact-input");

    input.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = dropdown.style.display === "block";
      dropdown.style.display = isOpen ? "none" : "block";
      container.classList.toggle("open", !isOpen);
    });

    document.addEventListener("click", (event) => {
      if (!input.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = "none";
        container.classList.remove("open");
      }
    });
  }

  toggleDropdown();
  contacts = await getData("contacts");

  let selectElement = document.getElementById("task-assignment");
  let contactsHTML = "";

  for (const [id, contact] of Object.entries(contacts)) {
    contactsHTML += `
          <div class="contact-container" onclick="contactsOnClick('${id}')" style="cursor: pointer; z-index: 1;">
              <div class="contact-name-container">
                  <div class="initials-container" style="background-color: ${contact.color}">${contact.initials}</div>
                  <span>${contact.name}</span>
              </div>
              <input type="checkbox" onclick="contactsOnClick('${id}')" class="contact-checkbox" id="contact-${id}" value="${contact.initials}" data-id="${id}">
          </div>`;
  }
  selectElement.innerHTML = contactsHTML;
}

function contactsOnClick(id) {
  const contactCheckbox = document.getElementById(`contact-${id}`);
  contactCheckbox.checked = !contactCheckbox.checked;
  contactsRender();
}

function contactsRender() {
  const selectedUsers = document.querySelectorAll(".contact-checkbox:checked");
  selectedContacts = [];

  const selectedContactsContainer =
    document.getElementById("selected-contacts");
  selectedContactsContainer.innerHTML = "";
  for (const checkbox of selectedUsers) {
    const contact = contacts[checkbox.dataset.id];
    selectedContacts.push({
      id: checkbox.dataset.id,
      color: contact.color,
      name: contact.name,
      initials: contact.initials,
    });

    const contactDiv = document.createElement("div");
    contactDiv.style.backgroundColor = contact.color;
    contactDiv.classList.add("selected-contacts-container");
    contactDiv.textContent = contact.initials;
    selectedContactsContainer.appendChild(contactDiv);
  }
}

function subtasksShowInput() {
  document.getElementById("task-subtasks").style.display = "block";
  document.getElementById("add-plus-button").style.display = "none";
  document.getElementById("subtask-btn-container").style.display = "flex";
}

function subtasksClearInput() {
  document.getElementById("task-subtasks").value = "";
  document.getElementById("subtask-btn-container").style.display = "none";
  document.getElementById("add-plus-button").style.display = "flex";
}

function subtasksCreate() {
  const inputField = document.getElementById("task-subtasks");
  const text = inputField.value.trim();

  if (!text) {
    return;
  }

  subtasks.push({
    selected: false,
    text: text,
    id: new Date().getTime(),
  });

  subtasksClearInput();
  subtasksRender();
}

function subtasksRender() {
  const container = document.querySelector(".subtasks-container");
  container.innerHTML = "";

  for (const subtask of subtasks) {
    container.innerHTML += `
  <div class="subtask" id="subtask-${subtask.id}">
    <div class="subtask-text-container">
      <img src="assets/img/icons/punkt.png" alt="">
      <span>${subtask.text}</span>
    </div>
    <div class="subtask-button">
      <img src="assets/img/icons/Subtasks_edit_icon.svg" alt="" class="edit-icon" onclick="subtaskEdit(${subtask.id})">
      <img src="assets/img/icons/Vector 19.svg" alt="" class="vector-icon">
      <img src="assets/img/icons/Subtasks_delete_icon.svg" alt="" class="delete-icon" onclick="subtaskDelete(${subtask.id})"> 
    </div>
  </div>`;
  }
}

function subtaskDelete(id) {
  subtasks = subtasks.filter((it) => it.id !== id);
  subtasksRender();
}

function subtaskEdit(id) {
  const subtask = subtasks.find((it) => it.id === id);
  if (!subtask) {
    console.eror("cannot find subtask", id);
    return;
  }
  const subtaskElement = document.getElementById(`subtask-${subtask.id}`);
  if (!subtaskElement) {
    console.error("Subtask element not found for", id);
  }

  subtaskElement.innerHTML = `
    <div class="subtask-edit-container">
      <input type="text" class="input-edit-subtask" value="${subtask.text}" onblur="subtaskDoEdit(${id}, this.value)" />
      <button class="add-button" onclick="subtaskDoEdit(${id}, this.previousElementSibling.value)">
        <img src="assets/img/icons/check_edit_icon.svg" alt="">
      </button>
    </div>`;
  subtaskElement.querySelector(".input-edit-subtask").focus();
}

function subtaskDoEdit(id, text) {
  const subtask = subtasks.find((it) => it.id === id);
  if (!subtask) {
    console.eror("cannot find subtask", id);
    subtasksRender();
    return;
  }

  subtask.text = text;
  subtasksRender();
}

function setupSubmit() {
  getForm().addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const task = Object.fromEntries(formData);
    task.subtasks = subtasks;
    task.priorityHigh = task.priority === "high";
    task.priorityLow = task.priority === "low";
    task.priorityMedium = task.priority === "medium";
    task.selectedContact = selectedContacts;
    task.id = new Date().getTime();

    if (isEdit) {
      if (!task.firebaseId) {
        console.error("cannot update task because firebase id is null");
        return;
      }
      await putData(`tasks/${task.firebaseId}`, task);
      window.location = "/board.html";
    } else {
      await postData("tasks", task);
      console.log(task);
      window.location = "/board.html";
    }
  });
}

function getForm() {
  return document.getElementById("task-form");
}

async function setFormularToEdit(task) {
  isEdit = true;
  document.getElementById("task-form-firebaseId").value = task.firebaseId;
  document.getElementById("task-form-title").innerText = "Edit Task";
  document.getElementById("create-task").innerHTML = `Edit Task<img src="/assets/img/icons/check_edit_btn.png" alt="">`;

  // set contacts
  if (Array.isArray(task.selectedContact)) {
    for (const contact of task.selectedContact) {
      const contactElement = document.getElementById(`contact-${contact.id}`);
      if (contactElement) {
        contactElement.checked = true;
      } else {
        console.warn(`Element with ID contact-${contact.id} not found.`);
      }
    }
  } else {
    console.warn("task.selectedContact is not an array:", task.selectedContact);
  }
  contactsRender();

  // subtasks
  subtasks = task.subtasks;
  subtasksRender();

  const form = getForm();
  for (const [key, val] of new URLSearchParams(task).entries()) {
    const input = form.elements[key];
    if (!input) {
      continue;
    }
    if (input.type === "checkbox") {
      input.checked = !!val;
    } else {
      input.value = val;
    }
  }
}


function clearTaskForm() {
  const form = getForm();
  form.reset();

  selectedContacts = [];
  contactsRender();

  subtasks = [];
  subtasksRender();

  document.getElementById("add-plus-button").style.display = "flex";
  document.getElementById("subtask-btn-container").style.display = "none";

  document.getElementById("task-form-title").innerText = "Add Task";
  document.getElementById("create-task").innerText = "Create Task";

  isEdit = false;
}


function calendarDate() {
  document.getElementById("task-date").min = new Date().toISOString().split("T")[0];

}
