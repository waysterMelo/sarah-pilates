import prisma from '../config/database';
import { 
  CreateEvaluationInput, 
  UpdateEvaluationInput, 
  GetEvaluationsQuery 
} from '../schemas/evaluations.schema';

export class EvaluationsService {
  static async findMany(query: GetEvaluationsQuery) {
    const { page, limit, search, studentId, instructorId, type, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { student: { name: { contains: search, mode: 'insensitive' } } },
        { instructor: { user: { name: { contains: search, mode: 'insensitive' } } } },
        { medicalObservations: { contains: search, mode: 'insensitive' } },
        { objectives: { contains: search, mode: 'insensitive' } },
        { treatmentPlan: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (studentId) {
      where.studentId = studentId;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [evaluations, total] = await Promise.all([
      prisma.evaluation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          student: {
            select: { id: true, name: true, email: true }
          },
          instructor: {
            include: { user: { select: { name: true } } }
          }
        }
      }),
      prisma.evaluation.count({ where })
    ]);

    return {
      evaluations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async findById(id: string) {
    return prisma.evaluation.findUnique({
      where: { id },
      include: {
        student: {
          select: { id: true, name: true, email: true, phone: true }
        },
        instructor: {
          include: { user: { select: { name: true, email: true } } }
        }
      }
    });
  }

  static async create(data: CreateEvaluationInput) {
    return prisma.evaluation.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : new Date(),
        nextEvaluationDate: data.nextEvaluationDate ? new Date(data.nextEvaluationDate) : null,
        attachments: data.attachments || []
      },
      include: {
        student: {
          select: { id: true, name: true, email: true }
        },
        instructor: {
          include: { user: { select: { name: true } } }
        }
      }
    });
  }

  static async update(id: string, data: UpdateEvaluationInput) {
    const updateData: any = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }
    if (data.nextEvaluationDate) {
      updateData.nextEvaluationDate = new Date(data.nextEvaluationDate);
    }

    return prisma.evaluation.update({
      where: { id },
      data: updateData,
      include: {
        student: {
          select: { id: true, name: true, email: true }
        },
        instructor: {
          include: { user: { select: { name: true } } }
        }
      }
    });
  }

  static async delete(id: string) {
    return prisma.evaluation.delete({
      where: { id }
    });
  }

  static async findByStudent(studentId: string) {
    return prisma.evaluation.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
      include: {
        instructor: {
          include: { user: { select: { name: true } } }
        }
      }
    });
  }

  static async addAttachment(id: string, filename: string) {
    const evaluation = await prisma.evaluation.findUnique({
      where: { id }
    });

    if (!evaluation) {
      throw new Error('Avaliação não encontrada');
    }

    const currentAttachments = Array.isArray(evaluation.attachments) ? evaluation.attachments : [];
    const updatedAttachments = [...currentAttachments, filename];

    return prisma.evaluation.update({
      where: { id },
      data: { attachments: updatedAttachments },
      include: {
        student: {
          select: { id: true, name: true, email: true }
        },
        instructor: {
          include: { user: { select: { name: true } } }
        }
      }
    });
  }
}