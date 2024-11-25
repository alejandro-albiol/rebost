import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT!);
        (req as any).user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: 'Invalid token.',
        });
    }
}
