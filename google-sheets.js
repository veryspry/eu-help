const fs = require("fs");
const readline = require("readline");
const http = require("http");
const url = require("url");
const { google } = require("googleapis");
const opn = require("opn");
const destroyer = require("server-destroy");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user's access and refresh tokens, and is created automatically when the authorization flow completes for the first time.
const TOKEN_PATH = ".google-token.json";
const GOOGLE_CREDENTIALS = ".google-credentials.json";

/**
 * @param {Object} options of form:
 *  { rows: { values: [["A4 - test", "B4 - test", "C4 - test"]] } }
 */

const writeToSheet = options => {
  // Load client secrets from a local file.
  fs.readFile(GOOGLE_CREDENTIALS, (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Sheets API.
    //   authorize(JSON.parse(content), readFromSheet, null);
    authorize(JSON.parse(content), write, options);
  });
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 * @param {Object} options Object of options to pass to the callback
 */
const authorize = (credentials, callback, options) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, options);
  });
  return;
};

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 * @param {Object} options Object of options to pass to the callback
 */

const getNewToken = (oAuth2Client, callback, options) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });

  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client, options);
    });
  });
  return;
};

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
const read = auth => {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: "Sheet1"
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const rows = res.data.values;
      if (rows.length) {
        console.log("Spreadsheet contents:");
        rows.map(row => {
          console.log(`${row}`);
        });
      } else {
        console.log("No data found.");
      }
    }
  );
  return;
};

const write = (auth, options) => {
  const sheets = google.sheets({ version: "v4", auth });
  const { rows } = options;
  sheets.spreadsheets.values.append(
    {
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: "Sheet1!B2",
      valueInputOption: "USER_ENTERED",
      includeValuesInResponse: true,
      insertDataOption: "INSERT_ROWS",
      resource: JSON.stringify(rows)
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      //   console.log(JSON.stringify(res, null, 2));
    }
  );
  return;
};

module.exports = { writeToSheet };
