import { Router } from 'express';
import { InstructorsController } from '../controllers/instructors.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate, validateQuery } from '../middleware/validation.middleware';
import { uploadPhoto } from '../middleware/upload.middleware';
import { 
  createInstructorSchema, 
  updateInstructorSchema, 
  getInstructorsQuerySchema 
} from '../schemas/instructors.schema';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/instructors:
 *   get:
 *     summary: Listar todos os instrutores
 *     tags: [Instructors]
 */
router.get('/', validateQuery(getInstructorsQuerySchema), InstructorsController.getAll);

/**
 * @swagger
 * /api/instructors/{id}:
 *   get:
 *     summary: Obter instrutor por ID
 *     tags: [Instructors]
 */
router.get('/:id', InstructorsController.getById);

/**
 * @swagger
 * /api/instructors:
 *   post:
 *     summary: Criar novo instrutor
 *     tags: [Instructors]
 */
router.post('/', authorize(['ADMIN']), validate(createInstructorSchema), InstructorsController.create);

/**
 * @swagger
 * /api/instructors/{id}:
 *   put:
 *     summary: Atualizar instrutor
 *     tags: [Instructors]
 */
router.put('/:id', authorize(['ADMIN', 'INSTRUCTOR']), validate(updateInstructorSchema), InstructorsController.update);

/**
 * @swagger
 * /api/instructors/{id}:
 *   delete:
 *     summary: Excluir instrutor
 *     tags: [Instructors]
 */
router.delete('/:id', authorize(['ADMIN']), InstructorsController.delete);

/**
 * @swagger
 * /api/instructors/{id}/photo:
 *   post:
 *     summary: Upload de foto do instrutor
 *     tags: [Instructors]
 */
router.post('/:id/photo', uploadPhoto, InstructorsController.uploadPhoto);

/**
 * @swagger
 * /api/instructors/{id}/schedules:
 *   get:
 *     summary: Obter agendamentos do instrutor
 *     tags: [Instructors]
 */
router.get('/:id/schedules', InstructorsController.getSchedules);

export default router;