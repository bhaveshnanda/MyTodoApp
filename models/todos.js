const mongoose = require("mongoose");

const todoschema = new mongoose.Schema({
    task : {
        type : String
    },
    description : {
        type : String
    },
    status : {
        type : String
    },
});

const todo = mongoose.model("Todos", todoschema);

module.exports = todo;