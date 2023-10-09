const dotenv = require('dotenv')
dotenv.config();

const express = require('express');
const app = express();
app.use(express.json());


//for being able to access local storage of the laptop from the browser using the localhost thing instead of the actual full path name of the file

// const path = require('path');
// app.use("/images", express.static(path.join(__dirname, "/images")))


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL
).then(() => { console.log("connected to mongo") }).catch((err) => { console.log(err) });



// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "images")
//     },
//     filename: (req, file, cb) => {
//         cb(null, req.body.name)
//     }
// })

// const upload = multer({ storage: storage });

// app.post("/api/upload", upload.single("file"), async (req, res) => {
//     res.status(200).json("file uploaded")
// })


const { upload } = require('./middleware/multer')
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage')
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require("firebase/auth");
const { auth } = require('./config/firebase.config')


async function uploadImage(file, quantity) {

    const storageFB = getStorage();

    await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH)

    if (quantity === 'single') {
        const dateTime = Date.now();
        const fileName = `images/${dateTime}`
        const storageRef = ref(storageFB, fileName)
        const metadata = {
            contentType: file.type,
        }
        await uploadBytesResumable(storageRef, file.buffer, metadata);

        const downloadURL = await getDownloadURL(storageRef);


        // return fileName
        return { fileName, downloadURL };

    }

    if (quantity === 'multiple') {
        for (let i = 0; i < file.images.length; i++) {
            const dateTime = Date.now();
            const fileName = `images/${dateTime}`
            const storageRef = ref(storageFB, fileName)
            const metadata = {
                contentType: file.images[i].mimetype,
            }

            const saveImage = await Image``.create({ imageUrl: fileName });
            file.item.imageId.push({ _id: saveImage._id });
            await file.item.save();

            await uploadBytesResumable(storageRef, file.images[i].buffer, metadata);

        }
        return
    }

}


app.post('/api/upload', upload, async (req, res) => {
    const file = {
        type: req.file.mimetype,
        buffer: req.file.buffer
    }
    try {
        const obj = await uploadImage(file, 'single');
        res.status(200).send({
            status: "SUCCESS",
            imageName: obj.fileName,
            url: obj.downloadURL
        })
    } catch (err) {
        console.log(err);
    }
})


//routes----------------------------------

const authRoute = require('./routes/auth');
app.use("/api/auth", authRoute);

const usersRoute = require('./routes/users');
app.use("/api/users", usersRoute);

const postRoute = require('./routes/posts');
app.use("/api/posts", postRoute);

const catRoute = require('./routes/categories');
// const { db } = require('./models/User');
app.use("/api/categories", catRoute);


app.listen(4000, () => {
    console.log("listening on 4000");
})





