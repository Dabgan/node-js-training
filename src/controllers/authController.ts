import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/User';
import { Request, Response } from 'express';

export const handleLogin = async (req: Request, res: Response) => {
    const { user, pwd }: { user: string; pwd: string } = req.body;
    if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required' });

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.status(401).json({ message: 'Username or password is wrong' }); // Unauthorized
    try {
        const isAuthenticated = await bcrypt.compare(pwd, foundUser.password);
        if (isAuthenticated) {
            const roles = !foundUser.roles ? { User: 69 } : Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: foundUser.username,
                        roles,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET!,
                {
                    expiresIn: '30s',
                }
            );
            const refreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET!, {
                expiresIn: '1d',
            });

            foundUser.refreshToken = refreshToken;
            await foundUser.save();

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.json({ accessToken });
        } else {
            res.status(401).json({ message: 'Username or password is wrong' });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
