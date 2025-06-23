import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  User,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  maxCapacity: number;
  currentBookings: number;
  bookings: {
    id: number;
    studentName: string;
    instructorName: string;
    type: string;
    status: 'Confirmado' | 'Agendado' | 'Cancelado';
  }[];
}

interface DaySchedule {
  date: string;
  timeSlots: TimeSlot[];
}

const ScheduleCapacity = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  // Horário de funcionamento: 6h às 21h com intervalos de 1h
  // Intervalo de 15 minutos entre sessões para higienização
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 6;
    const endHour = 21;
    
    for (let hour = startHour; hour < endHour; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const endTimeString = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      slots.push({
        id: `slot-${hour}`,
        time: `${timeString} - ${endTimeString}`,
        maxCapacity: 8,
        currentBookings: Math.floor(Math.random() * 9), // Simulação de dados
        bookings: generateMockBookings(Math.floor(Math.random() * 9))
      });
    }
    
    return slots;
  };

  const generateMockBookings = (count: number) => {
    const mockStudents = [
      'Ana Silva Santos', 'Maria Santos Oliveira', 'João Pedro Costa',
      'Carla Mendes', 'Roberto Lima', 'Patricia Fernandes',
      'Lucas Oliveira', 'Fernanda Costa', 'Ricardo Santos'
    ];
    
    const mockInstructors = ['Sarah Costa Silva', 'Carla Mendes Santos', 'Roberto Lima Oliveira'];
    const mockTypes = ['Pilates Solo', 'Pilates Aparelhos', 'Pilates Terapêutico'];
    const mockStatuses: ('Confirmado' | 'Agendado' | 'Cancelado')[] = ['Confirmado', 'Agendado', 'Cancelado'];
    
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      studentName: mockStudents[Math.floor(Math.random() * mockStudents.length)],
      instructorName: mockInstructors[Math.floor(Math.random() * mockInstructors.length)],
      type: mockTypes[Math.floor(Math.random() * mockTypes.length)],
      status: mockStatuses[Math.floor(Math.random() * mockStatuses.length)]
    }));
  };

  const [daySchedule] = useState<DaySchedule>({
    date: selectedDate,
    timeSlots: generateTimeSlots()
  });

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage === 100) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCapacityStatus = (current: number, max: number) => {
    if (current >= max) return { text: 'Lotado', color: 'text-red-600 bg-red-100', icon: XCircle };
    if (current >= max * 0.75) return { text: 'Quase Lotado', color: 'text-orange-600 bg-orange-100', icon: AlertCircle };
    return { text: 'Disponível', color: 'text-green-600 bg-green-100', icon: CheckCircle };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const changeDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const getTotalBookings = () => {
    return daySchedule.timeSlots.reduce((total, slot) => total + slot.currentBookings, 0);
  };

  const getTotalCapacity = () => {
    return daySchedule.timeSlots.length * 8;
  };

  const getAvailableSlots = () => {
    return daySchedule.timeSlots.filter(slot => slot.currentBookings < slot.maxCapacity).length;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent relative">
              Cronograma de Capacidade
              <div className="absolute -bottom-1 lg:-bottom-2 left-0 w-12 lg:w-16 h-0.5 lg:h-1 bg-primary-gradient rounded-full"></div>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Controle de vagas e capacidade por horário
            </p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/schedule')}
          className="bg-primary-gradient text-white px-4 sm:px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-500 hover:shadow-neon hover:-translate-y-1 text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" />
          Novo Agendamento
        </button>
      </header>

      {/* Controles de Data */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-4 sm:p-6 mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => changeDate('prev')}
              className="p-2 sm:p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {formatDate(selectedDate)}
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <button
              onClick={() => changeDate('next')}
              className="p-2 sm:p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex bg-white rounded-xl shadow-md overflow-hidden">
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 text-sm font-medium transition-colors min-h-[44px] ${
                viewMode === 'day' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 text-sm font-medium transition-colors min-h-[44px] ${
                viewMode === 'week' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Semana
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas do Dia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Capacidade Total</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{getTotalCapacity()}</p>
            </div>
            <Users className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Agendamentos</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{getTotalBookings()}</p>
            </div>
            <Calendar className="w-6 sm:w-8 h-6 sm:h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Horários Disponíveis</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{getAvailableSlots()}</p>
            </div>
            <Clock className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Taxa de Ocupação</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600">
                {Math.round((getTotalBookings() / getTotalCapacity()) * 100)}%
              </p>
            </div>
            <div className="w-6 sm:w-8 h-6 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grade de Horários */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Cronograma do Dia - Capacidade por Horário
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Horário de funcionamento: 06:00 às 21:00 | Capacidade máxima: 8 pessoas por horário
          </p>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {daySchedule.timeSlots.map((slot) => {
              const status = getCapacityStatus(slot.currentBookings, slot.maxCapacity);
              const StatusIcon = status.icon;
              
              return (
                <div
                  key={slot.id}
                  className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
                >
                  {/* Cabeçalho do Horário */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary-500" />
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">
                        {slot.time}
                      </span>
                    </div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.text}
                    </span>
                  </div>

                  {/* Indicador de Capacidade */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Ocupação</span>
                      <span className="text-sm font-medium text-gray-800">
                        {slot.currentBookings}/{slot.maxCapacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getCapacityColor(slot.currentBookings, slot.maxCapacity)}`}
                        style={{ width: `${(slot.currentBookings / slot.maxCapacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Vagas Visuais */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Vagas:</p>
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: slot.maxCapacity }, (_, index) => (
                        <div
                          key={index}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            index < slot.currentBookings
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {index < slot.currentBookings ? (
                            <User className="w-3 h-3" />
                          ) : (
                            index + 1
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lista de Agendamentos */}
                  {slot.bookings.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-500 mb-2">Agendamentos:</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {slot.bookings.slice(0, 3).map((booking) => (
                          <div
                            key={booking.id}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-gray-700 truncate">
                              {booking.studentName}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'Confirmado' ? 'bg-green-100 text-green-600' :
                              booking.status === 'Agendado' ? 'bg-blue-100 text-blue-600' :
                              'bg-red-100 text-red-600'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        ))}
                        {slot.bookings.length > 3 && (
                          <p className="text-xs text-gray-500 italic">
                            +{slot.bookings.length - 3} mais...
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Botão de Ação */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {slot.currentBookings < slot.maxCapacity ? (
                      <button
                        onClick={() => navigate('/schedule')}
                        className="w-full bg-primary-gradient text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      >
                        Agendar ({slot.maxCapacity - slot.currentBookings} vagas)
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-200 text-gray-500 py-2 px-4 rounded-lg text-sm font-medium cursor-not-allowed"
                      >
                        Horário Lotado
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-4 sm:p-6 mt-6 lg:mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Legenda</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Disponível (0-49%)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Moderado (50-74%)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Quase Lotado (75-99%)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Lotado (100%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCapacity;