import { Request, Response } from 'express';
import { EvaluationsService } from '../services/evaluations.service';
import { 
  createEvaluationSchema, 
  updateEvaluationSchema, 
  getEvaluationsQuerySchema 
} from '../schemas/evaluations.schema';

export class EvaluationsController {
  static async getAll(req: Request, res: Response) {
    const query = getEvaluationsQuerySchema.parse(req.query);
    const result = await EvaluationsService.findMany(query);
    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const evaluation = await EvaluationsService.findById(id);
    if (!evaluation) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }
    res.json(evaluation);
  }

  static async create(req: Request, res: Response) {
    const evaluationData = createEvaluationSchema.parse(req.body);
    const evaluation = await EvaluationsService.create(evaluationData);
    res.status(201).json(evaluation);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = updateEvaluationSchema.parse(req.body);
    const evaluation = await EvaluationsService.update(id, updateData);
    res.json(evaluation);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    await EvaluationsService.delete(id);
    res.status(204).send();
  }

  static async getByStudent(req: Request, res: Response) {
    const { studentId } = req.params;
    const evaluations = await EvaluationsService.findByStudent(studentId);
    res.json(evaluations);
  }

  static async uploadAttachment(req: Request, res: Response) {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    const evaluation = await EvaluationsService.addAttachment(id, req.file.filename);
    res.json(evaluation);
  }
}