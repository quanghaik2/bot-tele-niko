const axios = require("axios");
require("dotenv").config();

const emotions = ["good", "normal"];

module.exports = async () => {
  try {
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

    const response = await axios.post(
      "https://api.khennhau.com/niko/moods",
      {
        emotion: randomEmotion,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_NIKO}`,
        },
      }
    );

    console.log("Checkin thành công:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi checkin:", error.response?.data || error.message);
    return null;
  }
};
