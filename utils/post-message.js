const axios = require("axios");

/**
 *
 * @param {object} messageDetails Takes a channelID to post to and a messageDetails object to send
 */
const postMessage = async messageDetails => {
  try {
    await axios({
      method: "post",
      url: `${process.env.SLACK_API_URL}/chat.postMessage`,
      headers: {
        Authorization: `Bearer ${process.env.SLACK_ACCESS_TOKEN}`,
        "Content-type": "application/json"
      },
      data: JSON.stringify(messageDetails)
    });
    return "Success";
  } catch (err) {
    console.log("error posting message", err);
    return err;
  }
};

/**
 * @param {str} description string with message description
 * @param {str} summary string with message summary
 */
const composeMessageOld = ({
  channelName,
  appURL,
  question,
  thingsTried,
  urgencyStatus,
  stepsTaken,
  username
}) => {
  let title = `@${username} has a question!`;

  if (urgencyStatus === "true") title = "@here " + title;

  const fields = [
    title,
    `*Channel*: ${channelName}`,
    `*App URL:* ${appURL}`,
    `*Question:* \n ${question}`,
    `*Steps Taken:* \n ${stepsTaken}`
  ];

  return htmlEncoder(fields.join("\n"));
};

const composeMessage = fields => htmlEncoder(fields.join("\n"));

// Slack requires some characters to be sent HTML encoded
const htmlEncoder = str =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

module.exports = { postMessage, composeMessage };
