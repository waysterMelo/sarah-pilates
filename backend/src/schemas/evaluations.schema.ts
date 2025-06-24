import { z } from 'zod';

export const createEvaluationSchema = z.object({
  studentId: z.string().min(1, 'ID do aluno é obrigatório'),
  instructorId: z.string().min(1, 'ID do instrutor é obrigatório'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Data inválida').optional(),
  type: z.enum(['INITIAL', 'PROGRESS', 'FINAL', 'MEDICAL']).default('INITIAL'),
  weight: z.number().positive('Peso deve ser positivo').optional(),
  height: z.number().positive('Altura deve ser positiva').optional(),
  bloodPressure: z.string().optional(),
  heartRate: z.number().int().positive('Frequência cardíaca deve ser positiva').optional(),
  flexibility: z.any().optional(),
  strength: z.any().optional(),
  balance: z.any().optional(),
  coordination: z.any().optional(),
  postureAnalysis: z.any().optional(),
  medicalObservations: z.string().optional(),
  objectives: z.string().optional(),
  treatmentPlan: z.string().optional(),
  recommendations: z.string().optional(),
  nextEvaluationDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Data inválida').optional(),
  attachments: z.array(z.string()).default([]),
});

export const updateEvaluationSchema = createEvaluationSchema.partial();

export const getEvaluationsQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 10),
  search: z.string().optional(),
  studentId: z.string().optional(),
  instructorId: z.string().optional(),
  type: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CreateEvaluationInput = z.infer<typeof createEvaluationSchema>;
export type UpdateEvaluationInput = z.infer<typeof updateEvaluationSchema>;
export type GetEvaluationsQuery = z.infer<typeof getEvaluationsQuerySchema>;