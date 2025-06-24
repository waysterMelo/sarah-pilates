import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { startOfDay, endOfDay, addDays } from '../utils/date';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Obter estatísticas gerais do dashboard
 *     tags: [Dashboard]
 */
router.get('/stats', async (req, res) => {
  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalStudents,
    activeStudents,
    totalInstructors,
    todaySchedules,
    monthlySchedules,
    completedSchedules,
    monthlyRevenue,
    totalEvolutionRecords
  ] = await Promise.all([
    prisma.student.count(),
    prisma.student.count({ where: { status: 'ACTIVE' } }),
    prisma.instructor.count({ where: { status: 'ACTIVE' } }),
    prisma.schedule.count({
      where: {
        date: {
          gte: startOfToday,
          lte: endOfToday
        }
      }
    }),
    prisma.schedule.count({
      where: {
        date: {
          gte: startOfMonth
        }
      }
    }),
    prisma.schedule.count({
      where: {
        status: 'COMPLETED',
        date: {
          gte: startOfMonth
        }
      }
    }),
    prisma.schedule.aggregate({
      where: {
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        date: {
          gte: startOfMonth
        }
      },
      _sum: {
        price: true
      }
    }),
    prisma.evolutionRecord.count()
  ]);

  res.json({
    totalStudents,
    activeStudents,
    totalInstructors,
    todaySchedules,
    monthlySchedules,
    completedSchedules,
    monthlyRevenue: monthlyRevenue._sum.price || 0,
    totalEvolutionRecords
  });
});

/**
 * @swagger
 * /api/dashboard/revenue:
 *   get:
 *     summary: Obter dados de receita por período
 *     tags: [Dashboard]
 */
router.get('/revenue', async (req, res) => {
  const { period = 'month' } = req.query;
  const today = new Date();
  let startDate: Date;

  switch (period) {
    case 'week':
      startDate = addDays(today, -7);
      break;
    case 'month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(today.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  const revenue = await prisma.schedule.groupBy({
    by: ['date'],
    where: {
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      date: {
        gte: startDate
      }
    },
    _sum: {
      price: true
    },
    orderBy: {
      date: 'asc'
    }
  });

  res.json(revenue);
});

/**
 * @swagger
 * /api/dashboard/schedules/today:
 *   get:
 *     summary: Obter agendamentos de hoje
 *     tags: [Dashboard]
 */
router.get('/schedules/today', async (req, res) => {
  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);

  const schedules = await prisma.schedule.findMany({
    where: {
      date: {
        gte: startOfToday,
        lte: endOfToday
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
    orderBy: {
      startTime: 'asc'
    }
  });

  res.json(schedules);
});

/**
 * @swagger
 * /api/dashboard/schedules/upcoming:
 *   get:
 *     summary: Obter próximos agendamentos
 *     tags: [Dashboard]
 */
router.get('/schedules/upcoming', async (req, res) => {
  const tomorrow = addDays(new Date(), 1);
  const nextWeek = addDays(new Date(), 7);

  const schedules = await prisma.schedule.findMany({
    where: {
      date: {
        gte: tomorrow,
        lte: nextWeek
      },
      status: {
        in: ['SCHEDULED', 'CONFIRMED']
      }
    },
    include: {
      student: {
        select: { name: true, phone: true }
      },
      instructor: {
        include: { user: { select: { name: true } } }
      }
    },
    orderBy: [
      { date: 'asc' },
      { startTime: 'asc' }
    ],
    take: 10
  });

  res.json(schedules);
});

/**
 * @swagger
 * /api/dashboard/students/active:
 *   get:
 *     summary: Obter alunos ativos recentes
 *     tags: [Dashboard]
 */
router.get('/students/active', async (req, res) => {
  const students = await prisma.student.findMany({
    where: {
      status: 'ACTIVE'
    },
    orderBy: {
      lastClass: 'desc'
    },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      lastClass: true,
      totalClasses: true
    }
  });

  res.json(students);
});

/**
 * @swagger
 * /api/dashboard/reports/monthly:
 *   get:
 *     summary: Obter relatório mensal
 *     tags: [Dashboard]
 */
router.get('/reports/monthly', async (req, res) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [
    monthlyStats,
    topStudents,
    instructorStats
  ] = await Promise.all([
    // Monthly stats
    Promise.all([
      prisma.schedule.count({
        where: {
          date: { gte: startOfMonth, lte: endOfMonth }
        }
      }),
      prisma.schedule.count({
        where: {
          date: { gte: startOfMonth, lte: endOfMonth },
          status: 'COMPLETED'
        }
      }),
      prisma.schedule.aggregate({
        where: {
          date: { gte: startOfMonth, lte: endOfMonth },
          status: 'COMPLETED',
          paymentStatus: 'PAID'
        },
        _sum: { price: true }
      })
    ]),
    // Top students by classes
    prisma.schedule.groupBy({
      by: ['studentId'],
      where: {
        date: { gte: startOfMonth, lte: endOfMonth },
        status: 'COMPLETED'
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    }),
    // Instructor stats
    prisma.schedule.groupBy({
      by: ['instructorId'],
      where: {
        date: { gte: startOfMonth, lte: endOfMonth },
        status: 'COMPLETED'
      },
      _count: {
        id: true
      },
      _sum: {
        price: true
      }
    })
  ]);

  const [totalClasses, completedClasses, revenue] = monthlyStats;

  res.json({
    month: {
      totalClasses,
      completedClasses,
      revenue: revenue._sum.price || 0,
      completionRate: totalClasses > 0 ? (completedClasses / totalClasses) * 100 : 0
    },
    topStudents,
    instructorStats
  });
});

export default router;