const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const {
    body,
    validationResult
} = require('express-validator');

const User = require('../models/User')

//Registration
router.post('/register', [
    body('name').isString(),
    body('email').isEmail(),
    body('password').isLength({
        min: 6
    })
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            message: "Invalid User Data",
            errors: errors.array()
        });
    }

    let user = await User.findOne({
        email: req.body.email
    }).exec();

    if (user) {
        return res.status(400).json({
            error: true,
            message: "User with that email already exists"
        });
    }

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then(user => res.status(203).json({
        error: false,
        message: "User Registered successfully",
        user
    }));

})

//Login
router.post('/login', [
    body('email').isEmail(),
    body('password').isString()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            message: "Invalid User Data",
            errors: errors.array()
        });
    }

    let user = await User.findOne({
        email: req.body.email
    }).exec();

    if (!user) {
        return res.status(404).json({
            error: true,
            message: "User doesn't exist"
        })
    } else {

        if (user.password === req.body.password) {
            jwt.sign({
                user
            }, 'elephant69', (err, token) => {

                if (err) {
                    return res.status(500).json({
                        error: true,
                        message: "System error, try again later"
                    })
                }

                return res.status(200).json({
                    error: false,
                    message: "User Logged Successfully",
                    token
                })
            });
        } else {

            return res.status(400).json({
                error: true,
                message: "Invalid user credentials"
            })
        }
    }


})

module.exports = router