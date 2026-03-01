import express from "express";
import { uploadSheet } from "../controllers/sheetController";
import { upload } from "../middlewares/middlewares";


const sheetRouter = express.Router();

sheetRouter.post("/upload", upload.single("file"), uploadSheet);


export default sheetRouter;