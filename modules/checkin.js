const axios = require("axios");
require("dotenv").config();

module.exports = async () => {
  try {
    const response = await axios.post(
      "https://api.khennhau.com/niko/moods",
      {
        emotion: "good",
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
