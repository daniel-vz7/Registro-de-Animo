const express = require('express');

const router = express.Router();
const User = require('../helpers/helper-user');
const jwt = require('jsonwebtoken');
router.use(require('cookie-parser')());

// Routes
router.get('/login', async (req, res) => {
  res.render('login', {
    role: 'user'
  });
});

router.post('/login', async (req, res) => {
  var username = req.body.user_name;
  var password = req.body.password;
  var user = await User.getUser({
    user_name: username
  });
  // Validate password
  var valid = await User.validatePassword(username, password);
  // Bypass password validation - REMOVE IN PROD
  //valid = true;
  if (valid) {
    const token = jwt.sign({
      user: user._id
    }, '15102s'); // use an encryption file later
    res.cookie('session-token', token, {
      httpOnly: true
    });
    res.redirect('/log');
  } else {
    res.status(401).end();
  }
});

router.use('/logout', async (req, res) => {
  res.clearCookie('session-token');
  res.redirect('/');
});

module.exports = router;