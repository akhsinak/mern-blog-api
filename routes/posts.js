const router = require("express").Router();
const Post = require("../models/Post")

//create post
router.post("/", async (req, res) => {
    try {

        const newpost = new Post({
            title: req.body.title,
            desc: req.body.desc,
            username: req.body.username,
            categories: req.body.categories,
            photo: req.body.photo
        });

        const result = await newpost.save();
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

//update post
router.put("/:id", async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {

                const updatedpost = await Post.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                }, { new: true })

                const response = {
                    message: "post is updated",
                    updated_post: updatedpost
                }
                res.status(200).json(response);
            }
            catch (err) {
                res.status(500).json(err);
            }

        }
        else {
            res.status(400).json("you can update only ur posts");
        }

    }
    catch (err) {
        res.status(500).json(err);
    }


})


//delete post


router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(400).json("post doesnt exist");
        }

        if (post.username === req.body.username) {
            try {

                const deletedpost = await Post.findByIdAndDelete(req.params.id)

                const response = {
                    message: "post is deleted successfully",
                    deleted_post: deletedpost
                }
                res.status(200).json(response);
            }
            catch (err) {
                res.status(500).json(err);
            }
        }
        else {
            res.status(400).json("unauthorized to delete post");
        }

    }
    catch (err) {
        res.status(500).json(err);
    }
})


router.get("/:id", async (req, res) => {
    try {
        const findpost = await Post.findById(req.params.id);
        res.status(200).json(findpost);
    }
    catch (err) {
        res.status(500).json(err);
    }
});


router.get("/", async (req, res) => {

    const username = req.query.user;
    const catname = req.query.cat;

    try {

        let posts;
        if (username) {
            posts = await Post.find({ username: username });
        }
        else if (catname) {
            posts = await Post.find({
                categories: {
                    $in: [catname]
                }
            })
        }
        else {
            posts = await Post.find();

        }
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;

