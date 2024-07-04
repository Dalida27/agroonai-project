const express = require('express');
const { addTransaction, deleteTransaction, getAllTransactions, getTransactionById, updateTransaction} = require('../controllers/transactionController');
const router = express.Router();
const  authMiddleware = require('../middlewares/auth-middleware')

router.post('/', authMiddleware, addTransaction);
router.delete('/:id', authMiddleware, deleteTransaction);
router.get('/', authMiddleware, getAllTransactions);
router.get('/:id', authMiddleware, getTransactionById,);
router.put('/:id', authMiddleware, updateTransaction);

module.exports = router;
