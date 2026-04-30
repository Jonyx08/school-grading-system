import express from "express";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/estudiantes", studentRoutes);

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});