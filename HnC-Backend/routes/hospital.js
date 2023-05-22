import express from "express";
const app = express();
import { config } from "dotenv";
import { decrypt } from "../util.js";
import fetch from "node-fetch";
import { giveRandom } from "../util.js";
config();
const router = express.Router();
const apikey = process.env.apikey;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
router.post("/", (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  const { hospitalinfo, b } = req.body;
  const obj = {
    data: hospitalinfo,
    iv: b,
  };
  const total_beds = giveRandom(10, 100).toFixed(0);
  const free_beds = giveRandom(10, total_beds).toFixed(0);
  const total_ventilators = giveRandom(10, 50).toFixed(0);
  const free_ventilators = giveRandom(10, total_ventilators).toFixed(0);
  const info = {
    no_of_beds: { total_beds, free_beds },
    doctors_count: giveRandom(10, 20).toFixed(0),
    facilities: ["Ambulance", "Emergency", "ICU", "Pharmacy"],
    employee_count: giveRandom(50, 200).toFixed(0),
    no_of_ventilators: { total_ventilators, free_ventilators },
  };
  //   console.log(obj.data, process.env.securityKey);
  const data2 = decrypt(obj, process.env.securityKey);
  res.json({ data2, info });
});
router.options("/", (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  res.json();
});
export default router;
