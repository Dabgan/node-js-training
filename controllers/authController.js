const bcrypt = require('bcrypt');

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
            // create JWT
            return res.status(200).json({ success: `Logged in` });
        } else {
            return res.status(401).json({ message: 'Username or password is wrong' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { handleLogin };
