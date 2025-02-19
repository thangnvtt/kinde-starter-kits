import dotenv from "dotenv";
dotenv.config();

import { setupKinde, protectRoute, getUser, GrantType } from "@kinde-oss/kinde-node-express";
import express from "express";

const app = express();
const port = 3000;
app.use(express.static("public"));
const config = {
  grantType: GrantType.AUTHORIZATION_CODE,
  clientId: process.env.KINDE_CLIENT_ID,
  issuerBaseUrl: process.env.KINDE_ISSUER_URL,
  siteUrl: process.env.KINDE_SITE_URL,
  secret: process.env.KINDE_CLIENT_SECRET,
  redirectUrl: process.env.KINDE_REDIRECT_URL,
  unAuthorisedUrl: process.env.KINDE_SITE_URL,
  postLogoutRedirectUrl: process.env.KINDE_POST_LOGOUT_REDIRECT_URL,
};
const KINDE_INTERVIEW_CLIENT_SECRET = process.env.KINDE_INTERVIEW_CLIENT_SECRET
const KINDE_ISSUER_URL = process.env.KINDE_ISSUER_URL

app.set("view engine", "pug");
const client = setupKinde(config, app);

app.get("/", async (req, res) => {
  if (await client.isAuthenticated(req)) {
    res.redirect("/admin");
  } else {
    res.render("index", {
      title: "Hey",
      message: "Hello there! what would you like to do?",
    });
  }
});

app.get("/admin", protectRoute, getUser, (req, res) => {

  res.render("admin", {
    title: "Admin",
    user: req.user,
  });
});

app.get('/api/organizations', async (req, res) => {
  const response = await fetch(`${KINDE_ISSUER_URL}/api/v1/organizations`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${KINDE_INTERVIEW_CLIENT_SECRET}`,
      'Content-Type': 'application/json'
    }})
  const data = await response.json();
  res.json(data);
})

app.listen(port, () => {
  console.log(`Kinde Express Starter Kit listening on port ${port}!`);
});
