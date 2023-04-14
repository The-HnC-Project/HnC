import express from "express";
const app = express();
import { config } from "dotenv";
import { decrypt } from "../util.js";
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

  //   console.log(obj.data, process.env.securityKey);
  const data2 = decrypt(obj, process.env.securityKey);
  res.json(data2);
});
router.options("/", (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  res.json();
});
export default router;
