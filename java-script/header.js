
function showDropdownMenu() {
    document.getElementById('container-header-dropdown-menu').classList.toggle('d-block');
}


function showUser() {
    let userInitials = document.getElementById('userInitials');
    userInitials.innerHTML = '';
    let userAsText = localStorage.getItem('user');
    let user = JSON.parse(userAsText);
    userInitials.innerHTML = `
    <div>${user['initials']}</div>
    `;
}