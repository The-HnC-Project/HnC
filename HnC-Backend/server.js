import express from "express";
import { config } from "dotenv";
config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import db from "./firebase.js";
import hospitals from "./routes/hospitals.js";
import revgeo from "./routes/revgeo.js";
import search from "./routes/search.js";
import register from "./routes/register.js";
import login from "./routes/login.js";
import hospital from "./routes/hospital.js";
import upload from "./routes/upload.js";
import image from "./routes/image.js"
app.use("/api/hospitals", hospitals);
app.use("/api/userLoc", revgeo);
app.use("/api/search", search);
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/hospital", hospital);
app.use("/api/upload", upload);
app.use("/images", image);
app.get("/", (_, res)=>{
	res.json({"kya hua":"chaunk gye kya?"});
}
)
app.listen(process.env.PORT || 80, (e) => {
  if (e) throw e;
	console.log("Workoing");
});
