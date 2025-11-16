const cron = require("node-cron");
const { getEmotionsByUserId } = require("./nikoData");

const AVAILABLE_TIMES = ["08:30", "14:00", "17:30"];
let currentSchedule = null;
let nextCheckinTime = null;

function getRandomCheckinTime() {
  const randomIndex = Math.floor(Math.random() * AVAILABLE_TIMES.length);
  return AVAILABLE_TIMES[randomIndex];
}

function scheduleNextCheckin(autoCheckinCallback) {
  if (currentSchedule) {
    currentSchedule.stop();
  }

  const nextTime = getRandomCheckinTime();
  const [hours, minutes] = nextTime.split(":");

  nextCheckinTime = nextTime;

  currentSchedule = cron.schedule(
    `${minutes} ${hours} * * *`,
    async () => {
      await autoCheckinCallback();
    },
    {
      timezone: "Asia/Ho_Chi_Minh",
    }
  );

  return nextTime;
}

function scheduleNotify(bot, idChat) {
  currentSchedule = cron.schedule(
    `05 17 * * *`,
    async () => {
      const emotion = await getEmotionsByUserId("3303");

      if (!emotion) {
        bot.telegram.sendMessage(idChat, `⚠️ Hôm nay bạn chưa niko`);
        return;
      } else {
        bot.telegram.sendMessage(
          idChat,
          `✅ Hôm nay bạn đã thực hiện niko thành công`
        );
        return;
      }
    },
    {
      timezone: "Asia/Ho_Chi_Minh",
    }
  );
}

function getNextCheckinTime() {
  return nextCheckinTime;
}

function getAvailableTimes() {
  return AVAILABLE_TIMES;
}

module.exports = {
  scheduleNextCheckin,
  getNextCheckinTime,
  getAvailableTimes,
  scheduleNotify,
};
