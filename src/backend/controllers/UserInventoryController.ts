import { Request, Response } from 'express';
import { UserInventoryService } from '../services/UserInventoryServices.js';

export class UserInventoryController {
    static async addIngredient(req: Request, res: Response) {
        const newIngredientToInventory = req.body;
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
        const { userId } = req.params;
        try {
            const response = await UserInventoryService.getInventoryByUser(parseInt(userId, 10));
            res.status(response.success ? 200 : 404).json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
}
