import { Request, Response } from 'express';
import { UserServices } from '../services/UserServices.js';
import { CreateUserDto } from '../models/dtos/CreateUserDto.js';
import { ApiResponse } from '../models/interfaces/ApiResponse.js';

export class UserController {
    
    static async registerUser(req: Request, res: Response) {
        const newUser: CreateUserDto = req.body;
        try {
            const response: ApiResponse = await UserServices.createNewUser(newUser);
            if (response.success) {
                res.status(201).json(response);
            } else {
                res.status(400).json(response);
            }
        } catch (error: any) {
            const response: ApiResponse = {
                success: false,
                message: 'Internal server error',
                errorCode: error.code || 'INTERNAL_SERVER_ERROR',
            };
            res.status(500).json(response);
        }
    }
}
