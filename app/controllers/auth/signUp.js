const Boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const users = require("../../db/users");

const signUp = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    // 422
    next(Boom.badData());

    return;
  }

  const result = users.findOne({
    email,
  });

  if (result) {
    // 409
    next(Boom.conflict());

    return;
  }

  // DB 里面不存明文密码
  bcrypt.hash(password, 10).then((hash) => {
    const user = users.insert({
      email,
      password: hash,
    });

    res.user = user;

    next();
  });
};

module.exports = signUp;
