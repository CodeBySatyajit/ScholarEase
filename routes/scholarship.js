const express = require("express");
const scholarships = require("../models/scholarship.js");
const ExpressError = require("../utils/ExpressError.js");
const WrapAsync = require("../utils/WrapAsync.js");
const ScholarshipController = require("../controllers/scholarship.js");

const router = express.Router();

// Only show scholarships - public route
router.route("/scholarships") 
    .get(ScholarshipController.renderScholarshipForm);

router.route("/")
    .get(WrapAsync(ScholarshipController.homePage));

module.exports = router;