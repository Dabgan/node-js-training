const express = require('express');
const router = express.Router();
const path = require('path');
const fsPromises = require('fs').promises;

const data = {};
data.employees = require('../../data/employees.json');

router
    .route('/')
    .get((req, res) => {
        res.json(data.employees);
    })
    .post(async (req, res) => {
        const newUser = {
            id: req.body.id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        };
        const data = await fsPromises.readFile(path.join(__dirname, '..', '..', 'data', 'employees.json'), 'utf8');
        const newData = [...JSON.parse(data), newUser];
        await fsPromises.writeFile(path.join(__dirname, '..', '..', 'data', 'employees.json'), JSON.stringify(newData));

        res.json(newData);
    })
    .put(async (req, res) => {
        const data = await fsPromises.readFile(path.join(__dirname, '..', '..', 'data', 'employees.json'), 'utf8');
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
        await fsPromises.writeFile(
            path.join(__dirname, '..', '..', 'data', 'employees.json'),
            JSON.stringify(editedUsers)
        );

        res.json(editedUsers);
    })
    .delete(async (req, res) => {
        const data = await fsPromises.readFile(path.join(__dirname, '..', '..', 'data', 'employees.json'), 'utf8');
        const userId = parseInt(req.body.id);
        const filteredUsers = [...JSON.parse(data)].filter((user) => {
            return user.id !== userId;
        });

        await fsPromises.writeFile(
            path.join(__dirname, '..', '..', 'data', 'employees.json'),
            JSON.stringify(filteredUsers)
        );

        res.json(filteredUsers);
    });

router.route('/:id').get((req, res) => {
    res.json({ id: req.params.id });
});

module.exports = router;
