import { Router } from "express";
import { giveRandom } from "../util.js";
const router = Router();
import db from "../firebase.js";
import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";

router.post("/", async (req, res) => {
    const data = req.body;
    console.log(data);
    const payment = giveRandom(100,2000).toFixed(0);

    const user = await getDoc(doc(db,"users",data.phone));

    if(!user.exists()) {
        res.status(400).json({status:400,message:"User not found"});
        return;
    }
    const user_data = user.data();
        if (!user_data.appointments) user_data.appointments = [];

    user_data.appointments.push({
        ...data,
        payment
    });

    await setDoc(doc(db,"users",data.phone),user_data);
    const copYuser_data = {...user_data};
    copYuser_data.password = undefined;
    copYuser_data.token = undefined;
    res.json({
        status: 200,
        data: {
            ...copYuser_data,
        },
    });
});

router.options("/", (_, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Credentials", true);
    res.json();
});


export default router;
