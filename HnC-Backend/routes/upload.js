import express from "express";
import { config } from "dotenv";
import multer from "multer";
import path from "path";
import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import db from "../firebase.js";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(req.headers["x-uid"]);
    cb(null, `${req.headers["x-uid"]}`);
  },
});
const upload = multer({ storage });
config();
const router = express.Router();
const apikey = process.env.apikey;
import { decrypt, encrypt } from "../util.js";

router.post("/", upload.single("img"), async (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  const { phone, uid } = req.body;
  console.log(req.file);
    console.log(req.body);
    const AuthToken = req.headers['authorization'].split("Bearer")[1].trim();
//   update hasProfile to true only
    const docRef = doc(db, "users", phone);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
        const data = snap.data();

        if (data.token.iv+"."+data.token.data === AuthToken) {

            const docRef = doc(db, "users", phone);
            await setDoc(docRef, {
                hasProfile: true,
            }, { merge: true });
        }
    }
    
  res.json({
    hasProfile: true,
    imgLink: "https://HnC-Backend.pancham1305.repl.co/images/" + req.body.uid,
  });
});
router.options("/", (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");

  res.json();
});

export default router;
