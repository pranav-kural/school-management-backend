const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: {
        type: String
    },
    ID: {
        type: String,
        required: true
    },
    mail: {
        type: String
    },
    contactNumber: {
        type: Number
    },
    department: {
        type: String
    },
    title: {
        type: String
    },
    password: {
        type: String
    }
});

const teacherSchema = mongoose.model("teachers", schema);
module.exports = teacherSchema;

