'use strict';
module.exports = function(app) {
  var user = require('../controllers/usercontroller');

  // todoList Routes
  app.route('/restful-api/v1/users')
    .get(user.list_all_users)
    .post(user.create_a_user);


  app.route('/restful-api/v1/users/:username')
    .get(user.read_a_user)
    .put(user.update_a_user)
    .delete(user.delete_a_user);
};
