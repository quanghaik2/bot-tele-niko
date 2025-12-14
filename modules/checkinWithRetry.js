const checkin = require("./checkin");
const { loginAndUpdateToken, readAccounts } = require("./auth");

async function checkinWithRetry(accountIndex = 0) {
  const accounts = readAccounts();
  let token = accounts[accountIndex].token;

  // Lần 1: checkin bằng token hiện tại
  let ok = await checkin(token);
  if (ok) return true;

  // ❌ Fail → login lấy token mới
  console.log("Token hết hạn, đang login lại...");
  token = await loginAndUpdateToken(accountIndex);

  // Lần 2: checkin lại với token mới
  ok = await checkin(token);
  return ok;
}

module.exports = checkinWithRetry;
