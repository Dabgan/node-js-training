import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface DecodedUserInfo {
    UserInfo: {
        username: string;
        roles: string[];
    };
}

const verifyJWT = (req: Request & { user?: string; roles?: string[] }, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers['Authorization'];
    if (!authHeader && !authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
        if (err) return res.sendStatus(403);
        const decodedUserInfo = decoded as DecodedUserInfo;
        req.user = decodedUserInfo.UserInfo.username;
        req.roles = decodedUserInfo.UserInfo.roles;
        next();
    });
};

export default verifyJWT;
