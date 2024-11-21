import { Request, Response } from 'express';
import { UserServices } from '../services/UserServices.js';
import { CreateUserDto } from '../models/dtos/CreateUserDto.js';
import { AuthenticateUserDto } from '../models/dtos/AuthenticateUserDto.js';
import { ApiResponse } from '../models/interfaces/ApiResponse.js';

export class UserController {
    static async registerUser(req: Request, res: Response): Promise<void> {
        const newUser: CreateUserDto = req.body;

        if (!newUser.username || !newUser.email || !newUser.password) {
            res.status(400).json({
                success: false,
                message: 'All fields (username, email, password) are required.',
            });
            return; // Asegura que no se sigue ejecutando el código
        }

        try {
            const response: ApiResponse = await UserServices.createNewUser(newUser);
            if (response.success) {
                res.status(201).json(response);
            } else {
                res.status(400).json(response);
            }
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                errorCode: error.code || 'INTERNAL_SERVER_ERROR',
            });
        }
    }

    static async loginUser(req: Request, res: Response): Promise<void> {
        const loginData: AuthenticateUserDto = req.body;

        if (!loginData.username || !loginData.password) {
            res.status(400).json({
                success: false,
                message: 'Username and password are required.',
            });
            return; // Asegura que no se sigue ejecutando el código
        }

        try {
            const response: ApiResponse = await UserServices.authenticateUser(loginData);
            if (response.success) {
                res.status(200).json(response); // Autenticación exitosa
            } else {
                res.status(401).json(response); // Credenciales incorrectas
            }
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                errorCode: error.code || 'INTERNAL_SERVER_ERROR',
            });
        }
    }
}
