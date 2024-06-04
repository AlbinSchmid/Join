let userList = [];

// function initlogIn() {
//     loadUser();
// }

function closeBtnSignUpSuccesfully(event) {
    event.preventDefault();
};



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
    if (passwordCorrect(user, password, password2)) {
    }
    else {
        console.log('falsch');
    }
    
}


async function passwordCorrect(user, password, password2) {
    if (password.value === password2.value) {
        document.getElementById('bgSignupSuccesfully').classList.remove('d-none');
        setTimeout(function () {
            window.location.href = "./log-in.html";
        }, 1500);
        await postData('/users', user);
        return true;
    } else {
        let passwordIncorrect = document.getElementById('passwordIncorrect');
        let inputSignUpPassword2 = document.getElementById('inputSignUpPassword2');
        passwordIncorrect.innerHTML = "Ups! your password dont match";
        inputSignUpPassword2.style.border =" 2px solid red;"

        return false;
    }
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
        let userAsText = JSON.stringify(user);
        localStorage.setItem('user', userAsText);
        window.location.href = "./summary.html";
    } else {
        let failedLogin = document.getElementById('failedLogin');
        failedLogin.innerHTML = "E-Mail or password are incorrect";;
    }
}


function getInitials(name) {
    return name
        .split(" ")                        // Teilt den Namen in Wörter auf
        .filter(word => word.length > 0)   // Entfernt leere Wörter (falls vorhanden)
        .map(word => word[0].toUpperCase())  // Nimmt den ersten Buchstaben jedes Wortes und wandelt ihn in Großbuchstaben um
        .join("");                         // Verbindet die Buchstaben zu einer Zeichenkette
}
