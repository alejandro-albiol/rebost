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
class RecipeGeneratorService {
    static generateRecipes(ingredients) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
            console.error('El contenedor de recetas no se encontró');
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
        const manualInputDiv = document.getElementById('manual-input');
        const ingredientsInput = document.getElementById('ingredients-input');
        if (!form || !useInventoryBtn || !manualInputDiv || !ingredientsInput) {
            console.error('No se encontraron elementos necesarios');
            return;
        }
        // Manejar generación manual de recetas
        form.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const ingredients = ingredientsInput.value
                .split(',')
                .map(i => i.trim())
                .filter(i => i.length > 0);
            if (ingredients.length === 0) {
                alert('Por favor, introduce al menos un ingrediente');
                return;
            }
            try {
                const recipes = yield this.generateRecipes(ingredients);
                this.renderRecipes(recipes);
            }
            catch (error) {
                console.error('Error generating and rendering recipes:', error);
                // Mostrar mensaje de error al usuario
                const recipesContainer = document.getElementById('recipes-container');
                if (recipesContainer) {
                    recipesContainer.innerHTML = `
                        <div class="error-message">
                            Error generating recipes. Please try again.
                        </div>
                    `;
                }
            }
        }));
        // Manejar generación de recetas usando el inventario del usuario
        useInventoryBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!(user === null || user === void 0 ? void 0 : user.id)) {
                alert('Usuario no autenticado');
                return;
            }
            try {
                // Obtener ingredientes del inventario del usuario
                const response = yield fetch(`http://localhost:3000/api/v1/inventory/${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const result = yield response.json();
                if (!result.success) {
                    throw new Error('Error obteniendo ingredientes del inventario');
                }
                // Extraer nombres de ingredientes
                const ingredients = result.data.map((item) => item.name);
                // Generar y mostrar recetas
                yield this.generateAndRenderRecipes(ingredients);
            }
            catch (error) {
                console.error('Error initializing recipe generation:', error);
                alert('Error generando recetas');
            }
        }));
    }
    static handleFormSubmit(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!(user === null || user === void 0 ? void 0 : user.id)) {
                    alert('Usuario no autenticado');
                    return;
                }
                // Obtener ingredientes seleccionados del formulario
                const selectedIngredients = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                    .map((checkbox) => checkbox.value);
                if (selectedIngredients.length === 0) {
                    alert('Please select at least one ingredient');
                    return;
                }
                // Generar y mostrar recetas
                yield this.generateAndRenderRecipes(selectedIngredients);
            }
            catch (error) {
                console.error('Error handling form submission:', error);
                alert('Error generating recipes');
            }
        });
    }
    static initializeForm() {
        return __awaiter(this, void 0, void 0, function* () {
            const form = document.getElementById('recipe-form');
            const ingredientsList = document.querySelector('.ingredients-list');
            if (!form || !ingredientsList) {
                console.error('Form elements not found');
                return;
            }
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!(user === null || user === void 0 ? void 0 : user.id)) {
                    throw new Error('User not authenticated');
                }
                // Obtener ingredientes del inventario
                const response = yield fetch(`http://localhost:3000/api/v1/inventory/${user.id}`);
                const result = yield response.json();
                if (!result.success) {
                    throw new Error('Error getting ingredients');
                }
                // Renderizar checkboxes para cada ingrediente
                ingredientsList.innerHTML = result.data.map((item) => `
                <div class="ingredient-checkbox">
                    <input type="checkbox" id="ingredient-${item.id}" value="${item.name}" />
                    <label for="ingredient-${item.id}">${item.name} (${item.format})</label>
                </div>
            `).join('');
                // Añadir event listener al formulario
                form.addEventListener('submit', (e) => this.handleFormSubmit(e));
            }
            catch (error) {
                console.error('Error initializing form:', error);
                ingredientsList.innerHTML = '<p class="error">Error loading ingredients</p>';
            }
        });
    }
    static generateAndRenderRecipes(ingredients) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipes = yield this.generateRecipes(ingredients);
                this.renderRecipes(recipes);
            }
            catch (error) {
                console.error('Error generating and rendering recipes:', error);
                const recipesContainer = document.getElementById('recipes-container');
                if (recipesContainer) {
                    recipesContainer.innerHTML = `
                    <div class="error-message">
                        Error generating recipes. Please try again.
                    </div>
                `;
                }
            }
        });
    }
}
// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    RecipeGeneratorService.initializeForm();
});
