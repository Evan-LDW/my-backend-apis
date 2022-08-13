const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    exposedHeaders: "X-Auth-Token",
  })
);

app.use(routes);

app.use(function (err, req, res, next) {
  if (err.isBoom) {
    const { statusCode, payload } = err.output;

    res.status(statusCode).json(payload);

    return;
  }

  console.log(err);
  res.status(500).end();
});

module.exports = app;
