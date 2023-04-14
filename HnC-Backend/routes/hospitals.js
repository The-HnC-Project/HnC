import express from "express";
import { config } from "dotenv";
config();
const router = express.Router();
const apikey = process.env.apikey;
import { encrypt } from "../util.js";
router.post("/", async (req, res) => {
  const { place_id } = req.body;
  let url = `https://api.geoapify.com/v2/places?categories=healthcare,healthcare.hospital&filter=place:${place_id}&limit=20&apiKey=${apikey}`;
  const Hosinfo = await fetch(url).then((e) => e.json());

  const start = "0600";
  const end = "1800";

  // console.log(Hosinfo.features[0]);
  for (let i of Hosinfo.features) {
    const rating = (Math.floor(Math.random() * 3) + 3).toFixed(1);

    i.rating = rating;
    const status = ["Available", "Unavailable"][Math.round(Math.random())];
    i.status = status;
    // id.push(
    i.sig = encrypt(
      `${i.properties.name}:${i.properties.lat},${i.properties.lon}:${status}:${rating}:${start},${end}:${i.properties.address_line2}`,
      process.env.securityKey
    );
  }
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  res.json(Hosinfo);
});
router.options("/", (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  res.json();
});
export default router;
