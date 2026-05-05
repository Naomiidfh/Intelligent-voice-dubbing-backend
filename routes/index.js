import { Router } from 'express';
import tasksRouter from './tasks.js';
import ordersRouter from './orders.js';
import usersRouter from './users.js';
import helpRouter from './help.js';
import expensesRouter from './expenses.js';
import counselorsRouter from './counselors.js';

const router = Router();

router.use('/tasks', tasksRouter);
router.use('/orders', ordersRouter);
router.use('/users', usersRouter);
router.use('/help', helpRouter);
router.use('/expenses', expensesRouter);
router.use('/counselors', counselorsRouter);

export default router;
