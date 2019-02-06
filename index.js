// Read .env file
require("dotenv").config();
// Packages
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const routes = require("./routes");
const { google } = require("googleapis");
// variables
const port = 4000;

var sheets = google.sheets("v4");

authorize(function(authClient) {
  var request = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: process.env.GOOGLE_API_KEY, // TODO: Update placeholder value.
    // The A1 notation of the values to retrieve.
    range: "Sheet1", // TODO: Update placeholder value.
    auth: authClient
  };

  sheets.spreadsheets.values.get(request, function(err, response) {
    if (err) {
      console.error(err);
      return;
    }

    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
  });
});

function authorize(callback) {
  // TODO: Change placeholder below to generate authentication credentials. See
  // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample
  //
  // Authorize using one of the following scopes:
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/drive.file'
  //   'https://www.googleapis.com/auth/drive.readonly'
  //   'https://www.googleapis.com/auth/spreadsheets'
  //   'https://www.googleapis.com/auth/spreadsheets.readonly'
  var authClient = null;

  if (authClient == null) {
    console.log("authentication failed");
    return;
  }
  callback(authClient);
}

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
