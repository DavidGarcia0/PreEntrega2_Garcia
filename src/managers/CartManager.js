const fs = require('fs').promises;
const path = require('path');

class CartManager {
    constructor() {
        this.filePath = path.join(__dirname, '../data/carts.json');
    }

    async getAllCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            return [];
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getAllCarts();
            return carts.find(cart => cart.id === id) || null;
        } catch (error) {
            console.error(`Error al obtener el carrito con ID ${id}:`, error);
            return null;
        }
    }

    async createCart() {
        try {
            const carts = await this.getAllCarts();
            const newCart = { id: String(Date.now()), products: [] };
            carts.push(newCart);
            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            return newCart;
        } catch (error) {
            console.error('Error al crear un carrito:', error);
            return null;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getAllCarts();
            const cart = carts.find(c => c.id === cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(p => p.product === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            return cart;
        } catch (error) {
            console.error(`Error al agregar el producto ${productId} al carrito ${cartId}:`, error);
            return null;
        }
    }
}

module.exports = CartManager;
