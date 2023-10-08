const mongoose = require('mongoose');

const categorySchema2 = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});


module.exports = mongoose.model("Category", categorySchema2);