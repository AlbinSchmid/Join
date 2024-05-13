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


function changePencilImg(element) {
    document.getElementById('pencil-img').setAttribute('src', './assets/img/icons/summary/pencil-white.png');
}

function resetPencilImg(element) {
    document.getElementById('pencil-img').setAttribute('src', './assets/img/icons/summary/pencil-darkblue.png');
}

function changeCheckImg(element) {
    document.getElementById('check-img').setAttribute('src', './assets/img/icons/summary/check-white.png');
}

function resetCheckImg(element) {
    document.getElementById('check-img').setAttribute('src', './assets/img/icons/summary/check-darkblue.png');
}