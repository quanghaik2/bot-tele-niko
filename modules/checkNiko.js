const axios = require("axios");
require("dotenv").config();
const nikoAccount = require("../data/accounts.json");

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

async function CheckNikoUsersByDate(date) {
  try {
    const response = await axios.get(
      `https://api.khennhau.com/niko/moods?start=${date}`,
      {
        headers: {
          Authorization: `Bearer ${nikoAccount[0].token}`,
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

// CheckNikoUsersByDate("2025-12-18");
module.exports = { getMoods, getMoodsByUserId, CheckNikoUsersByDate };
