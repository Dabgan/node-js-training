import { Request, Response } from 'express';
import Employee from '../model/Employee';

export const getAllEmployees = async (req: Request, res: Response) => {
    const allUsers = await Employee.find({});
    if (!allUsers) return res.status(204).json({ message: 'No employees found' });
    res.json(allUsers);
};

export const createNewEmployee = async (req: Request, res: Response) => {
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ message: 'First and last name are required' });
    }

    try {
        const duplicate = await Employee.findOne({ firstname: req.body.firstname, lastname: req.body.lastname }).exec();
        if (duplicate) return res.status(409).json({ message: 'This username already exists' }); // Conflict

        const newEmployee = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        };

        await Employee.create(newEmployee);
        return res.status(201).json({ success: `New user ${newEmployee.firstname} created` });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export const updateEmployee = async (req: Request, res: Response) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: 'ID is required.' });
    }
    try {
        const foundEmployee = await Employee.findOne({ _id: req.body.id }).exec();
        if (!foundEmployee) {
            return res.status(204).json({ message: `No employee matched give id ${req.body.id}` });
        }
        if (req.body?.firstname) foundEmployee.firstname = req.body.firstname;
        if (req.body?.lastname) foundEmployee.lastname = req.body.lastname;

        await foundEmployee.save();

        return res.json(foundEmployee);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export const deleteEmployee = async (req: Request, res: Response) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: 'ID is required.' });
    }
    try {
        const foundEmployee = await Employee.findOne({ _id: req.body.id }).exec();
        if (!foundEmployee) {
            return res.status(204).json({ message: `No employee matched give id ${req.body.id}` });
        }

        await foundEmployee.deleteOne({ _id: req.body.id });

        const usersAfterDeletion = await Employee.find({});
        return res.json(usersAfterDeletion);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export const getEmployeeById = async (req: Request, res: Response) => {
    if (!req?.params?.id) {
        return res.status(400).json({ message: 'ID is required.' });
    }

    try {
        const foundEmployee = await Employee.findOne({ _id: req.params.id }).exec();
        if (!foundEmployee) {
            return res.status(204).json({ message: `No employee matched give id ${req.params.id}` });
        }

        return res.json(foundEmployee);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};
