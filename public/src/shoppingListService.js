"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('go-to-inventory');
    if (button) {
        button.addEventListener('click', () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.id) {
                window.location.href = `/inventory/${user.id}`;
            }
            else {
                alert('Usuario no autenticado');
                window.location.href = '/login'; // Redirigir al login si no hay usuario
            }
        });
    }
});
