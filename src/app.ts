import express from "express";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes";

dotenv.config();

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Match your teacher's routing structure
app.use("/estudiantes", studentRoutes);

// Start the server
app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});