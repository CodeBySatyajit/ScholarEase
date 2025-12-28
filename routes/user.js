const express = require("express");
const userShema = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const WrapAsync = require("../utils/WrapAsync.js");
const UserController = require("../controllers/user.js");
const { isLoggedIn, isNotLoggedIn } = require("../middleware/auth.js");

const router = express.Router();

// Validation middleware
const validateUser = (req, res, next) => {
    const { error } = userShema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// Auth Routes
router.route("/signup")
    .get(isNotLoggedIn, UserController.renderSignupForm)
    .post(validateUser, WrapAsync(UserController.signupUser));

router.route("/login")
    .get(isNotLoggedIn, UserController.renderLoginForm)
    .post(WrapAsync(UserController.loginUser));

router.post("/logout", UserController.logoutUser);

// Dashboard Routes (Protected)
router.get("/dashboard", isLoggedIn, UserController.renderDashboard);

router.route("/profile")
    .get(isLoggedIn, UserController.renderProfile)
    .post(isLoggedIn, UserController.updateProfile);

router.get("/saved-scholarships", isLoggedIn, UserController.renderSavedScholarships);

// Bookmark Routes
router.post("/bookmark/:scholarshipId", isLoggedIn, UserController.toggleBookmark);

// Applications Routes
router.post("/update-applications", isLoggedIn, UserController.updateApplicationsSubmitted);

module.exports = router;
