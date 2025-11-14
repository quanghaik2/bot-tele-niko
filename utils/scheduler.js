const cron = require("node-cron");

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
};
