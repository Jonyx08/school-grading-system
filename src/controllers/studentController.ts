import { Request, Response } from 'express';
import { db } from '../config/database';

export const testDatabase = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query('SELECT * FROM subjects');
        res.json({ 
            message: 'Conexión exitosa a MySQL Workbench!', 
            materias: rows 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error conectando a la base de datos' });
    }
};