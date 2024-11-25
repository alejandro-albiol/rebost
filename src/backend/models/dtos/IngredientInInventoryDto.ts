export interface IngredientInInventoryDto{
    id?:number;
    user_id?:number;
    ingredient_id?:number;
    quantity:number;
    expiry_date:Date;
    is_available:boolean;
}