const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    scholarship : {
        type: String,
        required : true,
    },

    Amount : {
        type : Number,
        required : true,
    },

    About : {
        type : String,
        required : true,
    },

    Discription : {
        type : String,
        required : true,
    },

    Name : {
        type : String,
        required : true,
    },

    Author : {
        type: Schema.Types.ObjectId,
        ref: "User",
    }

});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;

