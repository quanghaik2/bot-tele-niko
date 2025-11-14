const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Bot is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    bot: "running",
    timestamp: new Date().toLocaleString("vi-VN"),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Health check server running on port ${PORT}`);
});

module.exports = app;
