var mongoose = require('mongoose')
var dbURL = 'mongodb+srv://kathirvelsandiego:Kathir99@cluster0.4vaa0ry.mongodb.net/?retryWrites=true&w=majority';
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io= require('socket.io')(http)
var cors = require('cors')

app.use(cors())
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    console.log("MongoDB connection : ", err)
})


var Product = mongoose.model('product', {
    "id": Number,
    "product": {
        "productid": Number,
        "category": String,
        "price": Number,
        "name": String,
        "instock": Boolean
    }
});


app.get('/product/get/', (req, res) => {
    Product.find({}, (err, products) => {
        let productsToDisplay = {};
        products.forEach((prod) => {            
            productsToDisplay[prod.id] = prod;
        })
        res.send(productsToDisplay)
    })
})

app.post('/product/create', (req, res) => {
    var product = new Product(req.body)
    product.save((err) => {
        if(err) {
            res.sendStatus(500)
        } else {
            res.sendStatus(200)
        }
    })
})


app.post('/product/update/:id', (req, res) => {
    Product.updateOne(req.params, req.body, (err, data) => {
        res.redirect('/product/get');        
    })
})

io.on('connection', (socket) => {
    console.log('a user is connected')
})


app.get('/product/delete/:id', (req, res) => {
    Product.deleteOne(req.params, (err, data) => {
        res.redirect('/product/get');        
    })  
})


var server = http.listen(3001, () => {
    console.log('Server is listening on port : ', server.address().port)
})

