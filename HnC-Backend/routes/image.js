import express from "express";
import { config } from "dotenv";
import multer from "multer";
import fs from "fs";
import fp from "fs/promises"
import path from "path"
import Mime from 'mime-type';
const mime = new Mime();
import { fileTypeFromBuffer } from "file-type";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(req.headers['x-uid'])
    cb(null, `${req.headers['x-uid']}`);
  }
})
const upload = multer({ storage });
config();
const router = express.Router();
const apikey = process.env.apikey;
import { encrypt } from "../util.js";

router.get("/:uid", async (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  const { uid } = req.params;

  const Path = path.join(process.cwd(), "/uploads", uid);
  
  console.log(Path, fs.existsSync(Path));
  if (fs.existsSync(Path)) {
    const buffer = await fp.readFile(Path);
    const contentType = fileTypeFromBuffer(buffer);
    res.set('Content-Type', contentType);
    res.send(buffer);
  }
})
router.options("/", (req, res) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");


  res.json();
});


export default router