const router = require('express').Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Category = require("../models/Category");

router.post("/", async (req, res) => {
    try {
        const newcat = new Category({
            name: req.body.name
        });

        const result = await newcat.save();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).json(err);
    }


})

router.get("/", async (req, res) => {
    try {

        const result = await Category.find();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).json(err);
    }


})

module.exports = router