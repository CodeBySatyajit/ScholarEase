const User = require('../models/User');
const UserInfo = require('../models/UserInfo');

// Handle Google OAuth callback
module.exports.googleCallback = async (req, res) => {
  try {
    // User is authenticated and available in req.user
    const user = req.user;

    if (!user) {
      req.flash('error', 'Authentication failed. Please try again.');
      return res.redirect('/login');
    }

    // Ensure UserInfo exists for the user
    let userInfo = await UserInfo.findOne({ userID: user._id });
    if (!userInfo) {
      userInfo = new UserInfo({ userID: user._id });
      await userInfo.save();
    }

    // Create session data matching manual login format EXACTLY
    req.session.user = {
      id: user._id,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Email: user.Email,
      Mobile: user.Mobile || null
    };

    // Save session and redirect to dashboard (same as manual login)
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        req.flash('error', 'Failed to create session');
        return res.redirect('/login');
      }

      req.flash('success', `Welcome ${user.FirstName}! You have successfully logged in with Google.`);
      res.redirect('/dashboard');
    });
  } catch (err) {
    req.flash('error', 'An error occurred during Google login: ' + err.message);
    res.redirect('/login');
  }
};

// Link Google account to existing email account
module.exports.linkGoogleAccount = async (req, res) => {
  try {
    const user = req.user;
    const googleProfile = req.user; // This contains the Google profile

    // Update the current user with Google ID
    const currentUser = await User.findById(req.session.user.id);

    if (!currentUser) {
      req.flash('error', 'User session expired. Please log in again.');
      return res.redirect('/login');
    }

    // Check if Google ID is already linked to another account
    const existingGoogleUser = await User.findOne({ googleId: googleProfile.googleId });

    if (existingGoogleUser && existingGoogleUser._id.toString() !== currentUser._id.toString()) {
      req.flash('error', 'This Google account is already linked to another user account.');
      return res.redirect('/profile');
    }

    // Update current user with Google ID
    currentUser.googleId = googleProfile.googleId;
    if (!currentUser.profilePicture && googleProfile.profilePicture) {
      currentUser.profilePicture = googleProfile.profilePicture;
    }

    await currentUser.save();

    // Update session
    req.session.user.profilePicture = currentUser.profilePicture;
    req.session.user.googleId = currentUser.googleId;

    req.flash('success', 'Google account successfully linked to your profile!');

    res.redirect('/profile');
  } catch (err) {
    req.flash('error', 'Failed to link Google account');
    res.redirect('/profile');
  }
};

// Handle logout
module.exports.logout = (req, res) => {
  req.session.user = null;
  req.session.admin = null;

  req.session.save((err) => {
    if (err) {
      console.error('Session save error during logout:', err);
    }
    req.flash('success', 'You have been logged out successfully');
    res.redirect('/');
  });
};
