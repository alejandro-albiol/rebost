import { IngredientFormat } from "./IngredientFormat";

export interface Ingredient{
    id?:number;
    name:string;
    format:IngredientFormat
}