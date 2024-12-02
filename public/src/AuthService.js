"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class AuthService {
    static login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch("http://localhost:3000/api/v1/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            const result = yield response.json();
            if (result.success && result.data) {
                // Guardamos los datos del usuario en localStorage
                localStorage.setItem("user", JSON.stringify(result.data));
                return { success: true, data: result.data };
            }
            else {
                return { success: false, message: result.message || "Login failed" };
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            const form = event.target;
            if (!(form instanceof HTMLFormElement)) {
                return; // Si event.target no es un formulario, salimos de la función
            }
            const formData = new FormData(form);
            const credentials = {
                username: formData.get('username'),
                password: formData.get('password')
            };
            // Llamada a AuthService para manejar el login
            const result = yield AuthService.login(credentials.username, credentials.password);
            if (result.success) {
                // Redirige al usuario a la página principal con su userID
                const userID = result.data.id;
                window.location.href = `/home/${userID}`;
            }
            else {
                // Maneja el error de login
                alert(result.message || "Login fallido");
            }
        }));
    }
    else {
        console.error('El formulario de login no se encontró');
    }
});
