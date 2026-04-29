import { Router } from "express";
import { 
    testDatabase,
    getAllStudents,
    createStudent,
    addGrade,
    getStudentAverage
} from "../controllers/studentController";

const router = Router();

router.get("/test-db", testDatabase);

router.get("/", getAllStudents);
router.post("/", createStudent);
router.post("/nota", addGrade);
router.get("/:id/promedio", getStudentAverage);

export default router;