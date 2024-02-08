const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');

require('dotenv').config();

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {
        this.users = data;
    },
};

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required' });
    // find user in DB
    const foundUser = usersDB.users.find((person) => person.username === user);
    if (!foundUser) return res.status(401).json({ message: 'Username or password is wrong' }); // Unauthorized
    try {
        // decrypt the password
        const isAuthenticated = await bcrypt.compare(pwd, foundUser.password);
        if (isAuthenticated) {
            const accessToken = jwt.sign({ username: foundUser.username }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '30s',
            });
            const refreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '1d',
            });
            // Saving refreshToken with current user
            const otherUsers = usersDB.users.filter((person) => person.username !== foundUser.username);
            const currentUser = { ...foundUser, refreshToken };
            usersDB.setUsers([...otherUsers, currentUser]);
            await fsPromises.writeFile(
                path.join(__dirname, '..', 'model', 'users.json'),
                JSON.stringify(usersDB.users)
            );
            // secure: false for thunder client testing
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.json({ accessToken });
        } else {
            res.status(401).json({ message: 'Username or password is wrong' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { handleLogin };
