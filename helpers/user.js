const User = require('../models/user.js');

module.exports = {
  getById: function getById(id) {
    try {
      return User.findById(id);  
    } catch (error) {
      console.log(`Helpers - User - getById() => ${error}`);
    }
  },
  // params must be an object
  // {
  //   id,
  //   user_name,
  //   ...
  // }
  getUser: function getUser(params) {
    try {
      return User.findOne(params);  
    } catch (error) {
      console.log(`Helpers - User - getUser() => ${error}`);
    }
  },
  getUsersById: function getUsers(params) {
    try {
      return User.find({
        $or: [
          {
            _id: '5fdade13a0879233e8f4dc93'
          },
          {
            _id: '60556427a72bdd4b20d8a59a'
          }
        ]
      });
    } catch (error) {
      console.log(`Helpers - User - getUsers() => ${error}`);
    }
  },
  createUser: function createUser(params) {
    try {
      // Creating empty user object 
      let newUser = new User(); 
      newUser.user_name = 'danielvvz2';
      newUser.name = 'daniel2';
      newUser.last_name = 'vargas2'
      // Call setPassword function to hash password
      newUser.setPassword('queso');
      // Save newUser object to database 
      return newUser.save();
    } catch (error) {
      console.log(`Helpers - User - createUser() => ${error}`);
    }
  },
  validatePassword: async function validatePassword(user_name, password) {
    try {
      var valid = false;
      await User.findOne({ user_name : user_name }, function(err, user) { 
        if (user === null) { 
            /*return res.status(400).send({ 
                message : "User not found."
            });*/
        } else { 
          valid = user.validPassword(password);
        } 
      });
      return valid;
    } catch (error) {
      console.log(`Helpers - User - validatePassword() => ${error}`);
    }
  }
}