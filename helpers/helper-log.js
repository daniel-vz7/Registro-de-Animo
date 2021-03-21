const Log = require('../models/model-log.js');

module.exports = {
  getByDay: function getByDay(userId, date) {
    try {
      var dayStart = date.startOf('day').toDate();
      var dayEnd = date.endOf('day').toDate();
      return Log.find({
        timestamp: {
          $gte: dayStart,
          $lt: dayEnd
        },
        user_id: userId
      });  
    } catch (error) {
      console.log(`Helpers - Log - getByDay() => ${error}`);
    }
  },
  addLog: function (obj) {
    try {
      const newLog = new Log({
        timestamp: obj.time,
        level: obj.level,
        user_id: obj.user_id
      });
      newLog.save(function (err, doc) {
        if (err) return false;
        else return doc;
      });
    } catch (error) {
      console.log(`Helpers - Log - addLog() => ${error}`);
    }
  }
}