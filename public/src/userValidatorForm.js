"use strict";
// Seleccionar todos los inputs del formulario
const inputs = document.querySelectorAll('input');
// Añadir eventos de 'focus' y 'blur' a cada input
inputs.forEach(input => {
    // Mostrar la ayuda cuando el campo tiene foco
    input.addEventListener('focus', () => {
        const helpText = document.getElementById(`${input.id}`);
        if (helpText) {
            helpText.style.display = 'block'; // Mostrar el texto de ayuda
        }
    });
    // Ocultar la ayuda cuando el campo pierde foco
    input.addEventListener('blur', () => {
        const helpText = document.getElementById(`${input.id}`);
        if (helpText) {
            helpText.style.display = 'none'; // Ocultar el texto de ayuda
        }
    });
});
