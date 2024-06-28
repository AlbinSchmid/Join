/**
 * Includes HTML content from external files into the current document.
 * 
 * This function finds elements with the 'w3-include-html' attribute, fetches the content of the specified file,
 * and replaces the innerHTML of those elements with the fetched content. If the fetch fails, it displays a "Page not found" message.
 */
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


/**
 * Initializes the web page by including external HTML content, displaying the user initials, and setting the active link.
 */
(async function () {
    await includeHTML();
    showUser();
    linkActive();
    document.dispatchEvent(new CustomEvent("init"));
})();


/**
 * Sets the active state for the current link to the current page.
 * 
 * This function checks the current pathname and applies the 'active-link' class to the current navigation link element.
 */
function linkActive() {
    const links = {
        "/summary.html": "link-summary",
        "/add-task.html": "link-task",
        "/board.html": "link-board",
        "/contact.html": "link-contact",
    };
    const pathname = window.location.pathname;
    const id = links[pathname];

    document.getElementById(id)?.classList.toggle("active-link");
}

/**
 * Displays the initials of the logged-in user.
 * 
 * This function retrieves the user details from local storage, extracts the initials, and displays them in the designated container.
 */
function showUser() {
    let userInitials = document.getElementById("userInitials");
    if (!userInitials) {
        console.error("Can not find container userInitials");
        return;
    }
    let userAsText = localStorage.getItem("user");
    if (!userAsText) {
        hideNavbarAndUserMenu();
        return;
    }
    let user = JSON.parse(userAsText);
    userInitials.innerHTML = `<div>${user.initials}</div>`;
}

function hideNavbarAndUserMenu() {
    document.getElementById("side-bar-nav").style.visibility = "hidden";
    document.getElementById("header-right").style.visibility = "hidden";

}