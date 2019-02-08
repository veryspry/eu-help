// Read .env file
require("dotenv").config();
// Packages
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes");

// variables
const port = process.env.PORT || 4000;

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Main Routes
app.use(routes);

// Default Routes / Error Handling
app.get("*", (req, res) => {
  res.status(404);
  res.send("404");
});

app.post("*", (req, res) => {
  res.status(404);
  res.send("404");
});

// Server
app.listen(process.env.PORT || port, () =>
  console.log(`Server is listening on port ${port}`)
);
