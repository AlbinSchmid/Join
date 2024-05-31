let userList = [];

// function initlogIn() {
//     loadUser();
// }

function closeBtnSignUpSuccesfully(event) {
    event.preventDefault();
        document.getElementById('bgSignupSuccesfully').classList.remove('d-none');
        setTimeout(function () {
            window.location.href = "./log-in.html";
        }, 1500);
};


function goToSummary() {
    setTimeout(function () {
        window.location.href = "./log-in.html";
    }, 1500);
}


async function addUser() {
    let name = document.getElementById('inputSignUpName');
    let mail = document.getElementById('inputSignUpMail');
    let password = document.getElementById('inputSignUpPassword1');
    let password2 = document.getElementById('inputSignUpPassword2');
    let user = {
        'name': name.value,
        'initials': getInitials(name.value),
        'password': password.value,
        'password2': password2.value,
        'mail': mail.value,
    }
    await postData('/users', user);
    name.value = '';
    mail.value = '';
    password.value = '';
    password2.value = '';
}


async function loadUser() {
    userList = [];
    let users = await getData('users'); 
    let userIDs = Object.keys(users || []);    
    for (let i = 0; i < userIDs.length; i++) {
        let userID = userIDs[i];
        let user = users[userID];
        user.id = userID;
        userList.push(user);
    }

    console.log(userList);
}

function login() {
    let mail = document.getElementById('inputLoginMail');
    let password = document.getElementById('inputLoginPassword');
    let user = userList.find( u => u.mail == mail.value && u.password == password.value);
    console.log(user);
    if (user) {
        console.log('Nutzer gefunden :)');
        // goToSummary(); // WEITERLEITUNG ZU SUMMARY MACHEN
    } else {
        console.log('Nutzer nicht gefunden :(');
    }
}

function getInitials(name) {
    return name
        .split(" ")                        // Teilt den Namen in Wörter auf
        .filter(word => word.length > 0)   // Entfernt leere Wörter (falls vorhanden)
        .map(word => word[0].toUpperCase())  // Nimmt den ersten Buchstaben jedes Wortes und wandelt ihn in Großbuchstaben um
        .join("");                         // Verbindet die Buchstaben zu einer Zeichenkette
}
