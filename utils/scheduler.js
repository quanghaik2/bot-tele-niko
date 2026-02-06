const cron = require("node-cron");
const { getEmotionsByUserId } = require("./nikoData");
const { CheckNikoUsersByDate } = require("../modules/checkNiko");
const nikoAccount = require("../data/accounts.json");

const AVAILABLE_TIMES = ["06:00", "07:00"];
let checkinSchedule = null;
let nextCheckinTime = null;
let notifySchedule = null;

function getRandomCheckinTime() {
  const randomIndex = Math.floor(Math.random() * AVAILABLE_TIMES.length);
  return AVAILABLE_TIMES[randomIndex];
}

function scheduleNextCheckin(autoCheckinCallback) {
  if (checkinSchedule) {
    checkinSchedule.stop();
  }

  const nextTime = getRandomCheckinTime();
  const [hours, minutes] = nextTime.split(":");

  nextCheckinTime = nextTime;

  checkinSchedule = cron.schedule(
    `${minutes} ${hours} * * 1-6`,
    async () => {
      await autoCheckinCallback();
    },
    {
      timezone: "Asia/Ho_Chi_Minh",
    },
  );

  return nextTime;
}

// function scheduleNotify(bot, idChat) {
//   currentSchedule = cron.schedule(
//     `05 17 * * *`,
//     async () => {
//       const emotion = await getEmotionsByUserId("3303");

//       if (!emotion) {
//         bot.telegram.sendMessage(idChat, `⚠️ Hôm nay bạn chưa niko`);
//         return;
//       } else {
//         bot.telegram.sendMessage(
//           idChat,
//           `✅ Hôm nay bạn đã thực hiện niko thành công`
//         );
//         return;
//       }
//     },
//     {
//       timezone: "Asia/Ho_Chi_Minh",
//     }
//   );
// }

function scheduleNotify(bot, idChat) {
  if (notifySchedule) {
    notifySchedule.stop();
  }

  notifySchedule = cron.schedule(
    "00 08 * * *",
    async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const checking = await CheckNikoUsersByDate(today);

        let notify = "";
        for (const account of nikoAccount) {
          if (
            checking[account.id] != null ||
            checking[account.id] != undefined
          ) {
            notify += `${account.fullname} đã niko ngày hôm nay\n`;
          }
        }

        bot.telegram.sendMessage(idChat, `Checkin hôm nay:\n${notify}`);
      } catch (err) {
        console.error(err);
        bot.telegram.sendMessage(
          idChat,
          "❌ Đã xảy ra lỗi khi kiểm tra emotion.",
        );
      }
    },
    {
      timezone: "Asia/Ho_Chi_Minh",
    },
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
