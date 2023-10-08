const router = require("express").Router();
const User = require("../models/User");
const user = require("../models/User");
const bcrypt = require("bcrypt");

const Post = require("../models/Post")

//update user
router.put("/:id", async (req, res) => {

    if (req.body.userId === req.params.id) {

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true })

            res.status(200).send(updatedUser);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {

        res.status(401).json("you can update only ur account")
    }
})


//delete


router.delete("/:id", async (req, res) => {

    if (req.body.userId === req.params.id) {

        try {
            const user = User.findById(req.params.id);

            try {
                //delete all the posts of that user
                const result = await Post.deleteMany({ username: user.username });
                const finduser = await User.findById(req.params.id);
                if (!finduser) {
                    res.status(400).send("no such user");
                }
                //delete the user itself
                const deletedUser = await User.findByIdAndDelete(req.params.id);
                res.status(200).send("user has been deleted");
            }
            catch (err) {
                res.status(500).json(err);
            }
        }
        catch (err) {
            res.status(400).json("user not found");
        }

    }
    else {

        res.status(401).json("you can delete only ur account")
    }
})


//get the user

router.get("/:id", async (req, res) => {
    try {
        const finduser = await User.findById(req.params.id);
        const { password, ...others } = finduser._doc;
        res.status(200).json(others);
    }
    catch (err) {
        res.status(500).json(err);
    }   
})


router.get("/", async (req, res) => {
    try {
        const finduser = await User.find({},{ password: 0 });
        res.status(200).json(finduser);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;

