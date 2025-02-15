const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const manager = new CartManager();

router.post('/', async (req, res) => {
    const newCart = await manager.createCart();
    res.status(201).json(newCart);
});

router.get('/', async (req, res) => {
    const carts = await manager.getAllCarts();
    res.json(carts);
});

router.get('/:cid', async (req, res) => {
    const cart = await manager.getCartById(req.params.cid);
    if (cart) res.json(cart);
    else res.status(404).send({ error: 'Cart not found' });
});

router.post('/:cid/product/:pid', async (req, res) => {
    const updatedCart = await manager.addProductToCart(req.params.cid, req.params.pid);
    if (updatedCart) res.json(updatedCart);
    else res.status(404).send({ error: 'Cart not found' });
});

module.exports = router;
