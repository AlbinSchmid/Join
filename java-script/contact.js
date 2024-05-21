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


let allContacts = [];
let currentContact;
let allFirstLetters = [];


function init() {
    loadAllContacts();
    renderContactlist();
}


function sorting(a, b) {
    return a.name.localeCompare(b.name)
}


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
        let currentLetter = contact.name.substring(0,1).toUpperCase();
        if (currentLetter !== lastLetter) {
            contactList.innerHTML += renderContactHeaderHTML(currentLetter);
        }
        lastLetter = currentLetter;
        contactList.innerHTML += renderContactOnListHTML(contact);
    }
}

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }


function addContact() {
    let name = document.getElementById('name');
    let mail = document.getElementById('mail');
    let phonenumber = document.getElementById('phonenumber');
    let contact = {
        'id': uuidv4(),
        'name': name.value,
        'firstLetter': getFirstLetter(name.value),
        'initials': getInitials(name.value),
        'mail': mail.value,
        'phonenumber': phonenumber.value,
        'color': getColor(),
    }
    allContacts.push(contact);

    if (!allFirstLetters.includes(contact['firstLetter'])) {
        allFirstLetters.push(contact['firstLetter']);
    }
    name.value = '';
    mail.value = '';
    phonenumber.value = '';
    saveAllContacts();
    init();
}


function updateContact(id) {
    function find(contact) {
        return contact.id === id;
    }
    let index = allContacts.findIndex(find);
    let name = document.getElementById('edit-name');
    let mail = document.getElementById('edit-mail');
    let phonenumber = document.getElementById('edit-phonenumber');
    allContacts[index] = {
        id: allContacts[index].id,
        'name': name.value,
        'firstLetter': getFirstLetter(name.value),
        'initials': getInitials(name.value),
        'mail': mail.value,
        'phonenumber': phonenumber.value,
        'color': allContacts[index].color,
    };
    document.getElementById('editContact').classList.toggle('d-none');

    let contactDetails = document.getElementById('showContactDetails');
    contactDetails.innerHTML = contactDetailsHTML(allContacts[index]);
    saveAllContacts();
    renderContactlist();
}


function deleteContact(id) {
    function find(contact) {
        return contact.id === id;
    }
    let index = allContacts.findIndex(find);
    allContacts.splice(index, 1);
    let contactDetails = document.getElementById('showContactDetails');
    contactDetails.innerHTML = '';
    document.getElementById('editContact').classList.toggle('d-none');
    saveAllContacts();
    renderContactlist();
}

function getColor() {
    const bgColors = ['#ff7a00', '#9327ff', '#6e52ff', '#fC71ff', '#ffbb2b', '#1fd7c1'];
    const randomColor = bgColors[Math.floor(bgColors.length * Math.random())];
    return randomColor;
}


function getInitials(name) {
    return name
        .split(" ")                        // Teilt den Namen in Wörter auf
        .filter(word => word.length > 0)   // Entfernt leere Wörter (falls vorhanden)
        .map(word => word[0].toUpperCase())  // Nimmt den ersten Buchstaben jedes Wortes und wandelt ihn in Großbuchstaben um
        .join("");                         // Verbindet die Buchstaben zu einer Zeichenkette
}


function getFirstLetter(name) {
    let words = name.split(" ");  // Zerlegt den Namen in einzelne Wörter
    let firstLetter = words[0][0].toUpperCase() // Wählt den ersten Buchstaben des ersten Wortes aus und wandelt ihn in Großbuchstaben um
    return firstLetter;
}


function saveAllContacts() {
    let allContactsAsString = JSON.stringify(allContacts);
    localStorage.setItem('allContacts', allContactsAsString);
}


function loadAllContacts() {
    let allContactsAsString = localStorage.getItem('allContacts');
    allContacts = allContactsAsString ? JSON.parse(allContactsAsString) : [];
    console.log(allContacts)
}

// ------------- ENABLE/DISABLE CONTAINER ------------- //


function showCreateNewContact() {
    document.getElementById('addNewContact').classList.toggle('d-none');
}


function createNewContact() {
    document.getElementById('addNewContact').classList.toggle('d-none');
    document.getElementById('btnContactCreated').classList.toggle('d-none');
    setTimeout(closeBtnSuccesfully, 1500);
    addContact();
}


function closeBtnSuccesfully() {
    document.getElementById('btnContactCreated').classList.add('d-none')
}


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


function showContact(id) {
    function find(contact) {
        return contact.id === id;
    }
    currentContact = allContacts.find(find);
    let contactDetails = document.getElementById('showContactDetails');
    contactDetails.innerHTML = '';
    document.getElementById('showContactDetails').classList.toggle('d-none');
    contactDetails.innerHTML = contactDetailsHTML(currentContact);
}


// ------------- EDIT ICONS ------------- //


function changeEditIcon() {
    document.getElementById('editIcon').setAttribute('src', './assets/img/icons/contact/edit_blue.png');

}


// ------------- HTML ------------- //


function renderContactOnListHTML(contact) {
    return `
        <div onclick="showContact('${contact.id}')" class="container-contact">
            <div class="first-letters-small dflex-c-c" style="background-color: ${contact.color};">${contact.initials}</div>
            <div class="name-mail">
                <span>${contact.name}</span>
                <a href="mailto:${contact.mail}">${contact.mail}</a>
            </div>
        </div>
        `;
}


function renderContactHeaderHTML(currentLetter) {
    return `
    <div>
        ${currentLetter}<hr></hr>
    </div>
    `;
}



function contactDetailsHTML(contact) {
    return `
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
`
}


function editContactHTML(contact) {
    console.log(contact);
    return `
    <div class="overlay-bg dflex-c-c">
            <div class="container-overlay">
                <div class="overlay-left-bg">
                    <div class="overlay-left">
                        <img src="./assets/img/logo_join_white.png" alt="logo_join_white">
                        <h1>Edit contact</h1>
                        <div class="line-turn"></div>
                    </div>
                </div>
                <div class="dflex-c-c">
                    <div class="container-user-top">
                        <div class=" first-letters-edit dflex-c-c" style="background-color:${contact.color}">${contact.initials}</div>
                    </div>
                    <img onclick="editContact('${contact.id}')" class="close-img cp"
                        src="./assets/img/icons/contact/cancel_black.png" alt="close">
                    <div class="container-contact-right">
                        <form class="input-container dflex-c-c column">

                        <input id="edit-name" value="${contact.name}" class="inputfield" type="text" placeholder="Name" required>
                        <input id="edit-mail" value="${contact.mail}" class="inputfield" type="email" placeholder="Email" required>
                        <input id="edit-phonenumber" value="${contact.phonenumber}" class="inputfield" type="text" placeholder="Phone" required>
                        </form>
                        <div class="btn-cancel-create dflex-c-c cp">
                            <div onclick="deleteContact('${contact.id}')" class="btn-outline-create-contact dflex-c-c">
                                <span>Delete</span>
                            </div>
                            <div onclick="updateContact('${contact.id}')" class="btn-create-contact dflex-c-c cp">
                                <span>Save</span>
                                <img src="./assets/img/icons/contact/check.png" alt="Create-new-contact">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
} 


