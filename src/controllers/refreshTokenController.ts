import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/User';

export const handleRefreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); // Forbidden

    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, decoded: any) => {
        if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
        const roles = !foundUser.roles ? { User: 69 } : Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            { UserInfo: { username: foundUser.username, roles } },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: '30s' }
        );

        res.json({ accessToken });
    });
};
