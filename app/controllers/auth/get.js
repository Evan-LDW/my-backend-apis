const Boom = require("@hapi/boom");
const jwt = require("jsonwebtoken");
const users = require("../../db/users");
const { JWT_SECRET } = require("../../config");

const get = (req, res, next) => {
  // 1. 找到 headers 里面的 token
  const token = req.get("X-Auth-Token");

  // 2. 如果没有 token -> 404
  if (!token) {
    next(Boom.notFound());

    return;
  }

  try {
    // 3. 如果有 token 验证 token
    const requestUser = jwt.verify(token, JWT_SECRET);

    // 4. 如果 token 为空 -> 404
    if (!requestUser) {
      next(Boom.notFound());

      return;
    }

    // 5. 通过 token 的 user.id 到数据库找 user
    const user = users.findOne(requestUser.id);

    // 6. 如果用户不存在 -> 404
    if (!user) {
      next(Boom.notFound());

      return;
    }

    const newToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "5m" }
    );
    res.set("X-Auth-Token", newToken);

    const responseUser = {
      id: user.id,
      email: user.email,
    };

    res.status(200).json(responseUser);
  } catch (e) {
    // 7. 如果 token 过期 -> 401
    if (e.name === "TokenExpiredError") {
      next(Boom.unauthorized());

      return;
    }

    throw e;
  }
};

module.exports = get;
