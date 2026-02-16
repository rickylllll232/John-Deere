const Product = require('../models/Product');

// Obtener todos
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear uno
exports.createProduct = async (req, res) => {
    const product = new Product({
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        stock: req.body.stock
    });

    try {
        const savedProduct = await product.save();
        res.json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Esto devuelve el objeto ya modificado
        );
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar
exports.deleteProduct = async (req, res) => {
    try {
        const removedProduct = await Product.findByIdAndDelete(req.params.id);
        res.json(removedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};