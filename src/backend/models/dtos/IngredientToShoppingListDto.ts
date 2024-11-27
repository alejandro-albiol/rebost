import { Ingredient } from "../interfaces/Ingredient";

export interface IngredientToShoppingListDto {
    shoppingListId: number,
    ingredient: Ingredient,
    quantity:number
}