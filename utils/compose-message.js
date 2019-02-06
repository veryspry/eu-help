const axios = require("axios");

const composeMessage = ({ channelID, message }) => {
  axios({
    method: "post",
    url: `${process.env.SLACK_API_URL}/chat.postMessage`,
    headers: {
      Authorization: `Bearer ${process.env.SLACK_ACCESS_TOKEN}`,
      "Content-type": "application/json"
    },
    data: JSON.stringify(message)
  })
    .then(data => {
      return "Success";
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

module.exports = composeMessage;
