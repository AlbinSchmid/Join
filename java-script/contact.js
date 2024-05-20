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
    loadAllFirstletters();
    renderContactlist();
    renderLetterCategory();
}

function renderLetterCategory() {
    let letterList = document.getElementById('letter-category');
    if (!letterList) {
        console.error("Element with id 'letter-headline' not found.");
        return;
    }
    letterList.innerHTML = '';

    for (let l = 0; l < allFirstLetters.length; l++) {
        let firstLetter = allFirstLetters[l];

        letterList.innerHTML += `
        <div class="container-category">${firstLetter}</div>
    `;
    }
    saveAllFirstletters();
}


function renderContactlist() {
    let contactList = document.getElementById('contact-list');
    if (!contactList) {
        console.error("Element with id 'contact-list' not found.");
        return;
    }
    contactList.innerHTML = '';
    for (let i = 0; i < allContacts.length; i++) {
        let contact = allContacts[i];
        let name = contact['name'];
        let initials = contact['initials'];
        let mail = contact['mail'];
        let color = contact['color'];
        contactList.innerHTML += renderContactOnListHTML(i, name, initials, mail, color);
    }
}


function addContact() {
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
    }
    allContacts.push(contact);

    if (!allFirstLetters.includes(contact['firstLetter'])) {
        allFirstLetters.push(contact['firstLetter']);
    }
    name.value = '';
    mail.value = '';
    phonenumber.value = '';
    saveAllContacts();
    saveAllFirstletters();
    init();
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


function saveAllFirstletters() {



    let allFirstLettersAsString = JSON.stringify(allFirstLetters);
    localStorage.setItem('allFirstLetters', allFirstLettersAsString);
}


function loadAllFirstletters() {
    let allFirstLettersAsString = localStorage.getItem('allFirstLetters');
    allFirstLetters = allFirstLettersAsString ? JSON.parse(allFirstLettersAsString) : [];
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


function editContact() {

    let name = currentContact['name'];
    let initials = currentContact['initials'];
    let mail = currentContact['mail'];
    let phonenumber = currentContact['phonenumber'];
    let color = currentContact['color'];

    let containerEdit = document.getElementById('editContact');
    containerEdit.innerHTML = '';

    // document.getElementById('edit-name').innerHTML = name;
    // document.getElementById('edit-mail').value = mail;
    // document.getElementById('edit-phonenumber').value = phonenumber;


    containerEdit.innerHTML = editContactHTML(initials, color);
    document.getElementById('editContact').classList.toggle('d-none');
}


function showContact(i) {
    currentContact = allContacts[i];

    let name = currentContact['name'];
    let initials = currentContact['initials'];
    let mail = currentContact['mail'];
    let phonenumber = currentContact['phonenumber'];
    let color = currentContact['color'];

    let contactDetails = document.getElementById('showContactDetails');
    contactDetails.innerHTML = '';
    document.getElementById('showContactDetails').classList.toggle('d-none');
    contactDetails.innerHTML = contactDetailsHTML(i, name, initials, mail, phonenumber, color);
}


// ------------- EDIT ICONS ------------- //


function changeEditIcon() {
    document.getElementById('editIcon').setAttribute('src', './assets/img/icons/contact/edit_blue.png');

}


// ------------- HTML ------------- //


function renderContactOnListHTML(i, name, initials, mail, color) {
    return `
        <div onclick="showContact(${i})" class="container-contact">
            <div class="first-letters-small dflex-c-c" style="background-color: ${color};">${initials}</div>
            <div class="name-mail">
                <span>${name}</span>
                <a href="mailto:${mail}">${mail}</a>
            </div>
        </div>
        `;
}


function contactDetailsHTML(i, name, initials, mail, phonenumber, color) {
    return `
    <div class="contact-data" id="contactData">
                <div class="container-user-top">
                    <div class="first-letters-big dflex-c-c" style="background-color:${color}">${initials}</div>
                    <div class="container-name-buttons">
                        <span>${name}</span>
                        <div class="edit-delete">
                            <div onclick="editContact()" class="edit-delete-btn dflex-c-c cp">
                                <img src="./assets/img/icons/contact/edit_black.png" alt="edit">
                                <img src="./assets/img/icons/contact/edit_blue.png" alt="edit">
                                <span>Edit</span>
                            </div>
                            <div class="edit-delete-btn dflex-c-c cp">
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
                        <a href="mailto:${mail}">${mail}</a>
                    </div>
                    <div class="mail-number">
                        <div class="contact-mail-number-headline">Phone</div>
                        <a href="tel:${phonenumber}">${phonenumber}</a>
                    </div>
                </div>
            </div>
`
}


function editContactHTML(initials, color) {
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
                        <div class=" first-letters-edit dflex-c-c" style="background-color:${color}">${initials}</div>
                    </div>
                    <img onclick="editContact()" class="close-img cp"
                        src="./assets/img/icons/contact/cancel_black.png" alt="close">
                    <div class="container-contact-right">
                        <form class="input-container dflex-c-c column">

                        <input id="edit-name" class="inputfield" type="text" placeholder="Name" required>
                        <input id="edit-mail" class="inputfield" type="email" placeholder="Email" required>
                        <input id="edit-phonenumber" class="inputfield" type="text" placeholder="Phone" required>
                        </form>
                        <div class="btn-cancel-create dflex-c-c cp">
                            <div onclick="" class="btn-outline-create-contact dflex-c-c">
                                <span>Delete</span>
                            </div>
                            <div onclick="editContact()" class="btn-create-contact dflex-c-c cp">
                                <span>Save</span>
                                <img src="./assets/img/icons/contact/check.png" alt="Create-new-contact">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
} 


