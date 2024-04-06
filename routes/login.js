const express = require('express');
const router = express.Router();
const LocalStrategy = require('passport-local').Strategy; // Import LocalStrategy from passport-local
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Configure passport to use LocalStrategy
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return done(err); // Handle error appropriately
      }
      if (!result) {
        return done(null, false, { message: 'Incorrect password' });
      }
      // Passwords match, proceed with authentication
      return done(null, user);
    });
  } catch (error) {
    console.error('Error during login:', error); // Log the error for debugging
    return done(error);
  }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    console.error('Error during deserialization:', error); // Log the error for debugging
    return done(error);
  }
});

// POST route for handling login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/memos',
  failureRedirect: '/',
  failureFlash: true
}));

// GET route for rendering login form
router.get('/login', function(req, res, next) {
  res.render('loginForm'); 
});

module.exports = router;
