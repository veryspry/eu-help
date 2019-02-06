const express = require("express");
const router = express.Router();
const qs = require("qs");
const axios = require("axios");
const postMessage = require("../utils/compose-message");
const { writeToSheet } = require("../google-sheets");

router.get("/", (req, res) => {
  console.log("req:", req.body);
  res.send("testing...");
});

// Post route for slash command
router.post("/eu-help", (req, res) => {
  const { trigger_id, response_url, text, token, channel_id } = req.body;

  const dialog = {
    token: process.env.SLACK_ACCESS_TOKEN,
    trigger_id,
    response_url,
    dialog: JSON.stringify({
      callback_id: "ticket_submit",
      title: "Testing...",
      submit_label: "Request",
      elements: [
        {
          label: "Title",
          type: "text",
          name: "title",
          value: text,
          hint: "30 second summary of the problem"
        },
        {
          label: "Email Address",
          name: "email",
          type: "text",
          subtype: "email",
          placeholder: "you@example.com"
        }
      ]
    })
  };

  axios
    .post(`${process.env.SLACK_API_URL}/dialog.open`, qs.stringify(dialog))
    .then(data => {
      res.send("success");
    })
    .catch(err => {
      res.send("Failed to open dialog:", err);
    });
});

// POST route for dialog submit
router.post("/help/submit", (req, res) => {
  const {
    response_url,
    channel: { id: channelID },
    submission: { title, email }
  } = JSON.parse(req.body.payload);
  // TODO: Implement error handling / user verification before sending back response of 200
  res.send("");

  const message = {
    token: process.env.REACT_ACCESS_TOKEN,
    channel: channelID,
    as_user: true,
    link_names: true,
    text: title
  };

  const sheetOptions = {
    rows: {
      values: [[title, email]]
    }
  };

  postMessage({ channelID, message });
  writeToSheet(sheetOptions);
  return;
});

module.exports = router;
