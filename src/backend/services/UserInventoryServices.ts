import pool from '../configuration/dataBaseConfig.js';
import { ApiResponse } from '../models/interfaces/ApiResponse.js';
import { UserInventory } from '../models/interfaces/UserInventory.js';

export class UserInventoryService {
    static async addIngredientToInventory(newingredientToInventory:UserInventory): Promise<ApiResponse> {
        try {
            const query = `
                INSERT INTO user_inventory (user_id, ingredient_id, quantity, expiry_date, is_available)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, ingredient_id, quantity, expiry_date, is_available;
            `;
            const result = await pool.query(query, [newingredientToInventory.user_id, newingredientToInventory.ingredient_id, newingredientToInventory.quantity, newingredientToInventory.expiry_date, newingredientToInventory.is_available]);
            return {
                success: true,
                message: 'Ingredient added to inventory successfully',
                data: result.rows[0],
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error adding ingredient to inventory',
                errorCode: error.code || 'UNKNOWN_ERROR',
            };
        }
    }

    static async getInventoryByUser(userId: number): Promise<ApiResponse> {
        try {
            const query = `
                SELECT ui.id, i.name, i.format, ui.quantity, ui.expiry_date, ui.is_available
                FROM user_inventory ui
                JOIN ingredients i ON ui.ingredient_id = i.id
                WHERE ui.user_id = $1;
            `;
            const result = await pool.query(query, [userId]);
            return {
                success: true,
                message: 'Inventory retrieved successfully',
                data: result.rows,
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error retrieving inventory',
                errorCode: error.code || 'UNKNOWN_ERROR',
            };
        }
    }
}