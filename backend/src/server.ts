import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sheetRouter from "./routes/sheetRoute";
import aiRouter from "./routes/artificialIntelligenceRoute";
import { llm } from "./controllers/artificialIntelligenceController";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());



app.use("/api/sheet", sheetRouter);
app.use("/api/ai", aiRouter);

app.get("/api/test-llm", async (req, res) => {
  const response = await llm.invoke("Say hello");
  res.json({ response });
});





app.listen(4000, () => console.log("Server running on port 4000"));
