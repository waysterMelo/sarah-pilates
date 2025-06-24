import { Request, Response } from 'express';
import { InstructorsService } from '../services/instructors.service';
import { 
  createInstructorSchema, 
  updateInstructorSchema, 
  getInstructorsQuerySchema 
} from '../schemas/instructors.schema';

export class InstructorsController {
  static async getAll(req: Request, res: Response) {
    const query = getInstructorsQuerySchema.parse(req.query);
    const result = await InstructorsService.findMany(query);
    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const instructor = await InstructorsService.findById(id);
    if (!instructor) {
      return res.status(404).json({ error: 'Instrutor não encontrado' });
    }
    res.json(instructor);
  }

  static async create(req: Request, res: Response) {
    const instructorData = createInstructorSchema.parse(req.body);
    const instructor = await InstructorsService.create(instructorData);
    res.status(201).json(instructor);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = updateInstructorSchema.parse(req.body);
    const instructor = await InstructorsService.update(id, updateData);
    res.json(instructor);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    await InstructorsService.delete(id);
    res.status(204).send();
  }

  static async uploadPhoto(req: Request, res: Response) {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma foto enviada' });
    }
    const instructor = await InstructorsService.uploadPhoto(id, req.file.filename);
    res.json(instructor);
  }

  static async getSchedules(req: Request, res: Response) {
    const { id } = req.params;
    const schedules = await InstructorsService.getSchedules(id);
    res.json(schedules);
  }
}