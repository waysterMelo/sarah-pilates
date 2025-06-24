import { Request, Response } from 'express';
import { SchedulesService } from '../services/schedules.service';
import { 
  createScheduleSchema, 
  updateScheduleSchema, 
  getSchedulesQuerySchema,
  updateScheduleStatusSchema
} from '../schemas/schedules.schema';

export class SchedulesController {
  static async getAll(req: Request, res: Response) {
    const query = getSchedulesQuerySchema.parse(req.query);
    const result = await SchedulesService.findMany(query);
    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const schedule = await SchedulesService.findById(id);
    if (!schedule) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.json(schedule);
  }

  static async create(req: Request, res: Response) {
    const scheduleData = createScheduleSchema.parse(req.body);
    const schedule = await SchedulesService.create(scheduleData);
    res.status(201).json(schedule);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = updateScheduleSchema.parse(req.body);
    const schedule = await SchedulesService.update(id, updateData);
    res.json(schedule);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    await SchedulesService.delete(id);
    res.status(204).send();
  }

  static async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = updateScheduleStatusSchema.parse(req.body);
    const schedule = await SchedulesService.updateStatus(id, status);
    res.json(schedule);
  }

  static async getCapacity(req: Request, res: Response) {
    const { date } = req.params;
    const capacity = await SchedulesService.getCapacityByDate(date);
    res.json(capacity);
  }
}