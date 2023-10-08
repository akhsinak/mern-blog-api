const router = require('express').Router();
const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


//register

router.post("/register", async (req, res) => {

    try {


        const salt = await bcrypt.genSalt(10);
        const hashedpw = await bcrypt.hash(req.body.password, salt);

        const newuser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedpw
        })

        const result = await newuser.save();
        res.status(201).json(result);

    }
    catch (err) {
        res.status(500).json(err);
    }

});


//login

router.post("/login", async (req, res) => {
    //we have to login a user what will we do ?

    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(400).json("Wrong Credentials!");

        const ispass = await bcrypt.compare(req.body.password, user.password)
        !ispass && res.status(400).json("Wrong Credentials!");

        const { password, ...others } = user._doc;
        res.status(200).json(others);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;

