async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = "Page not found";
        }
    }
}

(async function () {
    await includeHTML();
    showUser();
    linkActive();
})();


function linkActive() {
    const links = {
        "/summary.html": "link-summary",
        "/add-task.html": "link-task",
        "/board.html": "link-board",
        "/contact.html": "link-contact",
    };
    const pathname = window.location.pathname;
    const id = links[pathname];
    if (!id) {
        console.error("The link doesn't exist", pathname);
        return;
    }
    document.getElementById(id).classList.toggle("active-link");
}


function showUser() {
    let userInitials = document.getElementById("userInitials");
    if (!userInitials) {
        console.error("Can not find container userInitials");
        return;
    }
    let userAsText = localStorage.getItem("user");
    let user = JSON.parse(userAsText);
    userInitials.innerHTML = `<div>${user.initials}</div>`;
}