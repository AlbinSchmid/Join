let contacts;
let subtasks;

document.addEventListener("init", () => {
  initTaskForm();
});

async function initTaskForm() {
  contacts = {};
  subtasks = [];
  setupSubmit();
  await contactsInit();
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
              <input type="checkbox" class="contact-checkbox" id="contact-${id}" value="${contact.initials}" data-id="${id}">
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
  const selectedContacts = [];

  const selectedContactsContainer =
    document.getElementById("selected-contacts");
  selectedContactsContainer.innerHTML = "";
  for (const checkbox of selectedUsers) {
    const contact = contacts[checkbox.dataset.id];
    selectedContacts.push({
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
  getForm().addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(Object.fromEntries(formData));
  });
}

function getForm() {
  return document.getElementById("task-form");
}
