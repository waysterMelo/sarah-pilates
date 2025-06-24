import prisma from '../config/database';
import { 
  CreateScheduleInput, 
  UpdateScheduleInput, 
  GetSchedulesQuery,
  UpdateScheduleStatusInput
} from '../schemas/schedules.schema';

export class SchedulesService {
  static async findMany(query: GetSchedulesQuery) {
    const { page, limit, search, status, studentId, instructorId, date, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { student: { name: { contains: search, mode: 'insensitive' } } },
        { instructor: { user: { name: { contains: search, mode: 'insensitive' } } } },
        { type: { contains: search, mode: 'insensitive' } },
        { room: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (studentId) {
      where.studentId = studentId;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      where.date = {
        gte: startOfDay,
        lte: endOfDay
      };
    } else if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [schedules, total] = await Promise.all([
      prisma.schedule.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { date: 'desc' },
          { startTime: 'asc' }
        ],
        include: {
          student: {
            select: { id: true, name: true, email: true, phone: true }
          },
          instructor: {
            include: { user: { select: { name: true, email: true } } }
          }
        }
      }),
      prisma.schedule.count({ where })
    ]);

    return {
      schedules,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async findById(id: string) {
    return prisma.schedule.findUnique({
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

  static async create(data: CreateScheduleInput) {
    return prisma.schedule.create({
      data: {
        ...data,
        date: new Date(data.date),
        equipment: data.equipment || []
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

  static async update(id: string, data: UpdateScheduleInput) {
    const updateData: any = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }

    return prisma.schedule.update({
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
    return prisma.schedule.delete({
      where: { id }
    });
  }

  static async updateStatus(id: string, status: UpdateScheduleStatusInput['status']) {
    return prisma.schedule.update({
      where: { id },
      data: { status },
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

  static async getCapacityByDate(date: string) {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const schedules = await prisma.schedule.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          not: 'CANCELLED'
        }
      },
      include: {
        student: {
          select: { name: true }
        },
        instructor: {
          include: { user: { select: { name: true } } }
        }
      },
      orderBy: { startTime: 'asc' }
    });

    // Group by time slots
    const timeSlots: any = {};
    schedules.forEach(schedule => {
      const timeKey = `${schedule.startTime}-${schedule.endTime}`;
      if (!timeSlots[timeKey]) {
        timeSlots[timeKey] = [];
      }
      timeSlots[timeKey].push(schedule);
    });

    return {
      date,
      totalSchedules: schedules.length,
      timeSlots,
      schedules
    };
  }
}