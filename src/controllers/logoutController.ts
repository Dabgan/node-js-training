import User from '../model/User';
import { Request, Response } from 'express';

export const handleLogout = async (req: Request, res: Response): Promise<Response> => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // Successful, No Content
    const refreshToken = cookies.jwt;

    // Is refresh token in DB?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        return res.sendStatus(204);
    }

    foundUser.refreshToken = '';
    await foundUser.save();

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    });
    return res.sendStatus(204);
};
