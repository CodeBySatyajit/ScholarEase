const Review = require("../models/review.js");
const WrapAsync = require("../utils/WrapAsync.js");

module.exports.renderReviewPage = WrapAsync(async (req, res) => {
    const reviews = await Review.find({});
    res.render("scholarships/reviews.ejs", { reviews });
});

module.exports.createReview = WrapAsync(async (req, res) => {
    const { scholarship, amount, about, description, name } = req.body;
    
    const newReview = new Review({
        scholarship,
        Amount: amount,
        About: about,
        Discription: description,
        Name: name,
        Author: req.session.user.id
    });

    await newReview.save();
    req.flash("success", "Thank you! Your review has been submitted successfully.");
    res.redirect("/reviews");
});
