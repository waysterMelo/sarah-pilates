// Mock API service for dashboard data
// This replaces the backend API calls with mock data

export const dashboardAPI = {
  // Mock function to get dashboard stats
  getStats: async () => {
    return {
      totalStudents: 156,
      activeClasses: 24,
      monthlyRevenue: 12480,
      completedClasses: 324
    };
  },

  // Mock function to get recent schedules
  getRecentSchedules: async () => {
    return [
      {
        id: 1,
        studentName: 'Ana Silva Santos',
        instructorName: 'Sarah Costa Silva',
        time: '09:00',
        type: 'Pilates Solo',
        status: 'Confirmado'
      },
      {
        id: 2,
        studentName: 'Maria Santos Oliveira',
        instructorName: 'Carla Mendes Santos',
        time: '10:00',
        type: 'Pilates Aparelhos',
        status: 'Agendado'
      },
      {
        id: 3,
        studentName: 'João Pedro Costa',
        instructorName: 'Roberto Lima Oliveira',
        time: '14:00',
        type: 'Pilates Terapêutico',
        status: 'Confirmado'
      }
    ];
  }
};