import { Request, Response } from 'express';
import { EvolutionRecordsService } from '../services/evolution-records.service';
import { 
  createEvolutionRecordSchema, 
  updateEvolutionRecordSchema, 
  getEvolutionRecordsQuerySchema 
} from '../schemas/evolution-records.schema';

export class EvolutionRecordsController {
  static async getAll(req: Request, res: Response) {
    const query = getEvolutionRecordsQuerySchema.parse(req.query);
    const result = await EvolutionRecordsService.findMany(query);
    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const record = await EvolutionRecordsService.findById(id);
    if (!record) {
      return res.status(404).json({ error: 'Ficha de evolução não encontrada' });
    }
    res.json(record);
  }

  static async create(req: Request, res: Response) {
    const recordData = createEvolutionRecordSchema.parse(req.body);
    const record = await EvolutionRecordsService.create(recordData);
    res.status(201).json(record);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = updateEvolutionRecordSchema.parse(req.body);
    const record = await EvolutionRecordsService.update(id, updateData);
    res.json(record);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    await EvolutionRecordsService.delete(id);
    res.status(204).send();
  }

  static async getByStudent(req: Request, res: Response) {
    const { studentId } = req.params;
    const records = await EvolutionRecordsService.findByStudent(studentId);
    res.json(records);
  }

  static async getProgressReport(req: Request, res: Response) {
    const { studentId } = req.params;
    const report = await EvolutionRecordsService.generateProgressReport(studentId);
    res.json(report);
  }
}