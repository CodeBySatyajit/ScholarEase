const express = require('express');
const passport = require('passport');
const AuthController = require('../controllers/auth');
const { isLoggedIn } = require('../middleware/auth');

const router = express.Router();

// Google OAuth routes
router.get('/auth/google',
  (req, res, next) => {
    // Check if Google credentials are configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Google credentials not configured!');
      req.flash('error', 'Google authentication is not configured. Please contact administrator.');
      return res.redirect('/login');
    }
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  (req, res, next) => {
    next();
  },
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureMessage: true,
    session: true
  }),
  AuthController.googleCallback
);

// Logout route
router.post('/logout', AuthController.logout);

// GET logout endpoint (for convenience)
router.get('/logout', AuthController.logout);

// Link Google account (optional future feature)
router.get('/auth/link-google', isLoggedIn,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/link-google/callback', isLoggedIn,
  passport.authenticate('google', {
    failureRedirect: '/profile',
    failureMessage: true
  }),
  AuthController.linkGoogleAccount
);

module.exports = router;
