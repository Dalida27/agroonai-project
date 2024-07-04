const express = require('express');
const { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct} = require('../controllers/productController');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const getRagChain = require('./../utils/ragChain');

router.post('/', authMiddleware, addProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.get('/', authMiddleware, getAllProducts);
router.get('/:id', authMiddleware, getProductById);
router.put('/:id', authMiddleware, updateProduct);
router.get('/recommend-price/:productTitle', async (req, res) => {
  try {
    const productTitle = req.params.productTitle;
    console.log(productTitle);
    const recommendedPrice = await getRagChain(productTitle);
    console.log(recommendedPrice);
    res.json({ recommendedPrice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
