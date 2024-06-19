let allContacts = [];
let currentContact = { id: 'empty' };
let allFirstLetters = [];
let currentID;


/**
 * Initializes the application by loading all contacts and rendering the contact list.
 *
 * 
 * */
async function init() {
    await loadAllContacts();
    renderContactlist();
}


/**
 * Renders the contact list in the container with the ID 'contact-list'.
 */
function renderContactlist() {
    let contactList = document.getElementById('contact-list');
    if (!contactList) {
        console.error("Element with id 'contact-list' not found.");
        return;
    }
    contactList.innerHTML = '';
    let lastLetter = '';
    allContacts.sort(sorting);
    for (let i = 0; i < allContacts.length; i++) {
        let contact = allContacts[i];
        let currentLetter = contact.name.substring(0, 1).toUpperCase();
        if (currentLetter !== lastLetter) {
            contactList.innerHTML += renderContactHeaderHTML(currentLetter);
        }
        lastLetter = currentLetter;
        contactList.innerHTML += renderContactOnListHTML(contact);
    }
}


/**
 * Sorts contacts by name in ascending order.
 * 
 * @param {Object} a - The first contact object.
 * @param {Object} b - The second contact object.
 * @returns {number} - The result of the compare.
 */
function sorting(a, b) {
    return a.name.localeCompare(b.name);
}


/**
 * Adds a new contact to the contact list.
 */
async function addContact() {
    let name = document.getElementById('name');
    let mail = document.getElementById('mail');
    let phonenumber = document.getElementById('phonenumber');
    let contact = {
        'name': name.value,
        'firstLetter': getFirstLetter(name.value),
        'initials': getInitials(name.value),
        'mail': mail.value,
        'phonenumber': phonenumber.value,
        'color': getColor(),
    };
    allContacts.push(contact);
    await postData('contacts', contact);
    if (!allFirstLetters.includes(contact['firstLetter'])) {
        allFirstLetters.push(contact['firstLetter']);
    }
    name.value = '';
    mail.value = '';
    phonenumber.value = '';
    await init();
}


/**
 * Updates an existing contact.
 * 
 * @param {string} id - The ID of the contact to update.
 */
async function updateContact(id) {
    let name = document.getElementById('edit-name');
    let mail = document.getElementById('edit-mail');
    let phonenumber = document.getElementById('edit-phonenumber');
    let contact = await getData(`contacts/${id}`);
    contact.name = name.value;
    contact.firstLetter = getFirstLetter(name.value);
    contact.initials = getInitials(name.value);
    contact.mail = mail.value;
    contact.phonenumber = phonenumber.value;
    await putData(`contacts/${id}`, contact);
    await init();
    document.getElementById('editContact').classList.toggle('d-none');
    contact.id = id;
    let contactDetails = document.getElementById('showContactDetails');
    contactDetails.innerHTML = contactDetailsHTML(contact);
}


/**
 * Deletes a contact.
 * 
 * @param {string} id - The ID of the contact to delete.
 */
async function deleteContact(id) {
    await deleteData(`contacts/${id}`);
    await init();
    let contactDetails = document.getElementById('showContactDetails');
    contactDetails.innerHTML = '';
    document.getElementById('editContact').classList.add('d-none');
    document.getElementById('container-right').classList.add('d-none');
    document.getElementById('container-contacts').classList.remove('d-none');
}


/**
 * Generates a random color and returns it.
 * 
 * @returns {string} - A random color in hexadecimal format.
 */
function getColor() {
    const bgColors = ['#ff7a00', '#9327ff', '#6e52ff', '#fC71ff', '#ffbb2b', '#1fd7c1'];
    const randomColor = bgColors[Math.floor(bgColors.length * Math.random())];
    return randomColor;
}


/**
 * Generates the initials of a name.
 * 
 * @param {string} name - The name of the contact.
 * @returns {string} - The initials of the name.
 */
function getInitials(name) {
    return name
        .split(" ")
        .filter(word => word.length > 0)
        .map(word => word[0].toUpperCase())
        .join("");
}


/**
 * Gets the first letter of a name.
 * 
 * @param {string} name - The name of the contact.
 * @returns {string} - The first letter of the name.
 */
function getFirstLetter(name) {
    let words = name.split(" ");
    let firstLetter = words[0][0].toUpperCase();
    return firstLetter;
}


/**
 * Loads all contacts from the data source.
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


// ------------- ENABLE/DISABLE CONTAINER ------------- //

/**
 * Shows the container for creating a new contact.
 */
function showCreateNewContact() {
    let containerAdd = document.getElementById('addNewContact');
    containerAdd.innerHTML = '';
    containerAdd.innerHTML = addContactHTML();
    document.getElementById('addNewContact').classList.toggle('d-none');
}


/**
 * Creates a new contact and hides the creation form after submission.
 */
