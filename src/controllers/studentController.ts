import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../config/database';
import { Estudiante, Materia } from '../models/GradingSystem';

// prueba de conexión que jonixx
export const testDatabase = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query('SELECT * FROM subjects');
        res.json({ message: 'Conexión exitosa a MySQL Workbench!', materias: rows });
    } catch (error) {
    console.error('ERROR MYSQL:', error);
    res.status(500).json({ error: 'Error conectando a la base de datos' });
}
};

// trae la lista completa de estudiantes
export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM students');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
};

// registra un estudiante nuevo
export const createStudent = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            res.status(400).json({ error: 'El nombre y el email son requeridos' });
            return;
        }

        const [result] = await db.query<ResultSetHeader>(
            'INSERT INTO students (name, email) VALUES (?, ?)',
            [name, email]
        );

        res.status(201).json({ id: result.insertId, name, email });
    } catch (error) {
        console.error('ERROR REAL AL CREAR ESTUDIANTE:', error); // <-- Agrega esta línea
        res.status(500).json({ error: 'Error al crear el estudiante' });
    }
};

// registra una nota para un estudiante en una materia
export const addGrade = async (req: Request, res: Response) => {
    try {
        const { student_id, subject_id, evaluation, score } = req.body;

        // validamos que la nota tenga sentido antes de guardarla
        if (score < 0 || score > 10) {
            res.status(400).json({ error: 'La nota debe estar entre 0 y 10' });
            return;
        }

        await db.query<ResultSetHeader>(
            'INSERT INTO grades (student_id, subject_id, evaluation, score) VALUES (?, ?, ?, ?)',
            [student_id, subject_id, evaluation, score]
        );

        res.status(201).json({ message: 'Nota registrada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar la nota' });
    }
};

// calcula el promedio general de un estudiante usando las clases del modelo
export const getStudentAverage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // primero verificamos que el estudiante exista
        const [studentRows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM students WHERE id = ?', [id]
        );

        if (studentRows.length === 0) {
            res.status(404).json({ error: 'Estudiante no encontrado' });
            return;
        }

        // traemos todas sus notas agrupadas por materia
        const [gradeRows] = await db.query<RowDataPacket[]>(
            `SELECT s.name AS subject, g.score
             FROM grades g
             JOIN subjects s ON g.subject_id = s.id
             WHERE g.student_id = ?
             ORDER BY s.name`,
            [id]
        );

        if (gradeRows.length === 0) {
            res.status(404).json({ error: 'Este estudiante no tiene notas registradas' });
            return;
        }

        // construimos el objeto Estudiante con sus Materias
        // aquí es donde el polimorfismo hace su trabajo
        const estudiante = new Estudiante(studentRows[0]!.name);
        const materiasMap = new Map<string, Materia>();

        for (const row of gradeRows) {
            if (!materiasMap.has(row.subject)) {
                materiasMap.set(row.subject, new Materia(row.subject));
            }
            materiasMap.get(row.subject)!.agregarNota(row.score);
        }

        for (const materia of materiasMap.values()) {
            estudiante.agregarMateria(materia);
        }

        // armamos la respuesta con detalle por materia y promedio general
        const detalle = estudiante.materias.map(m => ({
            materia:  m.nombre,
            promedio: m.calcularPromedio(),
            estado:   m.obtenerEstado()   // polimorfismo en acción
        }));

        res.json({
            estudiante:       estudiante.nombre,
            detalle_materias: detalle,
            promedio_general: estudiante.calcularPromedio(),
            estado_general:   estudiante.obtenerEstado()  // misma función, objeto distinto
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al calcular el promedio' });
    }
};