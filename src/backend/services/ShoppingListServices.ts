import pool from "../configuration/dataBaseConfig.js";
import { IngredientToShoppingListDto } from "../models/dtos/IngredientToShoppingListDto.js";
import { ApiResponse } from "../models/interfaces/ApiResponse.js";
import { Ingredient } from "../models/interfaces/Ingredient.js";
import { ShoppingList } from "../models/interfaces/ShoppingList.js";
import { IngredientServices } from "./IngredientServices.js";

export class ShoppingListServices {
    static async createShoppingList(newShoppingList:ShoppingList): Promise<ApiResponse> {
        try {
            const query = `
                INSERT INTO shopping_lists (name, created_at, created_by)
                VALUES ($1, $2, $3)
                RETURNING id, name, created_at, created_by;
            `;
            const result = await pool.query(query, [
                newShoppingList.name, 
                new Date, 
                newShoppingList.created_by, 
                ]);

            return {
                success: true,
                message: 'Shopping list created successfully',
                data: result.rows[0],
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error creating shopping list',
                errorCode: error.code || 'UNKNOWN_ERROR',
            };
        }
    }
    static async getShoppingListByUserId(userId: number): Promise<ApiResponse> {
        try {
            const query = `
                SELECT 
                    sl.id AS shopping_list_id,
                    sl.name AS shopping_list_name,
                    sl.created_at,
                    sli.id AS item_id,
                    i.name AS ingredient_name,
                    i.format AS ingredient_format,
                    sli.quantity,
                    sli.is_purchased
                FROM shopping_lists sl
                LEFT JOIN shopping_list_items sli ON sl.id = sli.shopping_list_id
                LEFT JOIN ingredients i ON sli.ingredient_id = i.id
                WHERE sl.created_by = $1
                ORDER BY sl.created_at DESC;
            `;
    
            const result = await pool.query(query, [userId]);
    
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'No shopping lists found for the user',
                };
            }
    
            return {
                success: true,
                message: 'Shopping lists retrieved successfully',
                data: result.rows,
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error retrieving shopping lists',
                errorCode: error.code || 'UNKNOWN_ERROR',
                data: error.detail || null,
            };
        }
    }

    static async addIngredientToShoppingList(ingredientToAdd:IngredientToShoppingListDto): Promise<ApiResponse> {
        try {
            const ingredientId = await IngredientServices.findOrCreateIngredient(ingredientToAdd.ingredient);
    
            const query = `
                INSERT INTO shopping_list_items (shopping_list_id, ingredient_id, quantity, is_purchased)
                VALUES ($1, $2, $3, $4)
                RETURNING id, shopping_list_id, ingredient_id;
            `;
            const result = await pool.query(query, [ingredientToAdd.shoppingListId, ingredientId, ingredientToAdd.quantity, false]);
    
            return {
                success: true,
                message: 'Ingredient added to shopping list successfully',
                data: result.rows[0],
            };
        } catch (error: any) {
            console.error('Error in addIngredientToShoppingList:', error);
            return {
                success: false,
                message: 'Error adding ingredient to shopping list',
                errorCode: error.code || 'UNKNOWN_ERROR',
            };
        }
    }
    static async toggleItemPurchasedStatus(itemId: number): Promise<boolean> {
        try {
            const query = `
                UPDATE shopping_list_items
                SET is_purchased = NOT is_purchased
                WHERE id = $1
                RETURNING is_purchased;
            `;
            const result = await pool.query(query, [itemId]);
    
            if (result.rowCount === 0) {
                throw new Error('Item not found');
            }
    
            return result.rows[0].is_purchased;
        } catch (error: any) {
            console.error('Error in toggleItemPurchasedStatus:', error);
            throw new Error('Error updating item status');
        }
    }
    
}