import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const hashedPassword = await hashPassword('admin123');
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sarahpilates.com' },
    update: {},
    create: {
      email: 'admin@sarahpilates.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create instructor users
  const instructorPassword = await hashPassword('instructor123');
  
  const sarah = await prisma.user.upsert({
    where: { email: 'sarah@sarahpilates.com' },
    update: {},
    create: {
      email: 'sarah@sarahpilates.com',
      name: 'Sarah Costa Silva',
      password: instructorPassword,
      role: 'INSTRUCTOR',
    },
  });

  const carla = await prisma.user.upsert({
    where: { email: 'carla@sarahpilates.com' },
    update: {},
    create: {
      email: 'carla@sarahpilates.com',
      name: 'Carla Mendes Santos',
      password: instructorPassword,
      role: 'INSTRUCTOR',
    },
  });

  // Create instructor profiles
  const sarahInstructor = await prisma.instructor.upsert({
    where: { userId: sarah.id },
    update: {},
    create: {
      userId: sarah.id,
      specialties: ['Pilates Clássico', 'Pilates Terapêutico', 'Pilates para Idosos'],
      crefito: 'CREFITO-3/123456',
      biography: 'Fisioterapeuta especializada em Pilates com mais de 10 anos de experiência.',
    },
  });

  const carlaInstructor = await prisma.instructor.upsert({
    where: { userId: carla.id },
    update: {},
    create: {
      userId: carla.id,
      specialties: ['Pilates na Gravidez', 'Reabilitação', 'Pilates Funcional'],
      crefito: 'CREFITO-3/654321',
      biography: 'Especialista em reabilitação e Pilates adaptado.',
    },
  });

  console.log('✅ Instructors created');

  // Create sample students
  const students = await Promise.all([
    prisma.student.upsert({
      where: { email: 'ana.silva@email.com' },
      update: {},
      create: {
        name: 'Ana Silva Santos',
        email: 'ana.silva@email.com',
        phone: '(11) 99999-1111',
        birthDate: new Date('1985-03-15'),
        address: 'Rua das Flores, 123 - Vila Mariana, São Paulo - SP',
        emergencyContact: 'João Silva',
        emergencyPhone: '(11) 99999-2222',
        medicalHistory: 'Lombalgia crônica, sem outras comorbidades',
        objectives: 'Fortalecimento do core e alívio das dores lombares',
        plan: 'Mensal - 8 aulas',
        status: 'ACTIVE',
      },
    }),
    prisma.student.upsert({
      where: { email: 'maria.oliveira@email.com' },
      update: {},
      create: {
        name: 'Maria Santos Oliveira',
        email: 'maria.oliveira@email.com',
        phone: '(11) 99999-3333',
        birthDate: new Date('1978-07-22'),
        address: 'Av. Paulista, 456 - Bela Vista, São Paulo - SP',
        emergencyContact: 'Carlos Oliveira',
        emergencyPhone: '(11) 99999-4444',
        medicalHistory: 'Artrose nos joelhos, hipertensão controlada',
        objectives: 'Melhora da flexibilidade e fortalecimento dos membros inferiores',
        plan: 'Mensal - 12 aulas',
        status: 'ACTIVE',
      },
    }),
    prisma.student.upsert({
      where: { email: 'joao.costa@email.com' },
      update: {},
      create: {
        name: 'João Pedro Costa',
        email: 'joao.costa@email.com',
        phone: '(11) 99999-5555',
        birthDate: new Date('1990-11-08'),
        address: 'Rua Augusta, 789 - Consolação, São Paulo - SP',
        emergencyContact: 'Marina Costa',
        emergencyPhone: '(11) 99999-6666',
        medicalHistory: 'Hérnia de disco L4-L5, em tratamento fisioterapêutico',
        objectives: 'Reabilitação da coluna vertebral e prevenção de novas lesões',
        plan: 'Trimestral - 36 aulas',
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log('✅ Students created');

  // Create sample schedules
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  await Promise.all([
    prisma.schedule.create({
      data: {
        studentId: students[0].id,
        instructorId: sarahInstructor.id,
        date: today,
        startTime: '09:00',
        endTime: '10:00',
        type: 'Pilates Solo',
        status: 'CONFIRMED',
        room: 'Sala 1',
        equipment: ['Mat', 'Bola'],
        price: 80,
        paymentStatus: 'PAID',
      },
    }),
    prisma.schedule.create({
      data: {
        studentId: students[1].id,
        instructorId: carlaInstructor.id,
        date: tomorrow,
        startTime: '10:00',
        endTime: '11:00',
        type: 'Pilates Terapêutico',
        status: 'SCHEDULED',
        room: 'Sala 2',
        equipment: ['Mat', 'Theraband'],
        price: 90,
        paymentStatus: 'PENDING',
      },
    }),
  ]);

  console.log('✅ Sample schedules created');

  // Create sample evolution records
  await Promise.all([
    prisma.evolutionRecord.create({
      data: {
        studentId: students[0].id,
        instructorId: sarahInstructor.id,
        session: 1,
        focus: 'Fortalecimento do Core',
        exercisesPerformed: ['Hundred', 'Roll Up', 'Single Leg Circles'],
        progressNotes: 'Boa execução dos exercícios básicos',
        overallRating: 4,
        painLevel: 3,
        mobilityLevel: 3,
        strengthLevel: 2,
        balanceLevel: 3,
        enduranceLevel: 3,
        equipment: ['Mat', 'Bola'],
        duration: 60,
      },
    }),
  ]);

  console.log('✅ Sample evolution records created');
  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });