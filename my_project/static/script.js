function toggleDropdown() {
    const menu = document.getElementById("user-dropdown");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

window.addEventListener('click', function(e) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById("user-dropdown");
    if (!userMenu.contains(e.target)) {
        dropdown.style.display = "none";
    }
});