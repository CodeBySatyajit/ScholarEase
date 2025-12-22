// Authentication Middleware

// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in to access this page');
        return res.redirect('/login');
    }
    // Make user data available to all views
    res.locals.currentUser = req.session.user;
    next();
};

// Check if user is not logged in (for login/signup pages)
module.exports.isNotLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    next();
};

// Make current user available to all routes
module.exports.setCurrentUser = (req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
};
