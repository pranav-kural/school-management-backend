const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// let schemaStudent = new Schema({


const  schema = new mongoose.Schema({ 
  studentName: {
    type: String
  },
  studentID:{
    type: String,
    required : true
  },
  userType:{
    type: String,
    required : true
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  nic: {
    type: String
  }
});

const studentSchema =  mongoose.model("students",schema);
module.exports = studentSchema;
