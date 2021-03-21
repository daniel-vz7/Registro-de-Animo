const Admin = require('../models/model-admin.js');

module.exports = {
  getById: function getById(id) {
    try {
      return Admin.findById(id);  
    } catch (error) {
      console.log(`Helpers - Admin - getById() => ${error}`);
    }
  },
  getAdmin: function getAdmin(params) {
    try {
      return Admin.findOne(params);  
    } catch (error) {
      console.log(`Helpers - Admin - getAdmin() => ${error}`);
    }
  },
  createAdmin: function createAdmin(params) {
    try {
      // Creating empty admin object 
      let newAdmin = new Admin(); 
      newAdmin.user_name = 'elbric';
      newAdmin.name = 'Fernando';
      newAdmin.last_name = 'Briceño'
      // Call setPassword function to hash password
      newAdmin.setPassword('tortilla');
      // Save newAdmin object to database 
      return newAdmin.save();
    } catch (error) {
      console.log(`Helpers - Admin - createAdmin() => ${error}`);
    }
  },
  validatePassword: async function validatePassword(user_name, password) {
    try {
      var valid = false;
      await Admin.findOne({ user_name : user_name }, function(err, admin) { 
        if (admin === null) { 
            /*return res.status(400).send({ 
                message : "Admin not found."
            });*/
        } else { 
          valid = admin.validPassword(password);
        } 
      });
      return valid;
    } catch (error) {
      console.log(`Helpers - Admin - validatePassword() => ${error}`);
    }
  }
}