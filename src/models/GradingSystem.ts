// clase base, cualquier cosa que se pueda evaluar hereda de aquí
abstract class Evaluable {
    abstract calcularPromedio(): number;

    // este método funciona igual para Materia y para Estudiante
    // no le importa cuál de los dos es, solo llama calcularPromedio()
    obtenerEstado(): string {
        const promedio = this.calcularPromedio();
        if (promedio >= 9)  return 'Excelente';
        if (promedio >= 7)  return 'Aprobado';
        if (promedio >= 6)  return 'Suficiente';
        return 'Reprobado';
    }
}

export class Materia extends Evaluable {
    public notas: number[] = [];

    constructor(public nombre: string) {
        super();
    }

    agregarNota(nota: number): void {
        this.notas.push(nota);
    }

    // promedia solo las notas de esta materia
    calcularPromedio(): number {
        if (this.notas.length === 0) return 0;
        const suma = this.notas.reduce((acc, n) => acc + n, 0);
        return parseFloat((suma / this.notas.length).toFixed(2));
    }
}

export class Estudiante extends Evaluable {
    public materias: Materia[] = [];

    constructor(public nombre: string) {
        super();
    }

    agregarMateria(materia: Materia): void {
        this.materias.push(materia);
    }

    // promedia los promedios de cada materia
    // polimorfismo: llama calcularPromedio() en cada Materia
    calcularPromedio(): number {
        if (this.materias.length === 0) return 0;
        const suma = this.materias.reduce((acc, m) => acc + m.calcularPromedio(), 0);
        return parseFloat((suma / this.materias.length).toFixed(2));
    }
}