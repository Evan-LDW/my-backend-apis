const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { signIn, signUp, get } = require("../controllers/auth");

const router = express.Router();

router.get("/", get);

const withResponse = (req, res) => {
  const user = {
    id: res.user.id,
    email: res.user.email,
  };

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "5m" });
  res.set("X-Auth-Token", token).status(200).json(user);
};

router.post("/sign-in", signIn, withResponse);
router.post("/sign-up", signUp, withResponse);

module.exports = router;
