import argon2 from 'argon2';

export class PasswordServices {
    
    static async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return await argon2.verify(hash, password);
    }

    static validatePasswordStrength(password: string): boolean {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[\W_]/.test(password);

        return (
            password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumber &&
            hasSpecialChar
        );
    }
}
