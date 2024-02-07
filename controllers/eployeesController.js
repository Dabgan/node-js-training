const fsPromises = require('fs').promises;
const path = require('path');

const data = {
    employees: require('../model/employees.json'),
    setEmployees: function (data) {
        this.employees = data;
    },
};

const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

const createNewEmployee = async (req, res) => {
    if (!req.body.firstname || !req.body.lastname) {
        return res.status(400).json({ message: 'First and last name are required' });
    }

    const newUser = {
        id: req.body.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    };
    const data = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'employees.json'), 'utf8');
    const newData = [...JSON.parse(data), newUser];
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'employees.json'), JSON.stringify(newData));

    res.status(201).json(newData);
};

const updateEmployee = async (req, res) => {
    const data = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'employees.json'), 'utf8');
    const userId = parseInt(req.body.id);
    const editedUsers = [...JSON.parse(data)].map((user) => {
        if (user.id === userId) {
            return {
                ...user,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
            };
        }
        return user;
    });
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'employees.json'), JSON.stringify(editedUsers));

    res.json(editedUsers);
};

const deleteEmployee = async (req, res) => {
    const data = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'employees.json'), 'utf8');
    const userId = parseInt(req.body.id);
    const filteredUsers = [...JSON.parse(data)].filter((user) => {
        return user.id !== userId;
    });

    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'employees.json'), JSON.stringify(filteredUsers));

    res.json(filteredUsers);
};

const getEmployeeById = (req, res) => {
    res.json({ id: req.params.id });
};

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
};
