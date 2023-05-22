import express from "express";
const app = express();
import { config } from "dotenv";
config();
const router = express.Router();
const apikey = process.env.apikey;
import fetch from "node-fetch";
import { encrypt } from "../util.js";
router.post("/", async (req, res) => {
  let { city, query } = req.body;
  query = !query ? "hospital" : query;

  let url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${
    query + " " + city
  }&format=json&apiKey=${apikey}`;

  url = encodeURI(url);
  let info = await fetch(url).then((e) => e.json());
  // console.log(info);
  info.results = info.results.filter((x) => {
    if (x.category != undefined) {
      return (
        x.category.includes("healthcare") || x.category.includes("hospital")
      );
    }
  });
  const status = "Available";
  const start = "0600";
  const end = "1800";
  for (let i of info.results) {
    const rating = (Math.floor(Math.random() * 3) + 3).toFixed(1);

    i.rating = rating;
    const status = ["Available", "Unavailable"][Math.round(Math.random())];
    i.status = status;

    i.sig = encrypt(
      `${i.name}:${i.lat},${i.lon}:${status}:${rating}:${start},${end}:${i.address_line2}`,
      process.env.securityKey
    );
  }

  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  res.json(info);
});

router.post("/auto", async (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  let { name, query } = req.body;
  console.log(name, query);
  if (!query.includes("Hospital")) {
    query = "Hospital";
  }
  const data = await fetch(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${name}+${query}&apiKey=${apikey}`
  ).then((res) => res.json());

  res.json(data);
});
router.options("/auto", (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  res.json();
});
router.options("/", (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  res.json();
});
export default router;
