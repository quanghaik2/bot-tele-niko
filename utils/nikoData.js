const { getMoodsByUserId } = require("../modules/checkNiko");

function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

const getEmotionsByUserId = async (user_id) => {
  try {
    const day = getCurrentDate();
    const emotions = await getMoodsByUserId(user_id);
    if (Object.keys(emotions[user_id]).includes(day)) {
      return emotions[user_id][day];
    }
    return null;
  } catch (error) {
    return null;
  }
};

module.exports = {
  getCurrentDate,
  getEmotionsByUserId,
};
