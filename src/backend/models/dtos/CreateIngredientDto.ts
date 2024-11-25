import { IngredientFormat } from "../interfaces/IngredientFormat";

export class CreateIngredientDto{
    name!:string;
    format!:IngredientFormat;
}