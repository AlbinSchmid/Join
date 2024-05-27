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