import express from "express";
import cors from "cors";
import sheetRouter from "./routes/sheetRoute";

const app = express();
app.use(cors());
app.use(express.json());



app.use("/api/sheet", sheetRouter);




app.listen(4000, () => console.log("Server running on port 4000"));
