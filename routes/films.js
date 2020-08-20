const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const {
    body,
    validationResult
} = require('express-validator');

const Film = require('../models/Film')

router.get("/", verifyToken, async (req, res) => {

    const films = await Film.find({});

    res.json(films);


});

router.post("/", [
    body('name').isString(),
    body('rating').isNumeric()
], verifyToken, async (req, res) => {

    let film = await Film.findOne({
        name: req.body.name
    }).exec();

    if (film) {
        return res.status(400).json({
            error: true,
            message: "Woops! That film is already added"
        });
    }

    Film.create({
        name: req.body.name,
        rating: req.body.rating
    }).then(film => res.status(203).json({
        error: false,
        message: "Film Added successfully",
        film
    }));

});


function verifyToken(req, res, next) {

    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {

        const bearerToken = bearerHeader.split(' ')[1];

        jwt.verify(bearerToken, 'elephant69', (err, authData) => {

            if (err) {
                res.status(403).json({
                    error: false,
                    message: "You are not auhtenticated"
                });
            } else {
                next();
            }
        })

    } else {
        res.status(403).json({
            error: false,
            message: "You are not auhtenticated"
        })
    }
}

module.exports = router