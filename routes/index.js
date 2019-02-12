const express = require("express");
const router = express.Router();
const qs = require("qs");
const axios = require("axios");
const dayjs = require("dayjs");
const titleize = require("underscore.string/titleize");
const { postMessage, composeMessage } = require("../utils/post-message");
const getUser = require("../utils/get-user");
const { dialogOneFields, dialogTwoFields } = require("../slack-utils/config");
const makeDialogRequest = require("../slack-utils/dialog-request");

// Post route for slash command
router.post("/help-request", (req, res) => {
  const { trigger_id, response_url, text, token, channel_id } = req.body;

  const dialogOne = {
    token: process.env.SLACK_ACCESS_TOKEN,
    trigger_id,
    response_url,
    dialog: JSON.stringify({
      callback_id: "help_request_section_1",
      title: "Submit a help request",
      submit_label: "Next",
      elements: dialogOneFields
    })
  };

  makeDialogRequest(dialogOne, res);
  res.send("");
});

// POST route to handle all interactive components
router.post("/interactive-components", async (req, res) => {
  console.log("BODY", req.body);
  console.log("PAYLOAD", req.body.payload);

  const {
    response_url,
    user: { id: userID, name: username },
    channel: { id: channelID },
    callback_id,
    submission,
    original_message,
    trigger_id,
    state
  } = JSON.parse(req.body.payload);

  // Handle the first dialog submit
  if (callback_id === "help_request_section_1") {
    const { channelName, appURL, adminURL, zendeskURL } = submission;

    console.log("SUBMISSION", submission);

    // success response required
    res.status(200);

    const fields = [
      `*App URL*: ${appURL || "None provided"}`,
      `*Admin URL:* ${adminURL || "None provided"}`,
      `*Zendesk URL:* ${zendeskURL || "None provided"}`
    ];

    const messageDetails = {
      token: process.env.REACT_ACCESS_TOKEN,
      channel: channelID,
      as_user: false,
      link_names: true,
      text: "Would you like to continue with your help request?",
      state: "TEST_STATE",
      attachments: [
        {
          text: "App URL:",
          callback_id: "app_url_text",
          attachment_type: "default"
        },
        {
          text: appURL || "None provided",
          callback_id: "app_url",
          attachment_type: "default"
        },
        {
          text: "Admin URL:",
          callback_id: "admin_url_text",
          attachment_type: "default"
        },
        {
          text: adminURL || "None provided",
          callback_id: "admin_url",
          attachment_type: "default"
        },
        {
          text: "Zendesk URL:",
          callback_id: "zendesk_url_text",
          attachment_type: "default"
        },
        {
          text: zendeskURL || "None provided",
          callback_id: "zendesk_url",
          attachment_type: "default"
        },
        {
          text: "",
          callback_id: "interactive_message_1",
          color: "#3AA3E3",
          attachment_type: "default",
          actions: [
            {
              name: "continue",
              text: "Continue",
              type: "button",
              value: "continue"
            },
            {
              name: "cancel",
              text: "Cancel",
              type: "button",
              value: "cancel"
            }
          ]
        }
      ]
    };
    postMessage(messageDetails);
  }

  // Handle first message submit
  if (callback_id === "interactive_message_1") {
    res.status(200);

    const filteredURLS = JSON.stringify(
      original_message.attachments.filter(
        ({ callback_id }) =>
          callback_id === "app_url" ||
          callback_id === "admin_url" ||
          callback_id === "zendesk_url"
      )
    );

    const dialogTwo = {
      token: process.env.SLACK_ACCESS_TOKEN,
      trigger_id: trigger_id,
      response_url: req.body.response_url,
      dialog: JSON.stringify({
        state: filteredURLS,
        callback_id: "help_request_section_2",
        title: "Submit a help request",
        submit_label: "Request",
        elements: dialogTwoFields
      })
    };
    makeDialogRequest(dialogTwo, res);
  }

  // Handle the second dialog
  if (callback_id === "help_request_section_2") {
    const {
      channelName,
      appURL,
      question,
      stepsTaken,
      urgencyStatus
    } = submission;

    res.status(200);

    const urlMap = {
      app_url: null,
      admin_url: null,
      zendesk_url: null
    };

    console.log("STATE", state);

    // Get URLS from first dialog
    JSON.parse(state).map(({ callback_id, text }) => {
      urlMap[callback_id] = text;
    });

    // Format and post message
    let title = `@${username} has a question!`;
    let isUrgent = false;

    if (urgencyStatus === "true") {
      title = "@here " + title;
      isUrgent = true;
    }

    const fields = [
      title,
      `*Channel*: ${channelName}`,
      `*App URL:* ${urlMap.app_url}`,
      `*Admin URL:* ${urlMap.admin_url}`,
      `*Zendesk URL:* ${urlMap.zendesk_url}`,
      `*Question:* \n ${question}`,
      `*Steps Taken:* \n ${stepsTaken}`
    ];

    const messageDetails = {
      token: process.env.REACT_ACCESS_TOKEN,
      channel: channelID,
      as_user: false,
      link_names: true,
      text: composeMessage(fields)
    };

    postMessage(messageDetails);

    // Look up user's real name
    let user;
    try {
      user = await getUser(userID);
    } catch (err) {
      console.log("error getting user", err);
    }

    // Data for Google Sheet
    const sheetData = {
      name: titleize(user.real_name),
      channelName,
      isUrgent,
      question,
      stepsTaken,
      appURL: urlMap.app_url,
      adminURL: urlMap.admin_url,
      zendeskURL: urlMap.zendesk_url,
      timestamp: dayjs(Date.now()).format("MM DD,YYYY")
    };

    // Write to Google Sheets
    axios
      .post(process.env.ZAPIER_WEBHOOK_URL, sheetData)
      .catch(err => console.log("Error POSTing to Zapier webhook", err));
  }

  // Send an empty message if all is well
  res.send("");
});

module.exports = router;
