// Read .env file
require("dotenv").config();
// Packages
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const routes = require("./routes");
// variables
const port = 4000;

// Set up middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/../ui/build`));

app.use(routes);

// Default Routes
app.get("*", (req, res) => {
  res.status(404);
  res.send("404");
});

app.post("*", (req, res) => {
  res.status(404);
  res.send("404");
});

// Listen
app.listen(port, () => console.log(`Server is listening on port ${port}`));
