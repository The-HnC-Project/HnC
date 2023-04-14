import express from "express";
const app = express();
import { config } from "dotenv";
config(); 
const router = express.Router();
const apikey = process.env.apikey;
app.use(express.json());

router.post("/", async (req, res) => {
  const { lat, long } = req.body;
  const exactloc = await fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=${process.env.apikey}`
  ).then((r) => r.json());
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  res.json(exactloc);
});
router.options("/", (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  res.json();
});
export default router;

//
