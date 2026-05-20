document.addEventListener('DOMContentLoaded', () => {
    // MENU HAMBÚRGUER MOBILE 
    const menuToggle = document.getElementById('menu-toggle'); 
    const navLinks = document.getElementById('nav-links'); 
    
    if (menuToggle && navLinks) { 
        menuToggle.addEventListener('click', () => { 
            navLinks.classList.toggle('active'); 
        }); 
    } 

    const botaoDark = document.getElementById("toggle-escuro");
    const body = document.body;

    const modoSalvo = localStorage.getItem("tema");

    if (modoSalvo === "dark") {
        body.classList.add("modo-escuro");
        botaoDark.textContent = "☀️ Modo Claro";
    }


    botaoDark.addEventListener("click", () => {
        body.classList.toggle("modo-escuro");
        

        if (body.classList.contains("modo-escuro")) {
            botaoDark.textContent = "☀️ Modo Claro";
            localStorage.setItem("tema", "dark");
        } else {
            botaoDark.textContent = "🌙 Modo Escuro";
            localStorage.setItem("tema", "light");
        }
    });
});