import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../model/User';

export const handleNewUser = async (req: Request, res: Response) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required' });

    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.status(409).json({ message: 'This username already exists' }); // Conflict
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        await User.create({
            username: user,
            password: hashedPwd,
        });
        res.status(201).json({ success: `New user ${user} created` });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
