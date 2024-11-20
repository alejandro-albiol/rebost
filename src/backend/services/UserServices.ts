import { ApiResponse } from '../models/interfaces/ApiResponse.js';
import { CreateUserDto } from '../models/dtos/CreateUserDto.js';
import pool from '../configuration/dataBaseConfig.js';
import { PasswordServices } from './PasswordServices.js';

export class UserServices {
    static async createNewUser(newUserData: CreateUserDto): Promise<ApiResponse> {
        try {
            if (!PasswordServices.validatePasswordStrength(newUserData.password)) {
                return {
                    success: false,
                    message: 'Password does not meet strength requirements',
                };
            }

            const hashedPassword = await PasswordServices.hashPassword(newUserData.password);

            const queryString = `
                INSERT INTO "users" (username, email, password_hash)
                VALUES ($1, $2, $3)
                RETURNING id, username, email;
            `;

            const result = await pool.query(queryString, [
                newUserData.username,
                newUserData.email,
                hashedPassword,
            ]);

            const createdUser = result.rows[0];
            return {
                success: true,
                message: 'User created successfully',
                data: createdUser,
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error creating user',
                errorCode: error.code || 'UNKNOWN_ERROR',
            };
        }
    }
}
