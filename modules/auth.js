const fs = require("fs");
const path = require("path");
const axios = require("axios");

const ACCOUNTS_PATH = path.join(__dirname, "../data/accounts.json");

function readAccounts() {
  return JSON.parse(fs.readFileSync(ACCOUNTS_PATH, "utf8"));
}

function writeAccounts(data) {
  fs.writeFileSync(ACCOUNTS_PATH, JSON.stringify(data, null, 2));
}

async function loginAndUpdateToken(accountIndex = 0) {
  const accounts = readAccounts();
  const account = accounts[accountIndex];

  const res = await axios.post(
    "https://api.khennhau.com/token",
    {
      email: account.email,
      password: account.password,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  const newToken = res.data?.token;
  if (!newToken) throw new Error("Không lấy được token mới");

  accounts[accountIndex].token = newToken;
  writeAccounts(accounts);

  return newToken;
}

module.exports = {
  loginAndUpdateToken,
  readAccounts,
};
