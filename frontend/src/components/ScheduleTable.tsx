import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, GraduationCap, MapPin } from 'lucide-react';
import { dashboardAPI } from '../services/api';

interface Schedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  status: string;
  room: string;
  student: {
    name: string;
  };
  instructor: {
    user: {
      name: string;
    };
  };
}

const ScheduleTable = () => {
  const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const [today, upcoming] = await Promise.all([
          dashboardAPI.getTodaySchedules(),
          dashboardAPI.getUpcomingSchedules()
        ]);
        setTodaySchedules(today);
        setUpcomingSchedules(upcoming);
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'text-blue-600 bg-blue-100';
      case 'CONFIRMED': return 'text-green-600 bg-green-100';
      case 'COMPLETED': return 'text-purple-600 bg-purple-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      case 'NO_SHOW': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'Agendado';
      case 'CONFIRMED': return 'Confirmado';
      case 'COMPLETED': return 'Concluído';
      case 'CANCELLED': return 'Cancelado';
      case 'NO_SHOW': return 'Falta';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-3d p-8 mb-10">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      {/* Agendamentos de Hoje */}
      <div className="bg-white rounded-3xl shadow-3d p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-3 text-blue-500" />
          Agendamentos de Hoje
        </h2>
        
        {todaySchedules.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum agendamento para hoje</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaySchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-800">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                    {getStatusText(schedule.status)}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{schedule.student.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{schedule.instructor.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{schedule.room} • {schedule.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Próximos Agendamentos */}
      <div className="bg-white rounded-3xl shadow-3d p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Clock className="w-6 h-6 mr-3 text-green-500" />
          Próximos Agendamentos
        </h2>
        
        {upcomingSchedules.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum agendamento próximo</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingSchedules.slice(0, 5).map((schedule) => (
              <div
                key={schedule.id}
                className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-800">
                      {formatDate(schedule.date)} • {schedule.startTime}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                    {getStatusText(schedule.status)}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{schedule.student.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{schedule.instructor.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{schedule.room} • {schedule.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleTable;