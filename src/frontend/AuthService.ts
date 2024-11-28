class AuthService {
    static async login(username: any, password: any): Promise<any> {//TO DO: fix any types
        const response = await fetch("http://localhost:3000/api/v1/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
 
        const result = await response.json();
 
        if (result.success && result.data) {
            // Guardamos los datos del usuario en localStorage
            localStorage.setItem("user", JSON.stringify(result.data));
            
            return { success: true, data: result.data };
        } else {
            return { success: false, message: result.message || "Login failed" };
        }
    }
 }

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
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
            const result = await AuthService.login(credentials.username, credentials.password);
            
            if (result.success) {
                // Redirige al usuario a la página principal con su userID
                const userID = result.data.id;
                window.location.href = `/homepage/${userID}`;
            } else {
                // Maneja el error de login
                alert(result.message || "Login fallido");
            }
        });
    } else {
        console.error('El formulario de login no se encontró');
    }
});