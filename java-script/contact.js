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

function init() {
    loadAllContacts();
}

function addContact() {
    let name = document.getElementById('name');
    let mail = document.getElementById('mail');
    let phonenumber = document.getElementById('phonenumber');
    let contact = {
        'color': getColor(),
        'initials': getInitials(name),
        'name': name.value,
        'mail': mail.value,
        'phonenumber': phonenumber.value,

    }
    allContacts.push(contact);
    name.value = '';
    mail.value = '';
    phonenumber.value = '';
    saveAllContacts()
    loadAllContacts()
}


function getColor() {
    const bgColors = ['#ff7a00', '#9327ff', '#6e52ff', '#fC71ff', '#ffbb2b', '#1fd7c1'];
    const randomColor = bgColors[Math.floor(bgColors.length * Math.random())];
    return randomColor;
}

function getInitials(name) {

    };

    
function saveAllContacts() {
   let allContactsAsString = JSON.stringify(allContacts);
   localStorage.setItem('allContacts', allContactsAsString); 
}


function loadAllContacts() {
    let allContactsAsString = localStorage.getItem('allContacts');
    allContacts = JSON.parse(allContactsAsString);
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