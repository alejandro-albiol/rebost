import { Request, Response } from 'express';
import { IngredientService } from '../services/IngredientServices.js';

export class IngredientController {
    static async create(req: Request, res: Response) {
        const ingredient = req.body;
        try {
            const response = await IngredientService.createIngredient(ingredient);
            res.status(response.success ? 201 : 400).json(response);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const response = await IngredientService.getAllIngredients();
            res.status(response.success ? 200 : 400).json(response);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}
