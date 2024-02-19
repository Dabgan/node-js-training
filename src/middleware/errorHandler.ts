import { Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';
import { logEvents } from './logEvents';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack);
    res.status(500).send(err.message);
    next();
};

export default errorHandler;
