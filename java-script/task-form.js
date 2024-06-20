document.addEventListener("init", () => {
    console.log("init");
    initTaskForm();
  });
  
  async function initTaskForm() {
    setupSubmit();
    await setupContacts();
  }
  
  async function setupContacts() {
    let contacts = await getData("contacts");
    const select = document.getElementById("selectedContact");
    for (const [key, contact] of Object.entries(contacts)) {
      var opt = document.createElement("option");
      opt.value = key;
      opt.innerText = contact.name;
      select.appendChild(opt);
    }
  }
  
  function setupSubmit() {
    getForm().addEventListener("submit", function (e) {
      e.preventDefault();
      var formData = new FormData(e.target);
      console.log(Object.fromEntries(formData));
    });
  }
  
  function getForm() {
    return document.getElementById("task-form");
  }
  