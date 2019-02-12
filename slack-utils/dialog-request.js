const qs = require("qs");
const axios = require("axios");

const makeDialogRequest = (dialogConfig, responseObject) => {
  axios
    .post(
      `${process.env.SLACK_API_URL}/dialog.open`,
      qs.stringify(dialogConfig)
    )
    .then(data => {
      //   console.log("DIALOG", data.data);
      return "success";
    })
    .catch(err => {
      //   responseObject.send(
      //     `Failed to open dialog: ${dialogConfig.dialog.callback_id}`,
      //     err
      //   );
      return "error";
    });
};

module.exports = makeDialogRequest;
