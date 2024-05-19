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
        contactList.innerHTML += renderContactOnListHTML(contact);
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


function showEditContact() {
    document.getElementById('editContact').classList.toggle('d-none');
}


function showContact() {
    document.getElementById('contactData').classList.toggle('d-none');
}


// ------------- EDIT ICONS ------------- //


function changeEditIcon() {
    document.getElementById('editIcon').setAttribute('src', './assets/img/icons/contact/edit_blue.png');

}


// ------------- HTML ------------- //


function renderContactOnListHTML(contact) {
    return `
        <div onclick="showContact()" class="container-contact">
            <div class="first-letters-small dflex-c-c" style="background-color: ${contact['color']};">${contact['initials']}</div>
            <div class="name-mail">
                <span>${contact['name']}</span>
                <a href="mailto:${contact['mail']}">${contact['mail']}</a>
            </div>
        </div>
        `;
}