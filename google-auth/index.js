require("dotenv").config();
const express = require("express");
const open = require("open").default;
const { google } = require("googleapis");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/oauth2callback";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const app = express();

app.get("/", async (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/calendar"
    ]
  });

  await open(url);
  res.send("Opening Google Login...");
});

app.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code);

  console.log("\n===============================");
  console.log("REFRESH TOKEN:");
  console.log(tokens.refresh_token);
  console.log("===============================\n");

  res.send("Success! Check your terminal.");
});

app.listen(3000, () => {
  console.log("Server running...");
  console.log("Visit http://localhost:3000");
});