function createNewContact() {
    document.getElementById('addNewContact').classList.toggle('d-none');
    document.getElementById('btnContactCreated').classList.toggle('d-none');
    setTimeout(closeBtnSuccesfully, 1500);
    addContact();
}


/**
 * Closes the button indicating successful contact creation.
 */
function closeBtnSuccesfully() {
    document.getElementById('btnContactCreated').classList.add('d-none');
}


/**
 * Opens the form for editing an existing contact.
 * 
 * @param {string} id - The ID of the contact to edit.
 */
function editContact(id) {
    function find(contact) {
        return contact.id === id;
    }
    let currentContact = allContacts.find(find);
    let containerEdit = document.getElementById('editContact');
    containerEdit.innerHTML = '';
    containerEdit.innerHTML = editContactHTML(currentContact);
    document.getElementById('editContact').classList.toggle('d-none');
}


/**
 * Displays the details of a contact and manages the selection of the active contact.
 *
 * @param {string} id - The ID of the contact whose details are to be displayed.
 */
function showContact(id) {
    function find(contact) {
        return contact.id === id;
    }
    let contactDetails = document.getElementById('showContactDetails');
    checkSelectionAktiv(contactDetails, id)
    contactDetails.innerHTML = '';
    conditionFoRShowContactDetails(id);
    currentContact = allContacts.find(find);
    contactDetails.innerHTML = contactDetailsHTML(currentContact);
    currentID = id;
}
    

/**
 * Checks if a contact is already marked as active and manages the class assignment.
 *
 * @param {HTMLElement} contactDetails - The HTML element that displays the contact information.
 * @param {string} id - The ID of the contact to be checked and possibly marked as active.
 */
function checkSelectionAktiv(contactDetails, id) {
    const className = "contact-active";
    const contact = document.getElementById(id);
    if (contact.classList.contains(className)) {
        contact.classList.remove(className);
        contactDetails.innerHTML = '';
        return;
    }
    const contacts = document.getElementsByClassName(className);
    for (let activeContact of contacts) {
        activeContact.classList.remove(className);
    }
    contact.classList.add(className);
}


/**
 * Toggles the visibility of contact details and adjusts the layout based on the current contact.
 * 
 * @param {string} id - The ID of the contact to conditionally display.
 */
function conditionFoRShowContactDetails(id) {
    if (id === currentContact.id) {
        document.getElementById('showContactDetails').classList.toggle('d-none');
        document.getElementById('container-right').classList.toggle('d-none');

        if (document.getElementById('showContactDetails').classList.contains('d-none')) {
            document.getElementById('container-contacts').classList.remove('d-none');
        } else {
            document.getElementById('container-contacts').classList.add('d-none');
        }
    } else {
        document.getElementById('showContactDetails').classList.remove('d-none');
        document.getElementById('container-right').classList.remove('d-none');
        document.getElementById('container-contacts').classList.add('d-none');
    }
}


/**
 * Toggles the visibility of the contact details and adjusts layout based on screen size.
 */
function closeOpenContactDetails() {
    document.getElementById('showContactDetails').classList.toggle('d-none');
    document.getElementById('container-right').classList.toggle('d-none');
    let mediaQuery = window.matchMedia('(max-width: 1024px)');
    if (mediaQuery.matches) {
        document.getElementById('container-contacts').classList.toggle('d-none');
        document.getElementById(currentID).classList.remove('contact-active');
    }
}


// ------------- EDIT ICONS ------------- //

/**
 * Changes the source of the edit icon to the blue version.
 */
function changeEditIcon() {
    document.getElementById('editIcon').setAttribute('src', './assets/img/icons/contact/edit_blue.png');
}


// ------------- HTML ------------- //

/**
 * Generates the HTML for a contact in the contact list.
 * 
 * @param {Object} contact - The contact object.
 * @returns {string} - The HTML string for the contact.
 */
function renderContactOnListHTML(contact) {
    return `
        <div id="${contact.id}" onclick="showContact('${contact.id}')" class="container-contact">
            <div class="first-letters-small dflex-c-c" style="background-color: ${contact.color};">${contact.initials}</div>
            <div class="name-mail">
                <span>${contact.name}</span>
                <a>${contact.mail}</a>
            </div>
        </div>
        `;
}


/**
 * Generates the HTML for a contact header based on the current letter.
 * 
 * @param {string} currentLetter - The current letter for the contact group.
 * @returns {string} - The HTML string for the contact header.
 */
function renderContactHeaderHTML(currentLetter) {
    return `
    <div style="margin: 12px 0px 8px 0px;">
        ${currentLetter}<hr></hr>
    </div>
    `;
}

/**
 * Generates the HTML for displaying contact details.
 * 
 * @param {Object} contact - The contact object.
 * @returns {string} - The HTML string for the contact details.
 */
