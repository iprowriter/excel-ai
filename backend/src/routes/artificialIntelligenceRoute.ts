import express from "express";
import { continueChat, generateReport } from "../controllers/artificialIntelligenceController";


const aiRouter = express.Router();

aiRouter.post("/generate", generateReport);
aiRouter.post("/chat", continueChat);

export default aiRouter;