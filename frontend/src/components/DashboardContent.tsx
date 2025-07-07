import React from 'react';
import StatsGrid from './StatsGrid';
import ScheduleTable from './ScheduleTable';
import QuickActions from './QuickActions';
import { Plus } from 'lucide-react';

const DashboardContent = () => {
  return (
    <main className="flex-1 p-10 bg-slate-50">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent relative">
            Visão Geral
            <div className="absolute -bottom-2 left-0 w-16 h-1 bg-primary-gradient rounded-full"></div>
          </h1>
        </div>
        <button className="bg-primary-gradient text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-500 hover:shadow-neon hover:-translate-y-1">
          <Plus className="w-5 h-5" />
          Nova Aula
        </button>
      </header>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Schedule Table */}
      <ScheduleTable />

      {/* Quick Actions */}
      <QuickActions />
    </main>
  );
};

export default DashboardContent;