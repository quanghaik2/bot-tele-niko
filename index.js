const { Telegraf } = require("telegraf");
require("dotenv").config();

// Import server và utils
require("./server.js");
const scheduler = require("./utils/scheduler");
const pingUtils = require("./utils/pingServer");

const bot = new Telegraf(process.env.BOT_TOKEN);
const checkinAPI = require("./modules/checkin");
const { getEmotionsByUserId } = require("./utils/nikoData.js");

const ID_CHAT = process.env.ID_CHAT;
const RENDER_URL = process.env.RENDER_URL;

// Hàm gọi API và gửi thông báo
async function autoCheckin() {
  try {
    const result = await checkinAPI();

    if (result) {
      const newTime = scheduler.scheduleNextCheckin(autoCheckin);
      const message = `✅ Checkin thành công lúc ${new Date().toLocaleString(
        "vi-VN"
      )}\n⏰ Lịch checkin tiếp theo: ${newTime}`;

      await bot.telegram.sendMessage(ID_CHAT, message);
    } else {
      const message = `❌ Checkin thất bại lúc ${new Date().toLocaleString(
        "vi-VN"
      )}\n🔄 Sẽ thử lại sau 5 phút`;

      await bot.telegram.sendMessage(ID_CHAT, message);

      setTimeout(() => {
        autoCheckin();
      }, 5 * 60 * 1000);
    }
  } catch (error) {
    const message = `💥 Lỗi hệ thống: ${error.message}\n🔄 Sẽ thử lại sau 5 phút`;
    await bot.telegram.sendMessage(ID_CHAT, message);

    setTimeout(() => {
      autoCheckin();
    }, 5 * 60 * 1000);
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
        ", "
      )}`
    : `🤖 Bot auto checkin\n⏰ Chưa có lịch checkin\n📅 Các khung giờ: ${availableTimes.join(
        ", "
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

// Lệnh /start
bot.start((ctx) => {
  if (!scheduler.getNextCheckinTime()) {
    scheduler.scheduleNextCheckin(autoCheckin);
  }

  ctx.reply(
    `🤖 Bot auto checkin đã hoạt động!\n⏰ Checkin tiếp theo: ${
      scheduler.getNextCheckinTime() || "đang khởi tạo..."
    }\n\nCác lệnh:\n/testcheckin - Test checkin ngay\n/info - Thông tin bot\n/reset - Reset lịch checkin\n/ping - Ping server`
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
