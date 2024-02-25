import express from 'express'
import cartRouter from './routes/cartRouter.js'
import productsRouter from './routes/productsRouter.js'
import chatRouter from './routes/chatRouter.js'
import upload from './config/multer.js'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import { __dirname } from './path.js'


//Configuraciones o declaraciones
const app = express()
const PORT = 8000

//Server que trabaje con socket io

const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
const io = new Server(server)

//Middlewares
app.use(express.json())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

const mensajes = []
io.on('connection', (socket) => {
    console.log("Conexion con Socket.io")

    socket.on('mensaje', info => { //Cuando el cliente me envia un mensaje,
    //lo capturo y lo muestro
        console.log(info)
        mensajes.push(info)
        io.emit('mensajeLogs', mensajes)
    })
})

//Routes
app.use('/public', express.static(__dirname + '/public'))
app.use('/api/products', productsRouter, express.static(__dirname + '/public'))
app.use('/api/cart', cartRouter)
app.use('/api/chat', chatRouter, express.static(__dirname + '/public'))
app.post('/upload', upload.single('product'), (req, res) => {
    try {
        console.log(req.file)
        res.status(200).send("Imagen cargada correctamente")
    } catch (e) {
        res.status(500).send("Error al cargar imagen")
    }
})
/*
app.get('/static', (req,res) => {
    
        const prods = [
            {id:1, title: "Celular", price: 1500, img: "./img/img-6.png"},
            {id:2, title: "Televisor", price: 1800, img: "./img/img-11.png"},
            {id:3, title: "Tablet", price: 1200, img: "./img/img-11.png"},
            {id:4, title: "Notebook", price: 1900, img: "./img/img-11.png"}

        ]

        res.render('products', {
            mostrarProductos: true,
            productos: prods,
        css: 'product.css',
    })
}) */
