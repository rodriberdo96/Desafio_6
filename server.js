//importaciones
const express = require('express')
const  Contenedor  = require('./Api/Contenedor.js')
const {Server : HttpServer} = require('http')
const {Server : IOServer} = require('socket.io')

//instancias
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)


//config puerto
const PORT = 8080

//middleware 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname +'/public'))
const productos = new Contenedor('productos.json')
app.set ('view engine', 'ejs')
app.set('views', './public/views')

const messages= [];

// Socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!')
    //productos
    io.sockets.emit('productos', productos.getAll())
    socket.on('update',  (nuevoProducto) => {
        productos.save(nuevoProducto)
        io.sockets.emit('productos', productos.getAll())
    })

    //mensajes
    socket.emit('messages', messages)
    socket.on('new-message', (nuevoMensaje) => {
        messages.push(nuevoMensaje)
        io.sockets.emit('messages', messages)
    })
})

//rutas
app.get('/', (req,res) => {
    res.render('pages/index', {productos})
})

app.get('/productosC.ejs',  (req,res) => {
    productos.getAll().then((productos) => {
        res.render('pages/productosC', {productos})
    })  

})

app.post ('/productos', async (req,res) => {
    const {title,price,thumbnail} = req.body
    const producto = {title,price,thumbnail}
    const id = await productos.save(producto)
    res.render('pages/index', {productos})
})

app.post('productosC.ejs', async (req,res) => {
    const {title,price,thumbnail} = req.body
    const producto = {title,price,thumbnail}
    const id = await productos.save(producto)
    res.redirect('/productosC.ejs')
})





// Levantar el servidor en el puerto indicado
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto: http://localhost:${PORT}`);
});

server.on("error", error => console.log(`Error en servidor ${error}`));
