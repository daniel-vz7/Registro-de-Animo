const express = require('express');
const moment = require('moment');

const router = express.Router();
const Log = require('../helpers/helper-log');
const jwt = require('jsonwebtoken');
router.use(require('cookie-parser')());

// Validate session
router.use(function(req, res, next) {
  const token = req.cookies['session-token'];
  try {
    var result = jwt.verify(token, '15102s');
    if (result && typeof result.user != 'undefined') {
      console.log('ok');
      req.body.user_id = result.user;
      next();
    } else {
      res.status(503).send('NOT ok, youre admin')
    }
  } catch(err) {
    res.redirect('/user/login');
  }
});

// Display logs
router.get('/', async (req, res) => {
  var logs = await Log.getByDay(req.body.user_id, moment());
  // Clean properties
  logs = logs.map(function (params) {
    return {
      timestamp: params.timestamp,
      level: params.level
    }
  });
  res.render('index', {
    logs: logs
  });
});

// Display by date
router.get('/date', async (req, res) => {
  res.render('byDate');
});

router.post('/date', async (req, res) => {
  try {
    var date = req.body.date;
    var logs = await Log.getByDay(req.body.user_id, moment(date));
    logs = logs.map(function (params) {
      return {
        timestamp: params.timestamp,
        level: params.level
      }
    });
    if (logs.length) {
      res.status(200);
    } else {
      res.status(204);
    }
    res.json(logs);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post('/add', async (req, res) => {
  try {
    var response = await Log.addLog({
      time: req.body.time,
      level: req.body['animo-value'],
      user_id: req.body.user_id
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;