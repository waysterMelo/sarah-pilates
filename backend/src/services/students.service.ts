import prisma from '../config/database';
import { CreateStudentInput, UpdateStudentInput, GetStudentsQuery } from '../schemas/students.schema';

export class StudentsService {
  static async findMany(query: GetStudentsQuery) {
    const { page, limit, search, status, plan } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (plan) {
      where.plan = plan;
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          birthDate: true,
          plan: true,
          status: true,
          registrationDate: true,
          lastClass: true,
          totalClasses: true,
          createdAt: true,
        }
      }),
      prisma.student.count({ where })
    ]);

    return {
      students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async findById(id: string) {
    return prisma.student.findUnique({
      where: { id },
      include: {
        schedules: {
          take: 10,
          orderBy: { date: 'desc' },
          include: {
            instructor: {
              include: { user: { select: { name: true } } }
            }
          }
        },
        evaluations: {
          take: 5,
          orderBy: { date: 'desc' },
          include: {
            instructor: {
              include: { user: { select: { name: true } } }
            }
          }
        },
        evolutionRecords: {
          take: 5,
          orderBy: { date: 'desc' },
          include: {
            instructor: {
              include: { user: { select: { name: true } } }
            }
          }
        }
      }
    });
  }

  static async create(data: CreateStudentInput) {
    return prisma.student.create({
      data: {
        ...data,
        birthDate: new Date(data.birthDate)
      }
    });
  }

  static async update(id: string, data: UpdateStudentInput) {
    const updateData: any = { ...data };
    if (data.birthDate) {
      updateData.birthDate = new Date(data.birthDate);
    }

    return prisma.student.update({
      where: { id },
      data: updateData
    });
  }

  static async delete(id: string) {
    return prisma.student.delete({
      where: { id }
    });
  }

  static async getSchedules(studentId: string) {
    return prisma.schedule.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
      include: {
        instructor: {
          include: { user: { select: { name: true } } }
        }
      }
    });
  }

  static async getEvaluations(studentId: string) {
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

  static async getEvolutionRecords(studentId: string) {
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

  static async uploadPhoto(id: string, filename: string) {
    return prisma.student.update({
      where: { id },
      data: { 
        // Note: You'd need to add a photo field to the Student model
        // photo: filename 
      }
    });
  }

  static async search(query: string) {
    return prisma.student.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { email: { contains: query } },
          { phone: { contains: query } },
        ]
      },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
      }
    });
  }
}