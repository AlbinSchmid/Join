let userList = [];


function closeBtnSignUpSuccesfully(event) {
    event.preventDefault();
    addUser();
};


async function addUser() {
    let name = document.getElementById('inputSignUpName');
    let mail = document.getElementById('inputSignUpMail');
    let password = document.getElementById('inputSignUpPassword1');
    let password2 = document.getElementById('inputSignUpPassword2');
    let checkbox = document.getElementById('checkboxAccept');
    if (!checkbox.checked) {
        document.getElementById('passwordIncorrect').innerText = "You must accept the Privacy Policy";
        checkbox.style.border = "2px solid red";
        return;
    }
    let user = {
        'name': name.value,
        'initials': getInitials(name.value),
        'password': password.value,
        'password2': password2.value,
        'mail': mail.value,
    }
    if (passwordCheck(user, password, password2)) {
    }
    else {
        console.error('password incorrect');
    }
};

async function passwordCheck(user, password, password2) {
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    if (passwordValue === "" || password2Value === "") {
        let passwordIncorrect = document.getElementById('passwordIncorrect');
        passwordIncorrect.innerHTML = "Passwords cannot be empty";
        password.style.border = "2px solid red";
        password2.style.border = "2px solid red";
        return false;
    }

    if (passwordValue === password2Value) {
        document.getElementById('bgSignupSuccesfully').classList.remove('d-none');
        await postData('/users', user);
        setTimeout(function () {
            window.location.href = "./log-in.html";
        }, 1500);
        return true;
    } else {
        let passwordIncorrect = document.getElementById('passwordIncorrect');
        passwordIncorrect.innerHTML = "Ups! your passwords don't match";
        password2.style.border = "2px solid red";
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
}


function login() {
    let mail = document.getElementById('inputLoginMail');
    let password = document.getElementById('inputLoginPassword');
    let user = userList.find( u => u.mail == mail.value && u.password == password.value);
    if (user) {
        let userAsText = JSON.stringify(user);
        localStorage.setItem('user', userAsText);
        window.location.href = "./summary.html";
    } else {
        let failedLogin = document.getElementById('failedLogin');
        failedLogin.innerHTML = "E-Mail or password are incorrect";;
    }
}


function guestLogin() {
    let user = {
        'initials': 'G',
        'name': 'Gast'
    };
    let userAlsText = JSON.stringify(user);
    localStorage.setItem('user', userAlsText);
    window.location.href = "./summary.html";
}


function getInitials(name) {
    return name
        .split(" ")                        // Teilt den Namen in Wörter auf
        .filter(word => word.length > 0)   // Entfernt leere Wörter (falls vorhanden)
        .map(word => word[0].toUpperCase())  // Nimmt den ersten Buchstaben jedes Wortes und wandelt ihn in Großbuchstaben um
        .join("");                         // Verbindet die Buchstaben zu einer Zeichenkette
}
