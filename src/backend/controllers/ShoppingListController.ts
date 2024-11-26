import { Request, Response } from 'express';
import { ShoppingListServices } from '../services/ShoppingListServices.js';
import { Ingredient } from '../models/interfaces/Ingredient.js';

export class ShoppingListController {
    static async createShoppingList(req: Request, res: Response):Promise<void> {
        const newShoppingList = req.body;

        if (!newShoppingList.name || !newShoppingList.created_by) {
            res.status(400).json({
                success: false,
                message: 'name and created_by are required.',
            });
        }

        try {
            const response = await ShoppingListServices.createShoppingList(newShoppingList);
            res.status(response.success ? 201 : 400).json(response);
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                errorCode: error.code || 'UNKNOWN_ERROR',
            });
        }
    }

    static async getShoppingLists(req: Request, res: Response):Promise<void> {
        const userId = parseInt(req.params.userId);

        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'userId is required in params.',
            });
        }

        try {
            const response = await ShoppingListServices.getShoppingListByUserId(userId);
            res.status(response.success ? 200 : 404).json(response);
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                errorCode: error.code || 'UNKNOWN_ERROR',
            });
        }
    }

    static async addIngredient(req: Request, res: Response): Promise<void> {
        const { shoppingListId } = req.params;
        const ingredient:Ingredient = req.body;
        const quantity = req.body.quantity
    
        if (!ingredient.name) {
            res.status(400).json({
                success: false,
                message: 'Ingredient name is required',
            });
            return;
        }
    
        try {
            const response = await ShoppingListServices.addIngredientToShoppingList(
                parseInt(shoppingListId),
                ingredient,
                quantity
            );
    
            res.status(response.success ? 201 : 400).json(response);
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    
}
