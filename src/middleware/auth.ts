import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: string;
  role?: string;
}

const publicOperations = ['loginUser', '/'];
// , 'getAllUsers', 'logoutUser', 'getUser', 'updateUser'
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const operationName = req.body?.operationName;
    console.log("Operation name:", operationName);

    // Exempt public operations from authentication
    if (
        operationName && publicOperations.includes(operationName)
    ) {
        console.log(`Skipping ${operationName}: public operation or root path`);
        return next();
    }

    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ 
            message: 'Unauthorized',
            code: 401,
            error: 'UNAUTHORIZED'
        });
        return;
    }

    try {
        const payload = verifyToken(token) as { userId: string, role: string };
        req.user = payload.userId;
        req.role = payload.role;
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        res.status(401).json({ 
            message: 'Invalid Token',
            code: 401,
            error: 'INVALID TOKEN'
        });
        return;
    }
};
