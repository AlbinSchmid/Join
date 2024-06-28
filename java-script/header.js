/**
 * Toggles the visibility of the dropdown menu in the header.
 * 
 * This function adds or removes the 'd-block' class to the element with the ID 'container-header-dropdown-menu',
 * effectively showing or hiding the dropdown menu.
 */
function showDropdownMenu() {
    document.getElementById('container-header-dropdown-menu').classList.toggle('d-block');
}

function logout() {
    localStorage.removeItem('user');
}
