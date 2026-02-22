const { Telegraf } = require("telegraf");
require("dotenv").config();

// Import server và utils
require("./server.js");
const scheduler = require("./utils/scheduler");
const pingUtils = require("./utils/pingServer");
const nikoAccount = require("./data/accounts.json");

const bot = new Telegraf(process.env.BOT_TOKEN);
// const checkinAPI = require("./modules/checkin");
const { getEmotionsByUserId } = require("./utils/nikoData.js");
const checkinWithRetry = require("./modules/checkinWithRetry");
const { readAccounts } = require("./modules/auth");
const { CheckNikoUsersByDate } = require("./modules/checkNiko.js");

const ID_CHAT = process.env.ID_CHAT;
const RENDER_URL = process.env.RENDER_URL;
scheduler.scheduleNotify(bot, ID_CHAT);

// Hàm gọi API và gửi thông báo
async function autoCheckin() {
  try {
    const accounts = readAccounts();

    for (let i = 0; i < accounts.length; i++) {
      const result = await checkinWithRetry(i);

      if (result) {
        const newTime = scheduler.scheduleNextCheckin(autoCheckin);
        await bot.telegram.sendMessage(
          ID_CHAT,
          `✅ Checkin thành công (${accounts[i].email})\n⏰ Lần tiếp theo: ${newTime}`,
        );
      } else {
        await bot.telegram.sendMessage(
          ID_CHAT,
          `❌ Checkin thất bại (${accounts[i].email})`,
        );
      }
    }
  } catch (err) {
    await bot.telegram.sendMessage(ID_CHAT, `💥 Lỗi hệ thống: ${err.message}`);
  }
}

// Lệnh test thủ công
bot.command("testcheckin", async (ctx) => {
  await ctx.reply("🔄 Đang test checkin...");
  await autoCheckin();
});

// Lệnh xem thông tin lịch checkin
bot.command("info", (ctx) => {
  const nextCheckinTime = scheduler.getNextCheckinTime();
  const availableTimes = scheduler.getAvailableTimes();

  const message = nextCheckinTime
    ? `🤖 Bot auto checkin\n⏰ Checkin tiếp theo: ${nextCheckinTime}\n📅 Các khung giờ: ${availableTimes.join(
        ", ",
      )}`
    : `🤖 Bot auto checkin\n⏰ Chưa có lịch checkin\n📅 Các khung giờ: ${availableTimes.join(
        ", ",
      )}`;

  ctx.reply(message);
});

// Lệnh reset lịch checkin
bot.command("reset", (ctx) => {
  const newTime = scheduler.scheduleNextCheckin(autoCheckin);
  ctx.reply(`🔄 Đã reset lịch checkin!\n⏰ Checkin tiếp theo: ${newTime}`);
});

// Lệnh ping server
bot.command("ping", (ctx) => {
  pingUtils.pingServer(RENDER_URL);
  ctx.reply("🏓 Đã ping server!");
});

//Lệnh check-niko
bot.command("check_niko", async (ctx) => {
  try {
    // Lấy text sau lệnh, ví dụ: "/check-niko 3303"
    const args = ctx.message.text.split(" ");

    // Nếu không có userId thì báo lỗi
    if (args.length < 2) {
      return ctx.reply("❌ Bạn phải nhập user ID. Ví dụ: /check-niko 3303");
    }

    const userId = args[1];

    // Gọi hàm của bạn
    const emotion = await getEmotionsByUserId(userId);

    if (!emotion) {
      return ctx.reply(`⚠️ Hôm nay bạn chưa niko`);
    }

    return ctx.reply(`✅ Emotion hôm nay của user ${userId} là: ${emotion}`);
  } catch (err) {
    console.error(err);
    ctx.reply("❌ Đã xảy ra lỗi khi kiểm tra emotion.");
  }
});

//Lệnh check-niko
bot.command("checkNikos", async (ctx) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const checking = await CheckNikoUsersByDate(today);
    let notify = "";
    for (const account of nikoAccount) {
      if (checking[account.id] != null) {
        notify = notify + `${account.fullname} đã niko ngày hôm nay \n`;
      }
    }
    return ctx.reply(`Checkin hôm nay: \n ${notify}`);
  } catch (err) {
    console.error(err);
    ctx.reply("❌ Đã xảy ra lỗi khi kiểm tra emotion.");
  }
});

// Lệnh /start
bot.start((ctx) => {
  if (!scheduler.getNextCheckinTime()) {
    scheduler.scheduleNextCheckin(autoCheckin);
  }

  ctx.reply(
    `🤖 Bot auto checkin đã hoạt động!\n⏰ Checkin tiếp theo: ${
      scheduler.getNextCheckinTime() || "đang khởi tạo..."
    }\n\nCác lệnh:\n/testcheckin - Test checkin ngay\n/info - Thông tin bot\n/reset - Reset lịch checkin\n/ping - Ping server\n
    /check_niko [userId] - Kiểm tra emotion Niko \n /checkNikos - kiểm tra các thành viên đã niko hay chưa`,
  );
});

// Khởi động bot
bot.launch();
pingUtils.startPingInterval(RENDER_URL);

// Sử dụng event thay vì .then()
bot.telegram
  .getMe()
  .then(() => {
    scheduler.scheduleNextCheckin(autoCheckin);
    scheduler.scheduleNotify(bot, ID_CHAT);
    console.log("Bot đang chạy");
  })
  .catch((err) => {
    console.log("Lỗi bot:", err);
  });

// Xử lý dừng bot
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
