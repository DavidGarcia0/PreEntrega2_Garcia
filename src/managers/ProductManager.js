const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor() {
        this.filePath = path.join(__dirname, '../data/products.json');
    }

    async getAllProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getAllProducts();
            return products.find(product => product.id === id) || null;
        } catch (error) {
            console.error(`Error al obtener el producto con ID ${id}:`, error);
            return null;
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getAllProducts();
            const newProduct = { id: String(Date.now()), ...product };
            products.push(newProduct);
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (error) {
            console.error('Error al agregar un producto:', error);
            return null;
        }
    }

    async updateProduct(id, updates) {
        try {
            const products = await this.getAllProducts();
            const productIndex = products.findIndex(p => p.id === id);
            if (productIndex === -1) return null;

            products[productIndex] = { ...products[productIndex], ...updates };
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return products[productIndex];
        } catch (error) {
            console.error(`Error al actualizar el producto con ID ${id}:`, error);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getAllProducts();
            const updatedProducts = products.filter(p => p.id !== id);
            await fs.writeFile(this.filePath, JSON.stringify(updatedProducts, null, 2));
            return true;
        } catch (error) {
            console.error(`Error al eliminar el producto con ID ${id}:`, error);
            return false;
        }
    }
}

module.exports = ProductManager;
