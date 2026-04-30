import { Router } from "express";
import { 
    testDatabase,
    getAllStudents,
    createStudent,
    addGrade,
    getStudentAverage,
    updateStudent, 
    deleteStudent, 
    getAllSubjects, 
    addSubject, 
    updateSubject, 
    deleteSubject
} from "../controllers/studentController";

const router = Router();

router.get("/test-db", testDatabase);
router.get("/materias", getAllSubjects);
router.post("/materias", addSubject);
router.put("/materias/:id", updateSubject);
router.delete("/materias/:id", deleteSubject);
router.get("/", getAllStudents);
router.post("/", createStudent);
router.put("/estudiantes/:id", updateStudent);
router.delete("/estudiantes/:id", deleteStudent);
router.post("/nota", addGrade);
router.get("/:id/promedio", getStudentAverage);

export default router;