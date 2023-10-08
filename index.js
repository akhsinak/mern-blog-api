const dotenv = require('dotenv')
dotenv.config();

const multer = require('multer');

const express = require('express');
const app = express();
app.use(express.json());


//for being able to access local storage of the laptop from the browser using the localhost thing instead of the actual full path name of the file


const path = require('path');
app.use("/images", express.static(path.join(__dirname, "/images")))

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL
).then(() => { console.log("connected to mongo") }).catch((err) => { console.log(err) });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), async (req, res) => {
    res.status(200).json("file uploaded")
})

const authRoute = require('./routes/auth');
app.use("/api/auth", authRoute);

const usersRoute = require('./routes/users');
app.use("/api/users", usersRoute);

const postRoute = require('./routes/posts');
app.use("/api/posts", postRoute);

const catRoute = require('./routes/categories');
const { db } = require('./models/User');
app.use("/api/categories", catRoute);


app.listen(4000, () => {
    console.log("listening on 4000");
})





