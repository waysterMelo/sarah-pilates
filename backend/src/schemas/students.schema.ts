import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Data de nascimento inválida'),
  address: z.string().optional(),
  emergencyContact: z.string().min(2, 'Contato de emergência é obrigatório'),
  emergencyPhone: z.string().min(10, 'Telefone de emergência inválido'),
  medicalHistory: z.string().optional(),
  objectives: z.string().optional(),
  plan: z.string().default('Mensal - 8 aulas'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
});

export const updateStudentSchema = createStudentSchema.partial();

export const getStudentsQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 10),
  search: z.string().optional(),
  status: z.string().optional(),
  plan: z.string().optional(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type GetStudentsQuery = z.infer<typeof getStudentsQuerySchema>;