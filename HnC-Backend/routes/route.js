import express from "express";
import { config } from "dotenv";
config();
const router = express.Router();
const apikey = process.env.apikey;
import fetch from "node-fetch";
router.post("/", async (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  const { fromWaypoint, towaypoint } = req.body;
  console.log(fromWaypoint, towaypoint);
  const data = await fetch(
    `https://api.geoapify.com/v1/routing?waypoints=${fromWaypoint.join(
      ","
    )}|${towaypoint.join(",")}&mode=drive&apiKey=${apikey}`
  ).then((res) => res.json());
  res.json(data);
});

router.options("/", (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  res.json();
});

export default router;
