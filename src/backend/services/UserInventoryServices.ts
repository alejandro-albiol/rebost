import pool from '../configuration/dataBaseConfig.js';
import { IngredientInInventoryDto } from '../models/dtos/IngredientInInventoryDto.js';
import { ApiResponse } from '../models/interfaces/ApiResponse.js';

export class UserInventoryService {
    static async addIngredientToInventory(newingredientToInventory:IngredientInInventoryDto): Promise<ApiResponse> {
        try {
            const query = `
                INSERT INTO user_inventory (user_id, ingredient_id, quantity, expiry_date, is_available)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, ingredient_id, quantity, expiry_date, is_available;
            `;
            const result = await pool.query(query, [
                newingredientToInventory.user_id, 
                newingredientToInventory.ingredient_id, 
                newingredientToInventory.quantity, 
                newingredientToInventory.expiry_date, 
                newingredientToInventory.is_available]);

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

    static async updateIngredientQuantity(ingredientData: IngredientInInventoryDto) {
        try {
            const query = `UPDATE user_inventory SET quantity = $1 WHERE id = $2`;
            await pool.query(query, [ingredientData.quantity, ingredientData.id]);
        } catch (error: any) {
            return {
                success: false,
                message: 'Error updating ingredient quantity',
                errorCode: error.code || 'UNKNOWN_ERROR',
            };
        }
    }

    static async addOrUpdateIngredientInInventory(ingredientData: IngredientInInventoryDto) {
        try {
            // Primero verificamos si el ingrediente ya existe para este usuario
            const existingInventory = await this.getInventoryByUser(ingredientData.user_id!);
            
            if (existingInventory.success && existingInventory.data) {
                const existingIngredient = existingInventory.data.find(
                    (item: any) => item.ingredient_id === ingredientData.ingredient_id
                );

                if (existingIngredient) {
                    // Actualizar cantidad existente
                    return await this.updateIngredientQuantity(ingredientData);
                }
            }
            
            // Si no existe, añadir nuevo
            return await this.addIngredientToInventory(ingredientData);
        } catch (error) {
            return {
                success: false,
                message: 'Error processing inventory operation',
                error: error
            };
        }
    }
}