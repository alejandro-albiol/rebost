import { Request, Response } from 'express';
import { RecipeGeneratorServices } from '../services/RecipeGeneratorServices.js';

export class RecipeGeneratorController {
    static async generateRecipes(req: Request, res: Response): Promise<void> {
        const { ingredients } = req.body;

        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Se requiere un array de ingredientes no vacío',
            });
            return;
        }

        try {
            const chatCompletion = await RecipeGeneratorServices.getGroqChatCompletion(ingredients.join(', '));
            const rawJson = chatCompletion.choices[0]?.message?.content || "";

            try {
                const recipes = JSON.parse(rawJson);
                res.status(200).json({
                    success: true,
                    message: 'Recetas generadas exitosamente',
                    data: recipes
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Error al procesar las recetas generadas',
                    error: error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al generar recetas',
                error: error
            });
        }
    }
}
