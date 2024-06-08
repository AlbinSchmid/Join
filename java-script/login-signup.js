let userList = [];

/**
* This function generate a new User.
*/

async function addUser() {
    let mail = document.getElementById('inputSignUpMail');
    let password = document.getElementById('inputSignUpPassword1');
    let password2 = document.getElementById('inputSignUpPassword2');
    let checkbox = document.getElementById('checkboxAccept');
    if (!checkbox.checked) {
        document.getElementById('passwordIncorrect').innerText = "You must accept the Privacy Policy";
        checkbox.style.border = "2px solid red";
        return;
    }
    if (!(await isEmailUnique(mail.value))) {
        document.getElementById('passwordIncorrect').innerText = "This email is already registered";
        mail.style.border = "2px solid red";
        return;
    }
    let user = createUserObject();
    if (await passwordCheck(user, password, password2)) {
    }
};


/**
* This function creates user data and returns it to the function AddUser().
*/

function createUserObject() {
    let name = document.getElementById('inputSignUpName').value;
    let mail = document.getElementById('inputSignUpMail').value;
    let password = document.getElementById('inputSignUpPassword1').value;
    return {
        'name': name,
        'initials': getInitials(name),
        'password': password,
        'mail': mail,
    };
}


/**
* This function checks whether the specified mail address is already registered and returns the answer to addUser().
*/

async function isEmailUnique(email) {
    await loadUser();
    return !userList.some(user => user.mail === email);
}


/**
* This function checks the passwords and returns them to addUser()
*/

async function passwordCheck(user, password, password2) {
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();
    if (await isPasswordEmpty(passwordValue, password2Value)) {
    }
    if (await isPasswordEqual(user, passwordValue, password2Value)) {
    } else {
        let passwordIncorrect = document.getElementById('passwordIncorrect');
        passwordIncorrect.innerHTML = "Ups! your passwords don't match";
        password2.style.border = "2px solid red";
        return false;
    }
}


/**
* This function checks whether the passwords are identical and returns the result to passwordCheck().
*/

async function isPasswordEqual(user, passwordValue, password2Value) {
    if (passwordValue === password2Value) {
        document.getElementById('bgSignupSuccesfully').classList.remove('d-none');
        await postData('/users', user);
        setTimeout(function () {
            window.location.href = "./log-in.html";
        }, 1500);
        return true;
    }
}


/**
* This function checks whether the input fields for the passwords are filled in and returns the result to  passwordCheck().
*/

async function isPasswordEmpty(passwordValue, password2Value) {
    if (passwordValue === "" || password2Value === "") {
        let passwordIncorrect = document.getElementById('passwordIncorrect');
        passwordIncorrect.innerHTML = "Passwords cannot be empty";
        password2.style.border = "2px solid red";
        return false;
    }
}


/**
* This function load the user data
*/

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


/**
* This function is for the login
*/

function login() {
    let mail = document.getElementById('inputLoginMail');
    let password = document.getElementById('inputLoginPassword');
    let user = userList.find(u => u.mail == mail.value && u.password == password.value);
    if (user) {
        let userAsText = JSON.stringify(user);
        localStorage.setItem('user', userAsText);
        window.location.href = "./summary.html";
    } else {
        let failedLogin = document.getElementById('failedLogin');
        failedLogin.innerHTML = "E-Mail or password are incorrect";;
    }
}


/**
* This function is for the guest login
*/

function guestLogin() {
    let user = {
        'initials': 'G',
        'name': 'Gast'
    };
    let userAlsText = JSON.stringify(user);
    localStorage.setItem('user', userAlsText);
    window.location.href = "./summary.html";
}


/**
* This function generates the initials of the names and returns them to addContact().
*/

function getInitials(name) {
    return name
        .split(" ")
        .filter(word => word.length > 0)
        .map(word => word[0].toUpperCase())
        .join("");
}


function closeBtnSignUpSuccesfully(event) {
    event.preventDefault();
    addUser();
};