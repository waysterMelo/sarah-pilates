import React from 'react';
import { Users, Clock, Wallet } from 'lucide-react';

const StatsGrid = () => {
  const stats = [
    {
      title: 'Alunos Ativos',
      value: '68',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Aulas Hoje',
      value: '15',
      icon: Clock,
      color: 'text-green-500',
    },
    {
      title: 'Faturamento Mensal',
      value: 'R$ 28,5K',
      icon: Wallet,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white p-8 rounded-3xl shadow-3d relative overflow-hidden transition-all duration-500 hover:-translate-y-2 group"
          >
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 bg-primary-gradient opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-medium">{stat.title}</h3>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <p className="text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;