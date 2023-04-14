import express from "express";
const router = express.Router();
import { config } from "dotenv";
config();
import { randomSixDigitNumber, encrypt } from "../util.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { decrypt } from "../util.js";
import db from "../firebase.js";

router.post("/", async (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  const { phone, password, uid } = req.body;
  console.log(phone, password, uid);
  const docRef = doc(db, "users", phone);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    const decrypted = decrypt(data.password, process.env.securityKey);
    console.log(decrypted, password);
    if (decrypted === password) {
      return res.json({
        status: 200,
        data: {
          username: data.username,
          phone: data.phone,
          age: data.age,
          bloodgroup: data.bloodgroup,
          uid: data.uid,
          medHistory: data.medHistory,
        },
         token: data.token.iv+"."+data.token.data,
      });
    } else {
	    return res.status(400).json({ status: 400, message: "Wrong username/password" });
	   
    }
  } else {
return res.status(400).json({ status: 400, message: "Wrong username/password" });
  }
  
});
router.options("/", (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");

  res.json();
});
export default router;
