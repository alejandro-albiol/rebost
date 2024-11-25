import pool from '../configuration/dataBaseConfig.js';
import { ApiResponse } from '../models/interfaces/ApiResponse.js';
import { Ingredient } from '../models/interfaces/Ingredient.js';
import { IngredientFormat } from '../models/interfaces/IngredientFormat.js';

export class IngredientService {
    static async createIngredient(newIngredient: Ingredient): Promise<ApiResponse> {
        try {
            const format = `${newIngredient.format.value} ${newIngredient.format.unit}`;
            const query = `
                INSERT INTO ingredients (name, format)
                VALUES ($1, $2)
                RETURNING id, name, format;
            `;
            const result = await pool.query(query, [newIngredient.name, format]);
            return {
                success: true,
                message: 'Ingredient created successfully',
                data: result.rows[0],
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error creating ingredient',
                errorCode: error.code || 'UNKNOWN_ERROR',
                data: error.detail || null,
            };
        }
    }

    static async getAllIngredients(): Promise<ApiResponse> {
        try {
            const query = `
                SELECT id, name, format
                FROM ingredients;
            `;
            const result = await pool.query(query);
            const ingredients = result.rows.map(row => ({
                id: row.id,
                name: row.name,
                format: IngredientService.parseIngredientFormat(row.format),
            }));
            return {
                success: true,
                message: 'Ingredients retrieved successfully',
                data: ingredients,
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error retrieving ingredients',
                errorCode: error.code || 'UNKNOWN_ERROR',
            };
        }
    }

    private static parseIngredientFormat(format: string): IngredientFormat {
        const [value, unit] = format.split(' ');
        return { value: parseFloat(value), unit: unit as IngredientFormat['unit'] };
    }
}
