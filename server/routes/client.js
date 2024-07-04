const express = require('express');
const { addClient, deleteClient, getAllClients, getClientById, updateClient } = require('../controllers/clientController');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/', authMiddleware, addClient);
router.delete('/:id', authMiddleware, deleteClient);
router.get('/', authMiddleware, getAllClients);
router.get('/:id', authMiddleware, getClientById);
router.put('/:id', authMiddleware, updateClient);

module.exports = router;
