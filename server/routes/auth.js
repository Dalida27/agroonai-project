const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth-middleware');

require('dotenv').config();
const secretOrKey = process.env.JWT_SECRET;

// @route   POST api/v1/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        region: req.body.region
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   POST api/v1/users/login
// @desc    Login user and return JWT token
// @access  Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: 'User not found' });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id, name: user.name, region: user.region };

        jwt.sign(
            payload,
            secretOrKey,
            { expiresIn: 3600000 },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token,
                id: payload.id,
                name: payload.name,
                region: payload.region
              });
            }
        );
      } else {
        return res.status(400).json({ password: 'Password incorrect' });
      }
    });
  });
});

// @route   GET api/v1/users/me
// @desc    Return current user
// @access  Private
router.get('/me', authMiddleware, (req, res) => {
  console.log('got request')
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    region: req.user.region
  });
});

module.exports = router;
