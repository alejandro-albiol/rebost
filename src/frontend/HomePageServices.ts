class HomePageShoppingListServices {
    static initializeShoppingList() {
        console.log('Inicializando lista de compras...');
        const user = JSON.parse(localStorage.getItem('user')!);
        if (user && user.id) {
            this.fetchAndRenderShoppingLists(user.id);
        } else {
            console.error('User not authenticated or user ID not found');
        }
    }

    static async fetchShoppingLists(userId: number) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/shoppinglists/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Error al obtener las listas de la compra');
            }

            return result.data || [];
        } catch (error) {
            console.error('Error fetching shopping lists:', error);
            return [];
        }
    }

    static renderShoppingLists(shoppingLists: any[]) {
        const shoppingListContainer = document.getElementById('shopping-list-container');
        if (!shoppingListContainer) {
            console.error('Shopping list container not found');
            return;
        }

        shoppingListContainer.innerHTML = '';

        shoppingLists.forEach((list: any) => {
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

    static async fetchAndRenderShoppingLists(userId: number) {
        try {
            const shoppingLists = await this.fetchShoppingLists(userId);

            if (shoppingLists.length === 0) {
                console.log('No hay listas de la compra.');
                return;
            }

            this.renderShoppingLists(shoppingLists);
        } catch (error) {
            console.error('Error fetching and rendering shopping lists:', error);
        }
    }

    static initializeGoToInventoryButton() {
        const goToInventoryBtn = document.getElementById('go-to-inventory');
        const user = JSON.parse(localStorage.getItem('user')!);

        if (goToInventoryBtn && user?.id) {
            goToInventoryBtn.addEventListener('click', () => {
                window.location.href = `/inventory/${user.id}`;
            });
        }
    }
}

class HomePageRecipeServices {
    static async generateRecipes(ingredients: string[]) {
        try {
            console.log('Sending ingredients:', ingredients);
            const response = await fetch('http://localhost:3000/api/v1/recipes/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ingredients })
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Error generando recetas');
            }

            return result.data || [];
        } catch (error) {
            console.error('Error generating recipes:', error);
            throw error;
        }
    }

    static renderRecipes(recipes: any[]) {
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
        const form = document.getElementById('recipe-form') as HTMLFormElement;
        const useInventoryBtn = document.getElementById('use-inventory-btn');
        const ingredientsInput = document.getElementById('ingredients-input') as HTMLInputElement;

        if (!form || !useInventoryBtn || !ingredientsInput) {
            console.error('Required elements not found:', {
                form: !!form,
                useInventoryBtn: !!useInventoryBtn,
                ingredientsInput: !!ingredientsInput
            });
            return;
        }

        form.addEventListener('submit', async (e) => {
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
                const recipes = await this.generateRecipes(ingredients);
                this.renderRecipes(recipes);
            } catch (error) {
                console.error('Error:', error);
                alert('Error generating recipes');
            }
        });

        useInventoryBtn.addEventListener('click', async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user')!);
                if (!user?.id) {
                    alert('User not authenticated');
                    return;
                }

                const response = await fetch(`http://localhost:3000/api/v1/inventory/${user.id}`);
                const result = await response.json();

                if (!result.success) {
                    throw new Error('Error fetching inventory ingredients');
                }

                const ingredients = result.data.map((item: any) => item.name);
                const recipes = await this.generateRecipes(ingredients);
                this.renderRecipes(recipes);
            } catch (error) {
                console.error('Error:', error);
                alert('Error generating recipes from inventory');
            }
        });
    }

    static initializeGoToInventoryButton() {
        const goToInventoryBtn = document.getElementById('go-to-inventory');
        const user = JSON.parse(localStorage.getItem('user')!);

        if (goToInventoryBtn && user?.id) {
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
