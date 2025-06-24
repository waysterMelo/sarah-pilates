import { z } from 'zod';

const baseScheduleSchema = z.object({
  studentId: z.string().min(1, 'ID do aluno inválido'),
  instructorId: z.string().min(1, 'ID do instrutor inválido'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Data inválida'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário de início inválido'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário de fim inválido'),
  type: z.string().default('Pilates Solo'),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).default('SCHEDULED'),
  notes: z.string().optional(),
  room: z.string().default('Sala 1'),
  equipment: z.array(z.string()).default([]),
  price: z.number().positive('Preço deve ser positivo').default(80),
  paymentStatus: z.enum(['PENDING', 'PAID', 'EXEMPT']).default('PENDING'),
}).refine((data) => {
  const startTime = data.startTime.split(':').map(Number);
  const endTime = data.endTime.split(':').map(Number);
  const startMinutes = startTime[0] * 60 + startTime[1];
  const endMinutes = endTime[0] * 60 + endTime[1];
  return endMinutes > startMinutes;
}, {
  message: 'Horário de fim deve ser posterior ao início',
  path: ['endTime'],
});

export const createScheduleSchema = baseScheduleSchema;

export const updateScheduleSchema = baseScheduleSchema.partial();

export const getSchedulesQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 10),
  search: z.string().optional(),
  status: z.string().optional(),
  studentId: z.string().optional(),
  instructorId: z.string().optional(),
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const updateScheduleStatusSchema = z.object({
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
});

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
export type GetSchedulesQuery = z.infer<typeof getSchedulesQuerySchema>;
export type UpdateScheduleStatusInput = z.infer<typeof updateScheduleStatusSchema>;