const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".header-down");

if (toggle && menu) {
    toggle.addEventListener("click", () => {
        menu.classList.toggle("menu-open");
    });
}