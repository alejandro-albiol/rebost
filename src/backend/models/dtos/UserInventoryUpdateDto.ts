export interface UserInventoryUpdateDto {
    id:number;
    user_id: number;
    ingredient_id: number;
    quantity?: number;
    expiry_date?: string;
    is_available?: boolean;
}
