const router = require('express').Router();
const productController = require('../controllers/productController');
const verifyToken = require('../Middleware/authMiddleware');

// Rutas
router.get('/', productController.getAllProducts); // Pública (o ponle verifyToken si quieres)
router.post('/', verifyToken, productController.createProduct); // Privada
router.put('/:id', verifyToken, productController.updateProduct); // Privada
router.delete('/:id', verifyToken, productController.deleteProduct); // Privada

module.exports = router;