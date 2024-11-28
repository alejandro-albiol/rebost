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
                    Cantidad: ${ingredient.quantity}, 
                    Fecha de caducidad: ${new Date(ingredient.expiry_date).toLocaleDateString()}
                </div>
                <div>
                    Disponible: ${ingredient.is_available ? 'Sí' : 'No'}
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
                console.error('Error en fetchAndRenderInventory:', error);
            }
        });
    }
}
// Event listener para manejar la carga de la página
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(localStorage.getItem('user')); // Asegúrate de que el usuario esté autenticado
        if (user && user.id) {
            // Obtener y renderizar el inventario
            yield InventoryService.fetchAndRenderInventory(user.id);
            // Manejar el botón para redirigir a la lista de la compra
            const goToShoppingListBtn = document.getElementById('go-to-shopping-list');
            if (goToShoppingListBtn) {
                goToShoppingListBtn.addEventListener('click', () => {
                    window.location.href = `/shoppingList/${user.id}`;
                });
            }
        }
        else {
            console.error('Usuario no autenticado o ID de usuario no encontrado');
        }
    }
    catch (error) {
        console.error('Error al cargar el inventario:', error);
    }
}));
