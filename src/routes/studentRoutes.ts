import { Router } from "express";
import { testDatabase } from "../controllers/studentController";

const router = Router();

router.get("/test-db", testDatabase);

export default router;