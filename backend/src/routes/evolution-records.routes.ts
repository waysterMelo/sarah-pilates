import { Router } from 'express';
import { EvolutionRecordsController } from '../controllers/evolution-records.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate, validateQuery } from '../middleware/validation.middleware';
import { 
  createEvolutionRecordSchema, 
  updateEvolutionRecordSchema, 
  getEvolutionRecordsQuerySchema 
} from '../schemas/evolution-records.schema';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/evolution-records:
 *   get:
 *     summary: Listar todas as fichas de evolução
 *     tags: [Evolution Records]
 */
router.get('/', validateQuery(getEvolutionRecordsQuerySchema), EvolutionRecordsController.getAll);

/**
 * @swagger
 * /api/evolution-records/{id}:
 *   get:
 *     summary: Obter ficha de evolução por ID
 *     tags: [Evolution Records]
 */
router.get('/:id', EvolutionRecordsController.getById);

/**
 * @swagger
 * /api/evolution-records:
 *   post:
 *     summary: Criar nova ficha de evolução
 *     tags: [Evolution Records]
 */
router.post('/', validate(createEvolutionRecordSchema), EvolutionRecordsController.create);

/**
 * @swagger
 * /api/evolution-records/{id}:
 *   put:
 *     summary: Atualizar ficha de evolução
 *     tags: [Evolution Records]
 */
router.put('/:id', validate(updateEvolutionRecordSchema), EvolutionRecordsController.update);

/**
 * @swagger
 * /api/evolution-records/{id}:
 *   delete:
 *     summary: Excluir ficha de evolução
 *     tags: [Evolution Records]
 */
router.delete('/:id', authorize(['ADMIN', 'INSTRUCTOR']), EvolutionRecordsController.delete);

/**
 * @swagger
 * /api/evolution-records/student/{studentId}:
 *   get:
 *     summary: Obter fichas de evolução por aluno
 *     tags: [Evolution Records]
 */
router.get('/student/:studentId', EvolutionRecordsController.getByStudent);

/**
 * @swagger
 * /api/evolution-records/reports/progress/{studentId}:
 *   get:
 *     summary: Gerar relatório de progresso do aluno
 *     tags: [Evolution Records]
 */
router.get('/reports/progress/:studentId', EvolutionRecordsController.getProgressReport);

export default router;