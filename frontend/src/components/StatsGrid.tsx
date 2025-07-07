import React, { useEffect, useState } from 'react';
import { Users, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { dashboardAPI } from '../services/api';

interface Stats {
  totalStudents: number;
  activeStudents: number;
  totalInstructors: number;
  todaySchedules: number;
  monthlySchedules: number;
  completedSchedules: number;
  monthlyRevenue: number;
  totalEvolutionRecords: number;
}

const StatsGrid = () => {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    activeStudents: 0,
    totalInstructors: 0,
    todaySchedules: 0,
    monthlySchedules: 0,
    completedSchedules: 0,
    monthlyRevenue: 0,
    totalEvolutionRecords: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      title: 'Total de Alunos',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Aulas Hoje',
      value: stats.todaySchedules,
      icon: Calendar,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      change: '+8%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      change: '+15%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Taxa de Conclusão',
      value: stats.monthlySchedules > 0 ? `${Math.round((stats.completedSchedules / stats.monthlySchedules) * 100)}%` : '0%',
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
      change: '+5%',
      changeColor: 'text-green-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-3d animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white p-8 rounded-3xl shadow-3d transition-all duration-500 hover:-translate-y-2 hover:shadow-neon group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                <p className={`text-sm ${stat.changeColor} flex items-center`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;