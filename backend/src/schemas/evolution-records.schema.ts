import { z } from 'zod';

export const createEvolutionRecordSchema = z.object({
  studentId: z.string().uuid('ID do aluno inválido'),
  instructorId: z.string().uuid('ID do instrutor inválido'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Data inválida').optional(),
  session: z.number().int().positive('Número da sessão deve ser positivo'),
  focus: z.string().min(1, 'Foco da sessão é obrigatório'),
  exercisesPerformed: z.array(z.string()).default([]),
  progressNotes: z.string().optional(),
  difficultiesObserved: z.string().optional(),
  improvements: z.string().optional(),
  nextSessionGoals: z.string().optional(),
  overallRating: z.number().int().min(1, 'Avaliação mínima é 1').max(5, 'Avaliação máxima é 5').default(3),
  painLevel: z.number().int().min(0, 'Nível de dor mínimo é 0').max(10, 'Nível de dor máximo é 10').default(0),
  mobilityLevel: z.number().int().min(1, 'Nível mínimo é 1').max(5, 'Nível máximo é 5').default(3),
  strengthLevel: z.number().int().min(1, 'Nível mínimo é 1').max(5, 'Nível máximo é 5').default(3),
  balanceLevel: z.number().int().min(1, 'Nível mínimo é 1').max(5, 'Nível máximo é 5').default(3),
  enduranceLevel: z.number().int().min(1, 'Nível mínimo é 1').max(5, 'Nível máximo é 5').default(3),
  observations: z.string().optional(),
  equipment: z.array(z.string()).default([]),
  duration: z.number().int().positive('Duração deve ser positiva').default(60),
});

export const updateEvolutionRecordSchema = createEvolutionRecordSchema.partial();

export const getEvolutionRecordsQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 10),
  search: z.string().optional(),
  studentId: z.string().uuid().optional(),
  instructorId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  focus: z.string().optional(),
});

export type CreateEvolutionRecordInput = z.infer<typeof createEvolutionRecordSchema>;
export type UpdateEvolutionRecordInput = z.infer<typeof updateEvolutionRecordSchema>;
export type GetEvolutionRecordsQuery = z.infer<typeof getEvolutionRecordsQuerySchema>;