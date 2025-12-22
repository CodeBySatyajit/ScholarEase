const express = require("express");
const ReviewController = require("../controllers/Reviews.js");
const WrapAsync = require("../utils/WrapAsync.js");

const router = express.Router();

const isUserLogin = (req, res, next) =>{
    if(!req.session.user){
        req.flash("error", "You Must be Login to submit the Stories");
        return res.redirect("/login");
    }

    next();
}

router.route("/reviews")
    .get( isUserLogin , ReviewController.renderReviewPage)
    .post(isUserLogin, ReviewController.createReview);


module.exports = router;
