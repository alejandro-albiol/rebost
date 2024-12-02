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
class HomePageShoppingListServices {
    static initializeShoppingList() {
        console.log('Inicializando lista de compras...');
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            this.fetchAndRenderShoppingLists(user.id);
        }
        else {
            console.error('User not authenticated or user ID not found');
        }
    }
    static fetchShoppingLists(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`http://localhost:3000/api/v1/shoppinglists/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
                }
                const result = yield response.json();
                if (!result.success) {
                    throw new Error(result.message || 'Error al obtener las listas de la compra');
                }
                return result.data || [];
            }
            catch (error) {
                console.error('Error fetching shopping lists:', error);
                return [];
            }
        });
    }
    static renderShoppingLists(shoppingLists) {
        const shoppingListContainer = document.getElementById('shopping-list-container');
        if (!shoppingListContainer) {
            console.error('Shopping list container not found');
            return;
        }
        shoppingListContainer.innerHTML = '';
        shoppingLists.forEach((list) => {
            const listElement = document.createElement('div');
            listElement.className = 'shopping-list-item';
            listElement.innerHTML = `
                <h3>${list.shopping_list_name || 'Lista sin nombre'}</h3>
                <ul>
                    <li>
                        ${list.ingredient_name || ''} 
                        ${list.ingredient_format ? `(${list.ingredient_format})` : ''} - 
                        Quantity: ${list.quantity || 0}, 
                        Purchased: ${list.is_purchased ? 'Yes' : 'No'}
                    </li>
                </ul>
            `;
            shoppingListContainer.appendChild(listElement);
        });
    }
    static fetchAndRenderShoppingLists(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const shoppingLists = yield this.fetchShoppingLists(userId);
                if (shoppingLists.length === 0) {
                    console.log('No hay listas de la compra.');
                    return;
                }
                this.renderShoppingLists(shoppingLists);
            }
            catch (error) {
                console.error('Error fetching and rendering shopping lists:', error);
            }
        });
    }
    static initializeGoToInventoryButton() {
        const goToInventoryBtn = document.getElementById('go-to-inventory');
        const user = JSON.parse(localStorage.getItem('user'));
        if (goToInventoryBtn && (user === null || user === void 0 ? void 0 : user.id)) {
            goToInventoryBtn.addEventListener('click', () => {
                window.location.href = `/inventory/${user.id}`;
            });
        }
    }
}
class HomePageRecipeServices {
    static generateRecipes(ingredients) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Sending ingredients:', ingredients);
                const response = yield fetch('http://localhost:3000/api/v1/recipes/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ingredients })
                });
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
                }
                const result = yield response.json();
                if (!result.success) {
                    throw new Error(result.message || 'Error generando recetas');
                }
                return result.data || [];
            }
            catch (error) {
                console.error('Error generating recipes:', error);
                throw error;
            }
        });
    }
    static renderRecipes(recipes) {
        const recipesContainer = document.getElementById('recipes-container');
        if (!recipesContainer) {
            console.error('Recipe container not found');
            return;
        }
        recipesContainer.innerHTML = '';
        recipes.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.className = 'recipe-card';
            recipeElement.innerHTML = `
                <h3>${recipe.title}</h3>
                <p>${recipe.description}</p>
            `;
            recipesContainer.appendChild(recipeElement);
        });
    }
    static initializeRecipeGeneration() {
        const form = document.getElementById('recipe-form');
        const useInventoryBtn = document.getElementById('use-inventory-btn');
        const ingredientsInput = document.getElementById('ingredients-input');
        if (!form || !useInventoryBtn || !ingredientsInput) {
            console.error('Required elements not found:', {
                form: !!form,
                useInventoryBtn: !!useInventoryBtn,
                ingredientsInput: !!ingredientsInput
            });
            return;
        }
        form.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const ingredients = ingredientsInput.value
                .split(',')
                .map(i => i.trim())
                .filter(i => i.length > 0);
            if (ingredients.length === 0) {
                alert('Please enter at least one ingredient');
                return;
            }
            try {
                const recipes = yield this.generateRecipes(ingredients);
                this.renderRecipes(recipes);
            }
            catch (error) {
                console.error('Error:', error);
                alert('Error generating recipes');
            }
        }));
        useInventoryBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!(user === null || user === void 0 ? void 0 : user.id)) {
                    alert('User not authenticated');
                    return;
                }
                const response = yield fetch(`http://localhost:3000/api/v1/inventory/${user.id}`);
                const result = yield response.json();
                if (!result.success) {
                    throw new Error('Error fetching inventory ingredients');
                }
                const ingredients = result.data.map((item) => item.name);
                const recipes = yield this.generateRecipes(ingredients);
                this.renderRecipes(recipes);
            }
            catch (error) {
                console.error('Error:', error);
                alert('Error generating recipes from inventory');
            }
        }));
    }
    static initializeGoToInventoryButton() {
        const goToInventoryBtn = document.getElementById('go-to-inventory');
        const user = JSON.parse(localStorage.getItem('user'));
        if (goToInventoryBtn && (user === null || user === void 0 ? void 0 : user.id)) {
            goToInventoryBtn.addEventListener('click', () => {
                window.location.href = `/inventory/${user.id}`;
            });
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    HomePageShoppingListServices.initializeShoppingList();
    HomePageRecipeServices.initializeRecipeGeneration();
    HomePageRecipeServices.initializeGoToInventoryButton();
});
