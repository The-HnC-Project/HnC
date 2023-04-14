import express from "express";
const app = express();
import crypto from "crypto";
import { config } from "dotenv";
config();
const router = express.Router();
import db from "../firebase.js";
import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { randomSixDigitNumber, encrypt } from "../util.js";
router.post("/", async (req, res) => {
  const { name, age, bloodgroup, phone, password } = req.body;
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  const string = `${phone}+${password}+${Date.now() + 30 * 86400000}`;
  const encrypted = encrypt(string, process.env.securityKey);
  const encryptPass = encrypt(password, process.env.securityKey);
  const uid = crypto.randomBytes(32).toString("hex");
  // yahan pe firebase mein data jaega
  let medHistory = [];
  const existingDocRef = doc(db, "users", phone);
  const snap = await getDoc(existingDocRef);
  if ((snap.exists())) {
    res.status(400).json({ status: 400, message: "User already exists" });
  }
  const docref = await setDoc(doc(db, "users", phone), {
    username: name,
    age,
    bloodgroup,
    phone,
    password: encryptPass,
    uid,
    medHistory: [],
    token: encrypted,
    hasProfile: false,
  });
  res.json({
    status: 200,
    data: {
      username: name,  
      phone: phone,
      age,
      bloodgroup,
      uid,
      medHistory,
    },
    token: encrypted.iv + "." + encrypted.data,
  });
});
router.options("/", (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  res.json();
});
export default router;
