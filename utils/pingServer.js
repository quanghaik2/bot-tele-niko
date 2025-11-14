const axios = require("axios");

async function pingServer(RENDER_URL) {
  if (!RENDER_URL) return;

  try {
    await axios.get(RENDER_URL);
  } catch (error) {
    // Silent fail
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
