const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

router.post("/signup", (req,res,next) => {
    User.find({ email: req.body.email})
        .exec()
        .then( user => {
            if(user.length>=1) {
                console.log(user.length);
                console.log(user);
                return res.status(409).json({
                    message: "Mail Exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err,hash) => {
                    if(err) {
                        return res.status(500).json({
                            error:err
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then( result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User Created'
                                });
                            })
                            .catch( err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });

            }
        });  
});

router.delete("/:userID", (req,res,next) => {
    const id = req.params.userID;
    User.findOneAndRemove({_id:id})
        .exec()
        .then( result => {
            res.status(200).json({
                message: "User Deleted"
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