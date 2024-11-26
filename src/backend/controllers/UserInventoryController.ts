import { Request, Response } from 'express';
import { UserInventoryService } from '../services/UserInventoryServices.js';
import { IngredientInInventoryDto } from '../models/dtos/IngredientInInventoryDto.js';

export class UserInventoryController {
    static async addIngredient(req: Request, res: Response):Promise<void> {
        const newIngredientToInventory:IngredientInInventoryDto = req.body;
        if (!newIngredientToInventory.user_id || !newIngredientToInventory.ingredient_id || !newIngredientToInventory.quantity) {
            res.status(400).json({
                success: false,
                message: 'user_id, ingredient_id, and quantity are required.',
            });
        }    
        try {
            const response = await UserInventoryService.addIngredientToInventory(newIngredientToInventory);
            res.status(response.success ? 201 : 400).json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    static async getInventory(req: Request, res: Response):Promise<void> {
        const userId  = parseInt(req.params.userId);
        try {
            const response = await UserInventoryService.getInventoryByUser(userId);
            res.status(response.success ? 200 : 404).json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
}
