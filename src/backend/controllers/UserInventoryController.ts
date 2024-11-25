import { Request, Response } from 'express';
import { UserInventoryService } from '../services/UserInventoryServices.js';
import { IngredientInInventoryDto } from '../models/dtos/IngredientInInventoryDto.js';

export class UserInventoryController {
    static async addIngredient(req: Request, res: Response) {
        const newIngredientToInventory:IngredientInInventoryDto = req.body;
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

    static async getInventory(req: Request, res: Response) {
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
