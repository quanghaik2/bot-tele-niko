const checkin = require("./checkin");

require("dotenv").config();

checkin(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozMzAzLCJvaWQiOjIyMywicm9sZSI6InN0YWZmIiwiaWF0IjoxNzY1NzAyNjA1LCJleHAiOjE3NjgyOTQ2MDV9.ZwEcU5DHTo34wKe7_BxX0prXCVowbF2xKY57L3e8JIU"
)
  .then((result) => {
    if (result) {
      console.log("✅ TEST PASS: Checkin thành công");
    } else {
      console.log("❌ TEST FAIL: Checkin thất bại");
    }
  })
  .catch((err) => {
    console.error("💥 Lỗi ngoài dự kiến:", err);
  })
  .finally(() => {
    console.log("🏁 Kết thúc test");
  });
