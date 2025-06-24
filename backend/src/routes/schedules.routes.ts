import { Router } from 'express';
import { SchedulesController } from '../controllers/schedules.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate, validateQuery } from '../middleware/validation.middleware';
import { 
  createScheduleSchema, 
  updateScheduleSchema, 
  getSchedulesQuerySchema,
  updateScheduleStatusSchema
} from '../schemas/schedules.schema';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Listar todos os agendamentos
 *     tags: [Schedules]
 */
router.get('/', validateQuery(getSchedulesQuerySchema), SchedulesController.getAll);

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     summary: Obter agendamento por ID
 *     tags: [Schedules]
 */
router.get('/:id', SchedulesController.getById);

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Criar novo agendamento
 *     tags: [Schedules]
 */
router.post('/', validate(createScheduleSchema), SchedulesController.create);

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Atualizar agendamento
 *     tags: [Schedules]
 */
router.put('/:id', validate(updateScheduleSchema), SchedulesController.update);

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Excluir agendamento
 *     tags: [Schedules]
 */
router.delete('/:id', authorize(['ADMIN', 'INSTRUCTOR']), SchedulesController.delete);

/**
 * @swagger
 * /api/schedules/{id}/status:
 *   patch:
 *     summary: Atualizar status do agendamento
 *     tags: [Schedules]
 */
router.patch('/:id/status', validate(updateScheduleStatusSchema), SchedulesController.updateStatus);

/**
 * @swagger
 * /api/schedules/capacity/{date}:
 *   get:
 *     summary: Verificar capacidade por data
 *     tags: [Schedules]
 */
router.get('/capacity/:date', SchedulesController.getCapacity);

export default router;