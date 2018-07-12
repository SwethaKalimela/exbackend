const express = require("express");
const router = express.Router();
const mongoose = require('mongoose'); //importing this to use in line post
const assert = require('assert');
const multer = require("multer");
const upload = multer({ dest: 'uploads/'}); //this will initialize multer folder not accesed by public hence make it static

const Product = require('../models/products');

router.get('/', (req,res,next) => {
    res.sendFile(__dirname+'/index.html');
});

router.get('/', (req,res,next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then( docs => {
            const response = {
                count: docs.length,
                products: docs.map( doc => {
                    return {
                        name : doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/"+doc._id
                        }
                    }
                })
            };
//        if ( docs.length >= 0 ) {
            res.status(200).json(response); //change doc to response
//        } else {
//            res.status(404).json({
//                message: 'No entries Found'
//            });
//        }
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', upload.single('productImage'),(req,res,next) => { 
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name, //we have a body property when using body-parser to read req body
        price: req.body.price
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message : 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/"+result._id
                }
            }
            })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
    
});

router.get('/:productID', (req,res,next) => {
    const id = req.params.productID;
    Product.findById(id)
    .select('-__v')
    .exec()
    .then(doc => {
        console.log("From DB", doc);
        if (doc) {
            res.status(200).json({
            product: doc,
            message: "To get all products",
            request: {
                type: "GET",
                url: "http://localhost:3000/products"
            }
            });
        } else {
            res.status(404).json({message: "No valid entry found for the provided ID"});  
        }        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:productID', (req,res,next) => {
    const id = req.params.productID;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.update({_id: id} , { $set: updateOps})
           .exec()
           .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Product updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/"+id
                }
            });
           })
           .catch( err => {
               console.log(err);
               res.status(500).json({
                   error: err
               });
           });
});

router.delete('/:productID', (req,res,next) => {
    const id = req.params.productID;
    Product.findOneAndRemove({_id: id})
    .exec()
    .then( result => {
        console.log(result);
        res.status(200).json({
            message:"Product Deleted Successfully",
            request: {
                type:'POST',
                url: "http://localhost:3000",
                body: {name:'String',price:'Number'}
            }
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;