document.addEventListener('DOMContentLoaded', () => {

    const menuToggle = document.getElementById('menu-toggle'); 
    const navLinks = document.getElementById('nav-links'); 
    
    if (menuToggle && navLinks) { 
        menuToggle.addEventListener('click', () => { 
            navLinks.classList.toggle('active'); 
        }); 
    } 

    const botaoModo = document.getElementById("toggle-modo");
    const body = document.body;

    const modoSalvo = localStorage.getItem("tema");

    if (modoSalvo === "modo-escuro") {
        body.classList.add("modo-escuro");
        botaoModo.textContent = "Modo Claro";
    } else {
        body.classList.add("modo-claro");
        botaoModo.textContent = "Modo Escuro";
    }


    botaoModo.addEventListener("click", () => {
        body.classList.toggle("modo-escuro");
        

        if (body.classList.contains("modo-escuro")) {
            botaoModo.textContent = "Modo Claro";
            localStorage.setItem("tema", "modo-escuro");
        } else {
            botaoModo.textContent = "Modo Escuro";
            localStorage.setItem("tema", "modo-claro");
        }
    });
});