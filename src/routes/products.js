const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const manager = new ProductManager();

router.get('/', async (req, res) => {
    const products = await manager.getAllProducts();
    res.json(products);
});

router.get('/:pid', async (req, res) => {
    const product = await manager.getProductById(req.params.pid);
    if (product) res.json(product);
    else res.status(404).send({ error: 'Product not found' });
});

router.post('/', async (req, res) => {
    const product = req.body;
    const newProduct = await manager.addProduct(product);
    res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
    const updatedProduct = await manager.updateProduct(req.params.pid, req.body);
    if (updatedProduct) res.json(updatedProduct);
    else res.status(404).send({ error: 'Product not found' });
});

router.delete('/:pid', async (req, res) => {
    await manager.deleteProduct(req.params.pid);
    res.sendStatus(204);
});

module.exports = router;
