import express from 'express';
import {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
} from '../../controllers/eployeesController';
import { ROLES_LIST } from '../../config/rolesList';
import verifyRoles from '../../middleware/verifyRoles';

const router = express.Router();

router
    .route('/')
    .get(getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), deleteEmployee);

router.route('/:id').get(getEmployeeById);

export default router;
