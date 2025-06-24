import prisma from '../config/database';
import { hashPassword } from '../utils/bcrypt';
import { CreateInstructorInput, UpdateInstructorInput, GetInstructorsQuery } from '../schemas/instructors.schema';

export class InstructorsService {
  static async findMany(query: GetInstructorsQuery) {
    const { page, limit, search, status, specialty } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { biography: { contains: search, mode: 'insensitive' } },
        { crefito: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (specialty) {
      where.specialties = {
        array_contains: specialty
      };
    }

    const [instructors, total] = await Promise.all([
      prisma.instructor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { user: { name: 'asc' } },
        include: {
          user: {
            select: { id: true, name: true, email: true, isActive: true }
          },
          _count: {
            select: { schedules: true }
          }
        }
      }),
      prisma.instructor.count({ where })
    ]);

    return {
      instructors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async findById(id: string) {
    return prisma.instructor.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, isActive: true, createdAt: true }
        },
        schedules: {
          take: 10,
          orderBy: { date: 'desc' },
          include: {
            student: {
              select: { name: true }
            }
          }
        },
        _count: {
          select: { 
            schedules: true,
            evaluations: true,
            evolutionRecords: true
          }
        }
      }
    });
  }

  static async create(data: CreateInstructorInput) {
    const hashedPassword = await hashPassword(data.password);

    return prisma.$transaction(async (tx) => {
      // Create user first
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: 'INSTRUCTOR'
        }
      });

      // Create instructor profile
      const instructor = await tx.instructor.create({
        data: {
          userId: user.id,
          specialties: data.specialties,
          crefito: data.crefito,
          biography: data.biography,
          status: data.status
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, isActive: true }
          }
        }
      });

      return instructor;
    });
  }

  static async update(id: string, data: UpdateInstructorInput) {
    return prisma.$transaction(async (tx) => {
      const instructor = await tx.instructor.findUnique({
        where: { id },
        include: { user: true }
      });

      if (!instructor) {
        throw new Error('Instrutor não encontrado');
      }

      // Update user data if provided
      if (data.name || data.email) {
        await tx.user.update({
          where: { id: instructor.userId },
          data: {
            ...(data.name && { name: data.name }),
            ...(data.email && { email: data.email })
          }
        });
      }

      // Update instructor data
      const updatedInstructor = await tx.instructor.update({
        where: { id },
        data: {
          ...(data.specialties && { specialties: data.specialties }),
          ...(data.crefito && { crefito: data.crefito }),
          ...(data.biography && { biography: data.biography }),
          ...(data.status && { status: data.status })
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, isActive: true }
          }
        }
      });

      return updatedInstructor;
    });
  }

  static async delete(id: string) {
    return prisma.instructor.delete({
      where: { id }
    });
  }

  static async uploadPhoto(id: string, filename: string) {
    return prisma.instructor.update({
      where: { id },
      data: { photo: filename },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  static async getSchedules(instructorId: string) {
    return prisma.schedule.findMany({
      where: { instructorId },
      orderBy: { date: 'desc' },
      include: {
        student: {
          select: { name: true, email: true }
        }
      }
    });
  }
}