import pool from '../configuration/dataBaseConfig.js';
import { CreateIngredientDto } from '../models/dtos/CreateIngredientDto.js';
import { ApiResponse } from '../models/interfaces/ApiResponse.js';
import { Ingredient } from '../models/interfaces/Ingredient.js';
import { IngredientFormat } from '../models/interfaces/IngredientFormat.js';

export class IngredientServices {
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

    static async findOrCreateIngredient(ingredientToAdd:Ingredient): Promise<number> {
        try {
            const query = `
                SELECT id 
                FROM ingredients 
                WHERE name = $1;
            `;
            const result = await pool.query(query, [ingredientToAdd.name]);
    
            if (result && result.rowCount && result.rowCount > 0) {
                return result.rows[0].id;
            } else {
                const insertIngredientQuery = `
                    INSERT INTO ingredients (name, format)
                    VALUES ($1, $2)
                    RETURNING id;
                `;
                const newIngredient = await pool.query(insertIngredientQuery, [ingredientToAdd.name, ingredientToAdd.format]);
                return newIngredient.rows[0].id;
            }
        } catch (error: any) {
            console.error('Error in findOrCreateIngredient:', error);
            throw new Error('Error finding or creating ingredient');
        }
    }
    
}
