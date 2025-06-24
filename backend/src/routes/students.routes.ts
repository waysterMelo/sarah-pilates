import { Router } from 'express';
import { StudentsController } from '../controllers/students.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate, validateQuery } from '../middleware/validation.middleware';
import { uploadPhoto } from '../middleware/upload.middleware';
import { 
  createStudentSchema, 
  updateStudentSchema, 
  getStudentsQuerySchema 
} from '../schemas/students.schema';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Listar todos os alunos
 *     tags: [Students]
 */
router.get('/', validateQuery(getStudentsQuerySchema), StudentsController.getAll);

/**
 * @swagger
 * /api/students/search:
 *   get:
 *     summary: Buscar alunos
 *     tags: [Students]
 */
router.get('/search', StudentsController.search);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Obter aluno por ID
 *     tags: [Students]
 */
router.get('/:id', StudentsController.getById);

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Criar novo aluno
 *     tags: [Students]
 */
router.post('/', validate(createStudentSchema), StudentsController.create);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Atualizar aluno
 *     tags: [Students]
 */
router.put('/:id', validate(updateStudentSchema), StudentsController.update);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Excluir aluno
 *     tags: [Students]
 */
router.delete('/:id', authorize(['ADMIN', 'INSTRUCTOR']), StudentsController.delete);

/**
 * @swagger
 * /api/students/{id}/schedules:
 *   get:
 *     summary: Obter agendamentos do aluno
 *     tags: [Students]
 */
router.get('/:id/schedules', StudentsController.getSchedules);

/**
 * @swagger
 * /api/students/{id}/evaluations:
 *   get:
 *     summary: Obter avaliações do aluno
 *     tags: [Students]
 */
router.get('/:id/evaluations', StudentsController.getEvaluations);

/**
 * @swagger
 * /api/students/{id}/evolution-records:
 *   get:
 *     summary: Obter fichas de evolução do aluno
 *     tags: [Students]
 */
router.get('/:id/evolution-records', StudentsController.getEvolutionRecords);

/**
 * @swagger
 * /api/students/{id}/photo:
 *   post:
 *     summary: Upload de foto do aluno
 *     tags: [Students]
 */
router.post('/:id/photo', uploadPhoto, StudentsController.uploadPhoto);

export default router;