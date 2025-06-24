import { Router } from 'express';
import { EvaluationsController } from '../controllers/evaluations.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate, validateQuery } from '../middleware/validation.middleware';
import { uploadAttachment } from '../middleware/upload.middleware';
import { 
  createEvaluationSchema, 
  updateEvaluationSchema, 
  getEvaluationsQuerySchema 
} from '../schemas/evaluations.schema';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/evaluations:
 *   get:
 *     summary: Listar todas as avaliações
 *     tags: [Evaluations]
 */
router.get('/', validateQuery(getEvaluationsQuerySchema), EvaluationsController.getAll);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   get:
 *     summary: Obter avaliação por ID
 *     tags: [Evaluations]
 */
router.get('/:id', EvaluationsController.getById);

/**
 * @swagger
 * /api/evaluations:
 *   post:
 *     summary: Criar nova avaliação
 *     tags: [Evaluations]
 */
router.post('/', validate(createEvaluationSchema), EvaluationsController.create);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   put:
 *     summary: Atualizar avaliação
 *     tags: [Evaluations]
 */
router.put('/:id', validate(updateEvaluationSchema), EvaluationsController.update);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   delete:
 *     summary: Excluir avaliação
 *     tags: [Evaluations]
 */
router.delete('/:id', authorize(['ADMIN', 'INSTRUCTOR']), EvaluationsController.delete);

/**
 * @swagger
 * /api/evaluations/student/{studentId}:
 *   get:
 *     summary: Obter avaliações por aluno
 *     tags: [Evaluations]
 */
router.get('/student/:studentId', EvaluationsController.getByStudent);

/**
 * @swagger
 * /api/evaluations/{id}/attachments:
 *   post:
 *     summary: Upload de anexos da avaliação
 *     tags: [Evaluations]
 */
router.post('/:id/attachments', uploadAttachment, EvaluationsController.uploadAttachment);

export default router;