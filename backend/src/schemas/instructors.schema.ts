import { z } from 'zod';

export const createInstructorSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  specialties: z.array(z.string()).default([]),
  crefito: z.string().optional(),
  biography: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'VACATION']).default('ACTIVE'),
});

export const updateInstructorSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  specialties: z.array(z.string()).optional(),
  crefito: z.string().optional(),
  biography: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'VACATION']).optional(),
});

export const getInstructorsQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 10),
  search: z.string().optional(),
  status: z.string().optional(),
  specialty: z.string().optional(),
});

export type CreateInstructorInput = z.infer<typeof createInstructorSchema>;
export type UpdateInstructorInput = z.infer<typeof updateInstructorSchema>;
export type GetInstructorsQuery = z.infer<typeof getInstructorsQuerySchema>;