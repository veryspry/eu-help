const express = require("express");
const router = express.Router();
const qs = require("qs");
const axios = require("axios");
const titleize = require("underscore.string/titleize");
const { postMessage, composeMessage } = require("../utils/post-message");
const getUser = require("../utils/get-user");

// Post route for slash command
router.post("/eu-help", (req, res) => {
  const { trigger_id, response_url, text, token, channel_id } = req.body;

  const dialog = {
    token: process.env.SLACK_ACCESS_TOKEN,
    trigger_id,
    response_url,
    dialog: JSON.stringify({
      callback_id: "help_request",
      title: "Submit a help request",
      submit_label: "Request",
      elements: [
        {
          label: "Summary",
          name: "summary",
          type: "text",
          hint: "30 second summary of the problem"
        },
        {
          label: "Description",
          name: "description",
          type: "textarea",
          hint: "A thorough description of the problem"
        }
      ]
    })
  };

  axios
    .post(`${process.env.SLACK_API_URL}/dialog.open`, qs.stringify(dialog))
    .then(data => {
      res.send("");
    })
    .catch(err => {
      res.send("Failed to open dialog:", err);
    });
});

// POST route for dialog submit
router.post("/help/submit", async (req, res) => {
  const {
    response_url,
    user: { id: userID },
    channel: { id: channelID },
    submission: { summary, description }
  } = JSON.parse(req.body.payload);
  // TODO: Implement error handling / user verification before sending back response of 200
  // Slack requires a response within 3 seconds or it discards the dialog submit process
  res.send("");

  let user;
  try {
    user = await getUser(userID);
  } catch (err) {
    console.log("error getting user", err);
  }

  const messageDetails = {
    token: process.env.REACT_ACCESS_TOKEN,
    channel: channelID,
    as_user: true,
    link_names: true,
    text: composeMessage({ summary, description })
  };

  postMessage(messageDetails);

  // TODO: Update formatting data that gets written to Google sheet
  const sheetData = {
    name: titleize(user.real_name),
    summary,
    description
  };

  axios
    .post(process.env.ZAPIER_WEBHOOK_URL, sheetData)
    .catch(err => console.log("Error POSTing to Zapier webhook", err));

  return;
});

// POST route for slack webhook
router.post("/google-sheets", (req, res) => {
  const { token, challenge, type } = req.body;
  res.send(challenge);

  axios
    .post(process.env.GOOGLE_SCRIPT_URL, {})
    .then(data => {
      res.send("success");
    })
    .catch(err => console.log("error running google scripts", err));
});

module.exports = router;
