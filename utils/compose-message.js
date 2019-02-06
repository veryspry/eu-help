const axios = require("axios");

const postMessage = async ({ channelID, message }) => {
  try {
    await axios({
      method: "post",
      url: `${process.env.SLACK_API_URL}/chat.postMessage`,
      headers: {
        Authorization: `Bearer ${process.env.SLACK_ACCESS_TOKEN}`,
        "Content-type": "application/json"
      },
      data: JSON.stringify(message)
    });
    return "Success";
  } catch (err) {
    console.log("error posting message", err);
    return err;
  }
};

module.exports = postMessage;
