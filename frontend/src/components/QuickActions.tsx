import React from 'react';
import { UserPlus, TrendingUp, Bell } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: 'Novo Cliente',
      icon: UserPlus,
      color: 'text-blue-500',
    },
    {
      title: 'Relatórios',
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Notificações',
      icon: Bell,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <div
            key={index}
            className="bg-white p-8 rounded-3xl shadow-3d text-center transition-all duration-500 hover:-translate-y-2 hover:bg-secondary-gradient hover:text-white group cursor-pointer"
          >
            <Icon className={`w-10 h-10 mx-auto mb-4 ${action.color} group-hover:text-white group-hover:animate-float transition-colors duration-300`} />
            <h3 className="text-lg font-semibold group-hover:text-white transition-colors duration-300">
              {action.title}
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export default QuickActions;