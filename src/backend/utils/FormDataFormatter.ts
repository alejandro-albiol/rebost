import { IngredientToShoppingListDto } from "../models/dtos/IngredientToShoppingListDto";

export class FormDataFormatter {

    static formatShoppingListData(ingredientToShoppingList: IngredientToShoppingListDto) {
        if (!ingredientToShoppingList.shoppingListId || !ingredientToShoppingList.ingredient || !ingredientToShoppingList.quantity) {
            throw new Error("Missing required fields: shoppingListId, ingredient, or quantity");
        }

        return {
            shoppingListId: ingredientToShoppingList.shoppingListId,
            ingredient: {
                name: ingredientToShoppingList.ingredient.name.trim(),
                format: ingredientToShoppingList.ingredient.format || null,
            },
            quantity: ingredientToShoppingList.quantity,
        };
    }
}
