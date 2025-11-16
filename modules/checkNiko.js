const axios = require("axios");
require("dotenv").config();

async function getMoods() {
  try {
    const response = await axios.get("https://api.khennhau.com/niko/moods", {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN_NIKO}`,
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu moods: ", error);
    return null;
  }
}

async function getMoodsByUserId(userId) {
  try {
    const response = await axios.get(
      `https://api.khennhau.com/niko/moods?user_id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_NIKO}`,
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu moods: ", error);
    return null;
  }
}

module.exports = { getMoods, getMoodsByUserId };
