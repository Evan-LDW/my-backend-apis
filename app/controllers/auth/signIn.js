const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const users = require('../../db/users');

const signIn = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    // 422
    next(Boom.badData());

    return;
  }

  const user = users.findOne({
    email,
  });

  console.log(user);

  if (!user) {
    // 404
    next(Boom.notFound());

    return;
  }
  
  bcrypt.compare(password, user.password)
    .then((match) => {
      if (!match) {
        // 404
        next (Boom.notFound());
        
        return;
      }

      res.user = user;

      next();
    });
};

module.exports = signIn;
