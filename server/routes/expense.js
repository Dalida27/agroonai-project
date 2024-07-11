const express = require('express');
const { addExpense, deleteExpense, getAllExpenses, getExpenseById, updateExpense } = require('../controllers/expenseController.js');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware.js');

router.post('/', authMiddleware, addExpense);
router.delete('/:id', authMiddleware, deleteExpense);
router.get('/', authMiddleware, getAllExpenses);
router.get('/:id', authMiddleware, getExpenseById);
router.put('/:id', authMiddleware, updateExpense);

module.exports = router;
