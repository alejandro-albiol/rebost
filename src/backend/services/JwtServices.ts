import jwt from 'jsonwebtoken';

export class JwtServices {
    static generateToken(payload: object): string {
        return jwt.sign(payload, process.env.SECRET_KEY_JWT!, { expiresIn: '1h' });
    }

    static verifyToken(token: string): object | string {
        return jwt.verify(token, process.env.SECRET_KEY_JWT!);
    }
}