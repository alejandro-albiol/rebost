import { Request, Response } from 'express';
import { IngredientServices } from '../services/IngredientServices.js';
import { Ingredient } from '../models/interfaces/Ingredient.js';

export class IngredientController {
    static async registerIngredient(req: Request, res: Response):Promise<void> {
        const ingredient:Ingredient = req.body;
        if (!ingredient.name || !ingredient.format) {
            res.status(400).json({
                success: false,
                message: 'name and format are required.',
            });
        }
        try {
            const response = await IngredientServices.createIngredient(ingredient);
            res.status(response.success ? 201 : 400).json(response);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error' });
        }
    }

    static async getAllIngredients(req: Request, res: Response):Promise<void> {
        try {
            const response = await IngredientServices.getAllIngredients();
            res.status(response.success ? 200 : 400).json(response);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error' });
        }
    }
}
