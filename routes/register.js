const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');
const passport = require('passport');

// Route handler for GET /signup endpoint to render the signup form
router.get('/signup', function(req, res) {
    res.render('signupForm');
});

// Route handler for POST /signup endpoint to handle user registration
router.post('/signup', async function(req, res, next) {
    try {
        // Generate a random salt for password hashing
        const salt = crypto.randomBytes(16).toString('hex');
        // Hash the password with the generated salt
        const hashedPassword = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex');

        // Create a new user record in the database
        const newUser = await User.create({
            username: req.body.username,
            password: hashedPassword,
            salt: salt
        });

        // Log in the newly created user
        req.login(newUser, function(err) {
            if (err) {
                return next(err);
            }
            // Redirect to the memo page after successful registration and login
            return res.redirect('/memos');
        });
    } catch (error) {
        
        console.log(error)
      
        return res.redirect('/');
    }
});

module.exports = router;
