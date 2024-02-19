import { Request, Response, NextFunction } from 'express';
import { whitelist } from '../config/whitelistOrigins';

const credentials = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (origin && whitelist.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
};

export default credentials;
