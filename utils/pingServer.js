const axios = require("axios");

async function pingServer(RENDER_URL) {
  if (!RENDER_URL) return;

  try {
    await axios.get(RENDER_URL);
    console.log("ping server");
  } catch (error) {
    // Silent fail
    console.log(error);
  }
}

function startPingInterval(RENDER_URL) {
  setInterval(() => pingServer(RENDER_URL), 10 * 60 * 1000);
  setTimeout(() => pingServer(RENDER_URL), 5000);
}

module.exports = {
  pingServer,
  startPingInterval,
};
