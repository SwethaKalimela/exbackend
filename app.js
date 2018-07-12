const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var path = require('path');




const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect(
   "mongodb+srv://node-shop:node-shop@node-rest-shop-t81qk.mongodb.net/test?retryWrites=true"
);

app.use(morgan('dev')); //using morgon to log events
app.use(bodyParser.urlencoded({extended: false})); //using body parser middleware to parse request body, false for simple text
app.use(bodyParser.json()); //to read json from body

//To prevent cors errors always set below headers
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*'); //can also give to only particular page but generally api use * to give access to all
    res.header('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept, Authorization"); //the mentioned requets can be accepted with the req
    if (req.method === 'OPTIONS'){ //the browser always sends options method first to check if it can establish a connection for particular http method
        res.header('Access-Control-Allow-Methods',"PUT, PATCH, DELETE, POST, GET");
        return res.status(200).json({});
    }
    next(); //to allow other incomming requests, without this you may block
});


//Routes which should handle requets
app.use('/products', productRoutes);     //sets the middleware
app.use('/orders', orderRoutes);
app.use('/user', userRoutes); 


app.get('/', (req,res,next) => {
    res.sendFile(path.join(__dirname+'/api/public/login.html'));
});

module.exports = app;