import prisma from '../config/database';
import { 
  CreateEvolutionRecordInput, 
  UpdateEvolutionRecordInput, 
  GetEvolutionRecordsQuery 
} from '../schemas/evolution-records.schema';

export class EvolutionRecordsService {
  static async findMany(query: GetEvolutionRecordsQuery) {
    const { page, limit, search, studentId, instructorId, startDate, endDate, focus } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { progressNotes: { contains: search, mode: 'insensitive' } },
        { difficultiesObserved: { contains: search, mode: 'insensitive' } },
        { improvements: { contains: search, mode: 'insensitive' } },
        { observations: { contains: search, mode: 'insensitive' } },
        { student: { name: { contains: search, mode: 'insensitive' } } },
        { instructor: { user: { name: { contains: search, mode: 'insensitive' } } } }
      ];
    }

    if (studentId) {
      where.studentId = studentId;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    if (focus) {
      where.focus = { contains: focus, mode: 'insensitive' };
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [records, total] = await Promise.all([
      prisma.evolutionRecord.findMany({
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
      prisma.evolutionRecord.count({ where })
    ]);

    return {
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async findById(id: string) {
    return prisma.evolutionRecord.findUnique({
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

  static async create(data: CreateEvolutionRecordInput) {
    return prisma.evolutionRecord.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : new Date()
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

  static async update(id: string, data: UpdateEvolutionRecordInput) {
    const updateData: any = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }

    return prisma.evolutionRecord.update({
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
    return prisma.evolutionRecord.delete({
      where: { id }
    });
  }

  static async findByStudent(studentId: string) {
    return prisma.evolutionRecord.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
      include: {
        instructor: {
          include: { user: { select: { name: true } } }
        }
      }
    });
  }

  static async generateProgressReport(studentId: string) {
    const records = await prisma.evolutionRecord.findMany({
      where: { studentId },
      orderBy: { date: 'asc' },
      include: {
        student: {
          select: { name: true }
        }
      }
    });

    if (records.length === 0) {
      throw new Error('Nenhuma ficha de evolução encontrada para este aluno');
    }

    const firstRecord = records[0];
    const lastRecord = records[records.length - 1];

    // Calculate progress metrics
    const progressMetrics = {
      overallRating: {
        initial: firstRecord.overallRating,
        current: lastRecord.overallRating,
        improvement: lastRecord.overallRating - firstRecord.overallRating
      },
      painLevel: {
        initial: firstRecord.painLevel,
        current: lastRecord.painLevel,
        improvement: firstRecord.painLevel - lastRecord.painLevel // Lower is better
      },
      mobilityLevel: {
        initial: firstRecord.mobilityLevel,
        current: lastRecord.mobilityLevel,
        improvement: lastRecord.mobilityLevel - firstRecord.mobilityLevel
      },
      strengthLevel: {
        initial: firstRecord.strengthLevel,
        current: lastRecord.strengthLevel,
        improvement: lastRecord.strengthLevel - firstRecord.strengthLevel
      },
      balanceLevel: {
        initial: firstRecord.balanceLevel,
        current: lastRecord.balanceLevel,
        improvement: lastRecord.balanceLevel - firstRecord.balanceLevel
      },
      enduranceLevel: {
        initial: firstRecord.enduranceLevel,
        current: lastRecord.enduranceLevel,
        improvement: lastRecord.enduranceLevel - firstRecord.enduranceLevel
      }
    };

    // Calculate averages
    const averages = {
      overallRating: records.reduce((sum, r) => sum + r.overallRating, 0) / records.length,
      painLevel: records.reduce((sum, r) => sum + r.painLevel, 0) / records.length,
      mobilityLevel: records.reduce((sum, r) => sum + r.mobilityLevel, 0) / records.length,
      strengthLevel: records.reduce((sum, r) => sum + r.strengthLevel, 0) / records.length,
      balanceLevel: records.reduce((sum, r) => sum + r.balanceLevel, 0) / records.length,
      enduranceLevel: records.reduce((sum, r) => sum + r.enduranceLevel, 0) / records.length,
      duration: records.reduce((sum, r) => sum + r.duration, 0) / records.length
    };

    return {
      student: {
        name: firstRecord.student.name,
        totalSessions: records.length,
        dateRange: {
          start: firstRecord.date,
          end: lastRecord.date
        }
      },
      progressMetrics,
      averages,
      records: records.slice(-5) // Last 5 records
    };
  }
}