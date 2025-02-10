const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');

const ProductManager = require('./managers/ProductManager');
const productManager = new ProductManager();

const app = express();
const server = createServer(app); // Servidor HTTP para socket.io
const io = new Server(server); // Servidor WebSocket

// Configurar Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para vistas
app.get('/', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('realTimeProducts', { products });
});

// WebSockets
io.on('connection', async (socket) => {
    console.log('Usuario conectado');

    // Enviar la lista de productos actualizada
    socket.emit('updateProducts', await productManager.getAllProducts());

    // Manejar la creación de un producto desde WebSockets
    socket.on('addProduct', async (productData) => {
        await productManager.addProduct(productData);
        io.emit('updateProducts', await productManager.getAllProducts()); // Emitir actualización a todos los clientes
    });

    // Manejar la eliminación de un producto
    socket.on('deleteProduct', async (productId) => {
        await productManager.deleteProduct(productId);
        io.emit('updateProducts', await productManager.getAllProducts());
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// Iniciar el servidor
server.listen(8080, () => {
    console.log('Servidor corriendo en http://localhost:8080');
});
