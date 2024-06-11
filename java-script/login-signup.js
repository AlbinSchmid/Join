let userList = [];

/**
 * Adds a new user by collecting input data, performing validations, and handling the signup process.
 */
async function addUser() {
    let mail = document.getElementById('inputSignUpMail');
    let password = document.getElementById('inputSignUpPassword1');
    let password2 = document.getElementById('inputSignUpPassword2');
    let checkbox = document.getElementById('checkboxAccept');
    let passwordIncorrect = document.getElementById('passwordIncorrect');
    errorMessage(mail, checkbox, passwordIncorrect);
    let user = createUserObject();
    if (await passwordCheck(user, password, password2)) {
    }
}


/**
 * Displays error messages based on input validations for email uniqueness and checkbox acceptance.
 * 
 * @param {HTMLElement} mail - The email input element.
 * @param {HTMLElement} checkbox - The checkbox element for privacy policy acceptance.
 * @param {HTMLElement} passwordIncorrect - The element displaying error messages.
 */
async function errorMessage(mail, checkbox, passwordIncorrect) {
    if (!checkbox.checked) {
        passwordIncorrect.classList.remove('d-none');
        passwordIncorrect.innerText = "You must accept the Privacy Policy";
        checkbox.style.border = "2px solid red";
        return;
    }
    if (!(await isEmailUnique(mail.value))) {
        passwordIncorrect.classList.remove('d-none');
        passwordIncorrect.innerText = "This email is already registered";
        mail.style.border = "2px solid red";
        return;
    }
}


/**
 * Creates a user object based on input values for name, email, and password.
 * 
 * @returns {Object} The user object containing name, initials, email, and password.
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
 * Checks if the provided email is unique by comparing it with the list of existing users.
 * 
 * @param {string} email - The email to check for uniqueness.
 * @returns {Promise<boolean>} True if the email is unique, false otherwise.
 */
async function isEmailUnique(email) {
    await loadUser();
    return !userList.some(user => user.mail === email);
}


/**
 * Validates the provided passwords, checks if they match, and handles the signup process if valid.
 * 
 * @param {Object} user - The user object containing user details.
 * @param {HTMLElement} password - The first password input element.
 * @param {HTMLElement} password2 - The second password input element.
 * @returns {Promise<boolean>} True if the passwords are valid and match, false otherwise.
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
 * Checks if the provided passwords are equal and handles successful signup if they match.
 * 
 * @param {Object} user - The user object containing user details.
 * @param {string} passwordValue - The first password value.
 * @param {string} password2Value - The second password value.
 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
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
 * Checks if the provided passwords are empty and displays an error message if they are.
 * 
 * @param {string} passwordValue - The first password value.
 * @param {string} password2Value - The second password value.
 * @returns {Promise<boolean>} False if either password is empty, true otherwise.
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
 * Loads the list of users from the server and populates the userList array.
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
 * Logs in a user by checking the provided email and password against the userList.
 * If successful, redirects to the summary page, otherwise displays an error message.
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
        failedLogin.classList.remove('d-none');
        failedLogin.innerHTML = "E-Mail or password are incorrect";;
    }
}


/**
 * Logs in a guest user by setting guest user details in local storage and redirecting to the summary page.
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
 * Generates initials from the provided name by extracting the first letter of each word and converting it to uppercase.
 * 
 * @param {string} name - The name to generate initials from.
 * @returns {string} The initials generated from the name.
 */
function getInitials(name) {
    return name
        .split(" ")
        .filter(word => word.length > 0)
        .map(word => word[0].toUpperCase())
        .join("");
}


/**
 * Prevents the default form submission and triggers the addUser function.
 * 
 * @param {Event} event - The form submission event.
 */
function closeBtnSignUpSuccesfully(event) {
    event.preventDefault();
    addUser();
}