function contactDetailsHTML(contact) {
    return /*html*/ `
    <div class="contact-data" id="contactData">
        <div class="container-user-top">
            <div class="first-letters-big dflex-c-c" style="background-color:${contact.color}">${contact.initials}</div>
                <div class="container-name-buttons">
                    <span>${contact.name}</span>
                    <div class="edit-delete">
                        <div onclick="editContact('${contact.id}')" class="edit-delete-btn dflex-c-c cp">
                            <img src="./assets/img/icons/contact/edit_black.png" alt="edit">
                            <img src="./assets/img/icons/contact/edit_blue.png" alt="edit">
                            <span>Edit</span>
                        </div>
                        <div onclick="deleteContact('${contact.id}')" class="edit-delete-btn dflex-c-c cp">
                            <img src="./assets/img/icons/contact/delete_black.png" alt="delete">
                            <img src="./assets/img/icons/contact/delete_blue.png" alt="delete">
                            <span>Delete</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="contact-info-headline">Contact information</div>
            <div class="contact-mail-number">
                <div class="mail-number">
                    <div class="contact-mail-number-headline">E-Mail</div>
                    <a href="mailto:${contact.mail}">${contact.mail}</a>
                </div>
                <div class="mail-number">
                    <div class="contact-mail-number-headline">Phone</div>
                    <a href="tel:${contact.phonenumber}">${contact.phonenumber}</a>
                    </div>
                </div>
            </div>
    `;
}

/**
 * Generates the HTML for the add contact form.
 * 
 * @returns {string} - The HTML string for the add contact form.
 */
function addContactHTML() {
    return /*html*/`
        <div class="overlay-bg dflex-c-c">
            <div class="container-overlay">
                <div class="overlay-left-bg">
                    <div class="overlay-left">
                        <img src="./assets/img/logo_join_white.png" alt="logo_join_white">
                        <h1>Add contact</h1>
                        <span>Tasks are better with a team!</span>
                    </div>
                </div>
                <div class="contact-data-mobile dflex-c-c">
                    <div class="container-user-top">
                        <img class="contact-pict dflex-c-c" src="./assets/img/icons/contact/person.png" alt="person_picture">
                    </div>
                    
                <img onclick="showCreateNewContact()" class="close-img cp"
                    src="./assets/img/icons/contact/cancel_black.png" alt="close">
                <div class="container-contact-right">
                    <form class="input-container dflex-c-c column" onsubmit="createNewContact(); return false;">
                        <input id="name" class="inputfield" type="text" placeholder="Name" required>
                        <input id="mail" class="inputfield" type="email" placeholder="Email" required>
                        <input id="phonenumber" class="inputfield" type="number" placeholder="Phone" required>
                    
                        <div class="btn-cancel-create dflex-c-c cp">
                            <div onclick="showCreateNewContact()" class="btn-outline-create-contact dflex-c-c">
                                <span>Cancel</span>
                                <img src="./assets/img/icons/contact/cancel_black.png" alt="cancel">
                                <img src="./assets/img/icons/contact/cancel_blue.png" alt="cancel">
                            </div>
                            <div>
                                <button type="submit" class="btn-create-contact dflex-c-c cp">
                                    <span>Create contact</span>
                                    <img src="./assets/img/icons/contact/check.png" alt="Create-new-contact">
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
}

/**
 * Generates the HTML for the edit contact form.
 * 
 * @param {Object} contact - The contact object.
 * @returns {string} - The HTML string for the edit contact form.
 */
function editContactHTML(contact) {
    return /*html*/`
    <div class="overlay-bg dflex-c-c">
        <div class="container-overlay">
            <div class="overlay-left-bg">
                <div class="overlay-left">
                    <img src="./assets/img/logo_join_white.png" alt="logo_join_white">
                    <h1>Edit contact</h1>
                </div>
            </div>
            <div class="contact-data-mobile dflex-c-c">
                <div class="container-user-top">
                    <div class="first-letters-edit dflex-c-c" style="background-color:${contact.color}">
                        ${contact.initials}
                    </div>
                </div>
                <img onclick="editContact('${contact.id}')" class="close-img cp"
                    src="./assets/img/icons/contact/cancel_black.png" alt="close">
                <div class="container-contact-right">
                    <form class="input-container dflex-c-c column" onsubmit="updateContact('${contact.id}'); return false;">
                        <input id="edit-name" value="${contact.name}" class="inputfield" type="text" placeholder="Name" required>
                        <input id="edit-mail" value="${contact.mail}" class="inputfield" type="email" placeholder="Email" required>
                        <input id="edit-phonenumber" value="${contact.phonenumber}" class="inputfield" type="number" placeholder="Phone" required>
                        
                        <div class="btn-cancel-create dflex-c-c cp">
                            <div onclick="deleteContact('${contact.id}')" class="btn-outline-create-contact dflex-c-c">
                                <span>Delete</span>
                            </div>
                            <button type="submit" class="btn-create-contact dflex-c-c cp">
                                <span>Save</span>
                                <img src="./assets/img/icons/contact/check.png" alt="Save-contact">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;
}
