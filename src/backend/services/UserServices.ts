import { ApiResponse } from '../models/interfaces/ApiResponse.js';
import { CreateUserDto } from '../models/dtos/CreateUserDto.js';
import pool from '../configuration/dataBaseConfig.js';
import { PasswordServices } from './PasswordServices.js';
import { AuthenticateUserDto } from '../models/dtos/AuthenticateUserDto.js';

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

    static async authenticateUser(userData: AuthenticateUserDto): Promise<ApiResponse> {
        try {
            const queryString = `
                SELECT id, username, email, password_hash
                FROM "users"
                WHERE username = $1;
            `;
    
            const result = await pool.query(queryString, [userData.username]);
    
            if (result.rowCount === 0) {
                return {
                    success: false,
                    message: 'User not found',
                };
            }
    
            const user = result.rows[0];
    
            const isPasswordValid = await PasswordServices.comparePassword(
                userData.password,
                user.password_hash
            );
    
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: 'Invalid password',
                };
            }
    
            return {
                success: true,
                message: 'User authenticated successfully',
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error authenticating user',
                errorCode: error.code || 'UNKNOWN_ERROR',
            };
        }
    }
    
}
