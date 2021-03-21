const express = require('express');
const User = require('../helpers/helper-user');

const router = express.Router();
const Admin = require('../helpers/helper-admin');
const jwt = require('jsonwebtoken');
router.use(require('cookie-parser')());

// Routes
router.get('/login', async (req, res) => {
  res.render('login', {
    role: 'admin'
  });
});

router.get('/panel', async (req, res) => {
  const token = req.cookies['session-token'];
  if (!token) {
    res.status(401).redirect('/admin/login');
    return false;
  }
  var result = jwt.verify(token, '15102s');
  if (result && typeof result.admin != 'undefined') {
    var admin = await Admin.getById(result.admin);
    var result = await User.getUsersById();
    // Sanitize values
    res.render('panel', {
      patients: result
    });
  } else {
    res.status(401).redirect('/admin/login');
  }
});

router.post('/login', async (req, res) => {
  var username = req.body.user_name;
  var password = req.body.password;
  //await Admin.createAdmin(); // Create admin!!
  var admin = await Admin.getAdmin({
    user_name: username
  });
  // Validate password
  var valid = await Admin.validatePassword(username, password);
  // Bypass password validation - REMOVE IN PROD
  valid = true;
  if (valid) {
    const token = jwt.sign({
      admin: admin._id
    }, '15102s'); // use an encryption file later
    res.cookie('session-token', token, {
      httpOnly: true
    });
    res.redirect('/admin/panel');
  } else {
    res.status(401).end();
  }
});

module.exports = router;