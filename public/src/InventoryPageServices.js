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
class InventoryService {
    static fetchInventory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`http://localhost:3000/api/v1/inventory/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
                }
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('El contenido de la respuesta no es un JSON válido');
                }
                // Leemos la respuesta solo una vez
                const result = yield response.json();
                if (!result.success) {
                    throw new Error(result.message || 'Error al obtener el inventario');
                }
                if (!Array.isArray(result.data)) {
                    throw new Error('La respuesta de los ingredientes no es un arreglo');
                }
                return result.data || [];
            }
            catch (error) {
                console.error('Error fetching inventory:', error);
                return [];
            }
        });
    }
    static renderInventory(ingredientList) {
        const inventoryContainer = document.getElementById('inventory-container');
        if (!inventoryContainer) {
            console.error('El contenedor del inventario no se encontró');
            return;
        }
        // Limpiar contenido previo
        inventoryContainer.innerHTML = '';
        // Recorrer la lista de ingredientes y generar los elementos
        ingredientList.forEach((ingredient) => {
            const ingredientElement = document.createElement('div');
            ingredientElement.className = 'ingredient-item';
            ingredientElement.innerHTML = `
                <div>
                    <strong>${ingredient.name}</strong> (${ingredient.format}) - 
                    Quantity: ${ingredient.quantity}, 
                    Expiry date: ${new Date(ingredient.expiry_date).toLocaleDateString()}
                </div>
            `;
            inventoryContainer.appendChild(ingredientElement);
        });
    }
    static fetchAndRenderInventory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ingredientList = yield InventoryService.fetchInventory(userId); // Obtener datos del backend
                // Si no hay ingredientes, mostrar un mensaje
                if (ingredientList.length === 0) {
                    console.log('No hay ingredientes en el inventario.');
                    return;
                }
                // Llamar a renderInventory para mostrar los ingredientes
                InventoryService.renderInventory(ingredientList);
            }
            catch (error) {
                console.error('Error fetching and rendering inventory:', error);
            }
        });
    }
    static addIngredientToInventory(ingredientData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!(user === null || user === void 0 ? void 0 : user.id))
                    throw new Error('Usuario no autenticado');
                // Paso 1: Encontrar o crear el ingrediente
                const ingredientResponse = yield fetch('http://localhost:3000/api/v1/ingredients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: ingredientData.name,
                        format: ingredientData.format
                    })
                });
                const ingredientResult = yield ingredientResponse.json();
                if (!ingredientResult.success) {
                    throw new Error(ingredientResult.message);
                }
                // Paso 2: Añadir al inventario del usuario usando el ID obtenido
                const inventoryResponse = yield fetch('http://localhost:3000/api/v1/inventory', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        ingredient_id: ingredientResult.data.id,
                        quantity: ingredientData.quantity,
                        is_available: true,
                        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días por defecto
                    })
                });
                const inventoryResult = yield inventoryResponse.json();
                if (!inventoryResult.success) {
                    throw new Error(inventoryResult.message);
                }
                // Actualizar la vista
                const updatedList = yield this.fetchInventory(user.id);
                this.renderInventory(updatedList);
                return inventoryResult;
            }
            catch (error) {
                console.error('Error adding ingredient:', error);
                throw error;
            }
        });
    }
    // Añadir un método para manejar el evento del formulario
    static initializeAddIngredientForm() {
        const addIngredientBtn = document.getElementById('addIngredientBtn');
        if (addIngredientBtn) {
            addIngredientBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const nameInput = document.getElementById('ingredientName');
                    const formatSelect = document.getElementById('ingredientFormat');
                    const quantityInput = document.getElementById('ingredientQuantity');
                    if (!nameInput.value || !formatSelect.value || !quantityInput.value) {
                        alert('Please fill in all required fields');
                        return;
                    }
                    yield InventoryService.addIngredientToInventory({
                        name: nameInput.value,
                        format: formatSelect.value,
                        quantity: parseFloat(quantityInput.value)
                    });
                    // Limpiar el formulario
                    nameInput.value = '';
                    formatSelect.value = formatSelect.options[0].value;
                    quantityInput.value = '';
                }
                catch (error) {
                    console.error('Error adding ingredient:', error);
                    alert('Error adding ingredient');
                }
            }));
        }
    }
}
// Event listener para manejar la carga de la página
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            // Obtener y renderizar el inventario
            yield InventoryService.fetchAndRenderInventory(user.id);
            // Inicializar el formulario de añadir ingrediente
            InventoryService.initializeAddIngredientForm();
            // Manejar el botón para redirigir al home
            const goToHomeBtn = document.getElementById('go-to-home');
            if (goToHomeBtn) {
                goToHomeBtn.addEventListener('click', () => {
                    window.location.href = `/home/${user.id}`;
                });
            }
        }
        else {
            console.error('Usuario no autenticado o ID de usuario no encontrado');
        }
    }
    catch (error) {
        console.error('Error loading inventory:', error);
    }
}));
