import pool from '../configuration/dataBaseConfig.js';
import { CreateIngredientDto } from '../models/dtos/CreateIngredientDto.js';
import { ApiResponse } from '../models/interfaces/ApiResponse.js';
import { Ingredient } from '../models/interfaces/Ingredient.js';
import { IngredientFormat } from '../models/interfaces/IngredientFormat.js';

export class IngredientService {
    static async createIngredient(newIngredient: CreateIngredientDto): Promise<ApiResponse> {
        try {;
            const query = `
                INSERT INTO ingredients (name, format)
                VALUES ($1, $2)
                RETURNING id, name, format;
            `;
            const result = await pool.query(query, [newIngredient.name, newIngredient.format]);
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
                SELECT *
                FROM ingredients;
            `;
            const result = await pool.query(query);
            return {
                success: true,
                message: 'Ingredients retrieved successfully',
                data: result,
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
