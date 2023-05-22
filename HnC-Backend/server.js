import express from "express";
import { config } from "dotenv";
import rateLimit from "express-rate-limit";
import fetch from "node-fetch";
import cors from "cors";
config();
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use("/api/", apiLimiter);
import db from "./firebase.js";
import hospitals from "./routes/hospitals.js";
import revgeo from "./routes/revgeo.js";
import search from "./routes/search.js";
import register from "./routes/register.js";
import login from "./routes/login.js";
import hospital from "./routes/hospital.js";
import formSubmit from "./routes/formsubmit.js";
import route from "./routes/route.js";
app.use("/api/hospitals", hospitals);
app.use("/api/userLoc", revgeo);
app.use("/api/search", search);
app.use("/api/search/auto", search);
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/hospital", hospital);
app.use("/api/route", route);
app.use("/api/formsubmit", formSubmit);
app.get("/", (_, res) => {
  res.json({ "Kya hua?": "Chaunk gye kya?" });
});
app.listen(process.env.PORT || 50000, (e) => {
  console.log("Server Started...");
});
