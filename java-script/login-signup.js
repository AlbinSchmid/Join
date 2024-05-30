let users = [
    {'name': 'Björn Test', 'email': 'test@test.de', 'password': '1234'}
]

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
    let mail = document.getElementById('inputSignUpEmail');
    let password1 = document.getElementById('inputSignUpPassword1');
    let password2 = document.getElementById('inputSignUpPassword2');
    let user = {
        'name': name.value,
        'initials': getInitials(name.value),
        'password1': password1.value,
        'password2': password2.value,
        'mail': mail.value,
    }
    console.log(user);
    await postData('/users', user);
    name.value = '';
    mail.value = '';
    password1.value = '';
    password2.value = '';
}


function getInitials(name) {
    return name
        .split(" ")                        // Teilt den Namen in Wörter auf
        .filter(word => word.length > 0)   // Entfernt leere Wörter (falls vorhanden)
        .map(word => word[0].toUpperCase())  // Nimmt den ersten Buchstaben jedes Wortes und wandelt ihn in Großbuchstaben um
        .join("");                         // Verbindet die Buchstaben zu einer Zeichenkette
}
