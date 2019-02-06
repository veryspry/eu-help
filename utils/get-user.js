const axios = require("axios");
const qs = require("qs");

const getUser = async id => {
  try {
    const {
      data: { user }
    } = await axios({
      method: "post",
      url: `${process.env.SLACK_API_URL}/users.info`,
      headers: {
        Authorization: `Bearer ${process.env.SLACK_ACCESS_TOKEN}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: qs.stringify({
        user: id
      })
    });
    return user;
  } catch (err) {
    return err;
  }
};

module.exports = getUser;
