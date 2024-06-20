let contacts;

document.addEventListener("init", () => {
  console.log("init");
  initTaskForm();
});

async function initTaskForm() {
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
