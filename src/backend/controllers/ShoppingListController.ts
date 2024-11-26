import { Request, Response } from 'express';
import { ShoppingListServices } from '../services/ShoppingListServices.js';
import { Ingredient } from '../models/interfaces/Ingredient.js';
import { IngredientToShoppingListDto } from '../models/dtos/IngredientInShoppingListDto.js';

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
        const ingredientToAdd: IngredientToShoppingListDto = req.body
    
        if (!ingredientToAdd.ingredient) {
            res.status(400).json({
                success: false,
                message: 'Ingredient is required',
            });
            return;
        }
    
        try {
            const response = await ShoppingListServices.addIngredientToShoppingList(ingredientToAdd);
    
            res.status(response.success ? 201 : 400).json(response);
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    
    static async togglePurchased(req: Request, res: Response): Promise<void> {
        const itemId: number = parseInt(req.params.itemId);
    
        if (isNaN(itemId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid item ID',
            });
            return;
        }
    
        try {
            const isPurchased = await ShoppingListServices.toggleItemPurchasedStatus(itemId);
    
            res.status(200).json({
                success: true,
                message: `Item ${isPurchased ? 'marked as purchased' : 'marked as not purchased'}`,
                data: { isPurchased },
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || 'Internal server error',
            });
        }
    }
    
}
