const axios = require("axios");
require("dotenv").config();

const emotions = ["good", "normal"];

module.exports = async (tokenNiko) => {
  try {
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

    const response = await axios.post(
      "https://api.khennhau.com/niko/moods",
      {
        emotion: randomEmotion,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenNiko}`,
        },
      }
    );

    console.log("Checkin thành công:", response.data);
    return res.status === 200;
  } catch (error) {
    console.error("Lỗi khi checkin:", error.response?.data || error.message);
    return null;
  }
};
