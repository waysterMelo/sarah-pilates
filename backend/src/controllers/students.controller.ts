import { Request, Response } from 'express';
import { StudentsService } from '../services/students.service';
import { 
  createStudentSchema, 
  updateStudentSchema, 
  getStudentsQuerySchema 
} from '../schemas/students.schema';

export class StudentsController {
  static async getAll(req: Request, res: Response) {
    const query = getStudentsQuerySchema.parse(req.query);
    const result = await StudentsService.findMany(query);
    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const student = await StudentsService.findById(id);
    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    res.json(student);
  }

  static async create(req: Request, res: Response) {
    const studentData = createStudentSchema.parse(req.body);
    const student = await StudentsService.create(studentData);
    res.status(201).json(student);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = updateStudentSchema.parse(req.body);
    const student = await StudentsService.update(id, updateData);
    res.json(student);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    await StudentsService.delete(id);
    res.status(204).send();
  }

  static async getSchedules(req: Request, res: Response) {
    const { id } = req.params;
    const schedules = await StudentsService.getSchedules(id);
    res.json(schedules);
  }

  static async getEvaluations(req: Request, res: Response) {
    const { id } = req.params;
    const evaluations = await StudentsService.getEvaluations(id);
    res.json(evaluations);
  }

  static async getEvolutionRecords(req: Request, res: Response) {
    const { id } = req.params;
    const records = await StudentsService.getEvolutionRecords(id);
    res.json(records);
  }

  static async uploadPhoto(req: Request, res: Response) {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma foto enviada' });
    }
    const student = await StudentsService.uploadPhoto(id, req.file.filename);
    res.json(student);
  }

  static async search(req: Request, res: Response) {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Parâmetro de busca é obrigatório' });
    }
    const students = await StudentsService.search(q);
    res.json(students);
  }
}