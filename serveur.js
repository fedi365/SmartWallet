import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { initDB } from "./db.js";
import { get_transactions, add_transaction, suppuserbyid, getuserbyid, summaryasync } from "./services.js";

dotenv.config();

const app = express(); // عرف express قبل
const Port = process.env.PORT || 5000;

// middleware
app.use(cors()); // خلي cors بعد ما تعرّف app
app.use(express.json());

// routes
app.get("/api/transactions", get_transactions);
app.post("/api/transactions", add_transaction);
app.delete("/api/transactions/:id", suppuserbyid);
app.get("/api/transactions/:user_id", getuserbyid);
app.get("/api/transactions/summary/:user_id", summaryasync);

initDB().then(() => {
    app.listen(Port, () => {
        console.log("Server is running on port:", Port);
    });
});
