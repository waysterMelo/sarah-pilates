import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2,
  Clock,
  Users,
  Calendar,
  MapPin,
  Save,
  X,
  AlertCircle
} from 'lucide-react';

interface TimeSlot {
  id: number;
  time: string;
  maxCapacity: number;
  currentBookings: number;
  room: string;
  instructor: string;
  type: string;
}

interface DaySchedule {
  day: string;
  date: string;
  slots: TimeSlot[];
}

const ScheduleCapacity = () => {
  const navigate = useNavigate();
  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>([
    {
      day: 'Segunda-feira',
      date: '2024-12-16',
      slots: [
        { id: 1, time: '07:00', maxCapacity: 12, currentBookings: 8, room: 'Sala 1', instructor: 'Sarah Costa Silva', type: 'Pilates Solo' },
        { id: 2, time: '08:00', maxCapacity: 6, currentBookings: 4, room: 'Sala 2', instructor: 'Carla Mendes Santos', type: 'Pilates Aparelhos' },
        { id: 3, time: '09:00', maxCapacity: 10, currentBookings: 7, room: 'Sala 1', instructor: 'Sarah Costa Silva', type: 'Pilates Solo' },
        { id: 4, time: '10:00', maxCapacity: 8, currentBookings: 6, room: 'Sala 3', instructor: 'Roberto Lima Oliveira', type: 'Pilates Terapêutico' },
        { id: 5, time: '18:00', maxCapacity: 15, currentBookings: 12, room: 'Sala 1', instructor: 'Sarah Costa Silva', type: 'Pilates Solo' },
        { id: 6, time: '19:00', maxCapacity: 8, currentBookings: 5, room: 'Sala 2', instructor: 'Carla Mendes Santos', type: 'Pilates Aparelhos' }
      ]
    },
    {
      day: 'Terça-feira',
      date: '2024-12-17',
      slots: [
        { id: 7, time: '07:00', maxCapacity: 10, currentBookings: 6, room: 'Sala 1', instructor: 'Carla Mendes Santos', type: 'Pilates Solo' },
        { id: 8, time: '08:00', maxCapacity: 6, currentBookings: 3, room: 'Sala 2', instructor: 'Roberto Lima Oliveira', type: 'Pilates Aparelhos' },
        { id: 9, time: '09:00', maxCapacity: 12, currentBookings: 9, room: 'Sala 1', instructor: 'Sarah Costa Silva', type: 'Pilates Solo' },
        { id: 10, time: '18:00', maxCapacity: 8, currentBookings: 4, room: 'Sala 3', instructor: 'Roberto Lima Oliveira', type: 'Pilates Terapêutico' },
        { id: 11, time: '19:00', maxCapacity: 14, currentBookings: 11, room: 'Sala 1', instructor: 'Sarah Costa Silva', type: 'Pilates Solo' }
      ]
    },
    {
      day: 'Quarta-feira',
      date: '2024-12-18',
      slots: [
        { id: 12, time: '07:00', maxCapacity: 10, currentBookings: 7, room: 'Sala 1', instructor: 'Sarah Costa Silva', type: 'Pilates Solo' },
        { id: 13, time: '08:00', maxCapacity: 6, currentBookings: 5, room: 'Sala 2', instructor: 'Carla Mendes Santos', type: 'Pilates Aparelhos' },
        { id: 14, time: '09:00', maxCapacity: 8, currentBookings: 3, room: 'Sala 3', instructor: 'Roberto Lima Oliveira', type: 'Pilates Terapêutico' },
        { id: 15, time: '18:00', maxCapacity: 12, currentBookings: 8, room: 'Sala 1', instructor: 'Sarah Costa Silva', type: 'Pilates Solo' },
        { id: 16, time: '19:00', maxCapacity: 6, currentBookings: 4, room: 'Sala 2', instructor: 'Carla Mendes Santos', type: 'Pilates Aparelhos' }
      ]
    },
    {
      day: 'Quinta-feira',
      date: '2024-12-19',
      slots: [
        { id: 17, time: '07:00', maxCapacity: 8, currentBookings: 5, room: 'Sala 1', instructor: 'Carla Mendes Santos', type: 'Pilates Solo' },
        { id: 18, time: '08:00', maxCapacity: 6, currentBookings: 2, room: 'Sala 2', instructor: 'Roberto Lima Oliveira', type: 'Pilates Aparelhos' },
        { id: 19, time: '09:00', maxCapacity: 10, currentBookings: 8, room: 'Sala 1', instructor: 'Sarah Costa Silva', type: 'Pilates Solo' },
        { id: 20, time: '18:00', maxCapacity: 8, currentBookings: 6, room: 'Sala 3', instructor: 'Roberto Lima Oliveira', type: 'Pilates Terapêutico' },
        { id: 21, time: '19:00', maxCapacity: 12, currentBookings: 9, room: 'Sala 1', instructor: 'Sarah Costa Silva', type: 'Pilates Solo' }
      ]
    },
    {
      day: 'Sexta-feira',
      date: '2024-12-20',
      slots: [
        { id: 22, time: '07:00', maxCapacity: 10, currentBookings: 6, room: 'Sala 1', instructor: 'Sarah Costa Silva', type: 'Pilates Solo' },
        { id: 23, time: '08:00', maxCapacity: 6, currentBookings: 4, room: 'Sala 2', instructor: 'Carla Mendes Santos', type: 'Pilates Aparelhos' },
        { id: 24, time: '09:00', maxCapacity: 8, currentBookings: 5, room: 'Sala 3', instructor: 'Roberto Lima Oliveira', type: 'Pilates Terapêutico' },
        { id: 25, time: '18:00', maxCapacity: 15, currentBookings: 10, room: 'Sala 1', instructor: 'Sarah Costa Silva', type: 'Pilates Solo' },
        { id: 26, time: '19:00', maxCapacity: 8, currentBookings: 6, room: 'Sala 2', instructor: 'Carla Mendes Santos', type: 'Pilates Aparelhos' }
      ]
    },
    {
      day: 'Sábado',
      date: '2024-12-21',
      slots: [
        { id: 27, time: '08:00', maxCapacity: 12, currentBookings: 8, room: 'Sala 1', instructor: 'Sarah Costa Silva', type: 'Pilates Solo' },
        { id: 28, time: '09:00', maxCapacity: 6, currentBookings: 3, room: 'Sala 2', instructor: 'Carla Mendes Santos', type: 'Pilates Aparelhos' },
        { id: 29, time: '10:00', maxCapacity: 10, currentBookings: 7, room: 'Sala 1', instructor: 'Sarah Costa Silva', type: 'Pilates Solo' }
      ]
    }
  ]);

  const [editingSlot, setEditingSlot] = useState<{ dayIndex: number; slotIndex: number } | null>(null);
  const [editCapacity, setEditCapacity] = useState<number>(0);
  const [showAddSlot, setShowAddSlot] = useState<{ dayIndex: number } | null>(null);
  const [newSlot, setNewSlot] = useState({
    time: '',
    maxCapacity: 1,
    room: 'Sala 1',
    instructor: 'Sarah Costa Silva',
    type: 'Pilates Solo'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const instructors = ['Sarah Costa Silva', 'Carla Mendes Santos', 'Roberto Lima Oliveira'];
  const rooms = ['Sala 1', 'Sala 2', 'Sala 3', 'Sala de Aparelhos', 'Sala Terapêutica'];
  const classTypes = ['Pilates Solo', 'Pilates Aparelhos', 'Pilates Terapêutico', 'Pilates para Idosos'];

  const handleEditCapacity = (dayIndex: number, slotIndex: number) => {
    setEditingSlot({ dayIndex, slotIndex });
    setEditCapacity(weekSchedule[dayIndex].slots[slotIndex].maxCapacity);
  };

  const handleSaveCapacity = () => {
    if (editingSlot && editCapacity > 0) {
      const newSchedule = [...weekSchedule];
      newSchedule[editingSlot.dayIndex].slots[editingSlot.slotIndex].maxCapacity = editCapacity;
      setWeekSchedule(newSchedule);
      setEditingSlot(null);
      setEditCapacity(0);
    }
  };

  const handleCancelEdit = () => {
    setEditingSlot(null);
    setEditCapacity(0);
  };

  const handleDeleteSlot = (dayIndex: number, slotIndex: number) => {
    if (window.confirm('Tem certeza que deseja excluir este horário?')) {
      const newSchedule = [...weekSchedule];
      newSchedule[dayIndex].slots.splice(slotIndex, 1);
      setWeekSchedule(newSchedule);
    }
  };

  const validateNewSlot = () => {
    const newErrors: Record<string, string> = {};

    if (!newSlot.time) {
      newErrors.time = 'Horário é obrigatório';
    }

    if (newSlot.maxCapacity < 1) {
      newErrors.maxCapacity = 'Capacidade deve ser maior que zero';
    }

    if (newSlot.maxCapacity > 100) {
      newErrors.maxCapacity = 'Capacidade não pode ser maior que 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSlot = () => {
    if (showAddSlot && validateNewSlot()) {
      const newSchedule = [...weekSchedule];
      const newSlotData: TimeSlot = {
        id: Math.max(...weekSchedule.flatMap(day => day.slots.map(slot => slot.id))) + 1,
        time: newSlot.time,
        maxCapacity: newSlot.maxCapacity,
        currentBookings: 0,
        room: newSlot.room,
        instructor: newSlot.instructor,
        type: newSlot.type
      };
      
      newSchedule[showAddSlot.dayIndex].slots.push(newSlotData);
      newSchedule[showAddSlot.dayIndex].slots.sort((a, b) => a.time.localeCompare(b.time));
      setWeekSchedule(newSchedule);
      setShowAddSlot(null);
      setNewSlot({
        time: '',
        maxCapacity: 1,
        room: 'Sala 1',
        instructor: 'Sarah Costa Silva',
        type: 'Pilates Solo'
      });
      setErrors({});
    }
  };

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 70) return 'text-orange-600 bg-orange-100';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getProgressBarColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTotalCapacity = () => {
    return weekSchedule.reduce((total, day) => 
      total + day.slots.reduce((dayTotal, slot) => dayTotal + slot.maxCapacity, 0), 0
    );
  };

  const getTotalBookings = () => {
    return weekSchedule.reduce((total, day) => 
      total + day.slots.reduce((dayTotal, slot) => dayTotal + slot.currentBookings, 0), 0
    );
  };

  const getAverageOccupancy = () => {
    const totalCapacity = getTotalCapacity();
    const totalBookings = getTotalBookings();
    return totalCapacity > 0 ? Math.round((totalBookings / totalCapacity) * 100) : 0;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/schedule')}
            className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent relative">
              Cronograma de Capacidade
              <div className="absolute -bottom-1 lg:-bottom-2 left-0 w-12 lg:w-16 h-0.5 lg:h-1 bg-primary-gradient rounded-full"></div>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Gerencie a capacidade de cada horário</p>
          </div>
        </div>
      </header>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Capacidade Total</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{getTotalCapacity()}</p>
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
              <p className="text-gray-600 text-sm">Vagas Disponíveis</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{getTotalCapacity() - getTotalBookings()}</p>
            </div>
            <div className="w-6 sm:w-8 h-6 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Taxa de Ocupação</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600">{getAverageOccupancy()}%</p>
            </div>
            <div className="w-6 sm:w-8 h-6 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Cronograma Semanal */}
      <div className="space-y-6 lg:space-y-8">
        {weekSchedule.map((day, dayIndex) => (
          <div key={day.day} className="bg-white rounded-2xl lg:rounded-3xl shadow-3d overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{day.day}</h2>
                <p className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <button
                onClick={() => setShowAddSlot({ dayIndex })}
                className="bg-primary-gradient text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 hover:shadow-lg text-sm min-h-[40px]"
              >
                <Plus className="w-4 h-4" />
                Adicionar Horário
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {day.slots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum horário configurado para este dia</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {day.slots.map((slot, slotIndex) => (
                    <div key={slot.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-800">{slot.time}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditCapacity(dayIndex, slotIndex)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                            title="Editar capacidade"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSlot(dayIndex, slotIndex)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                            title="Excluir horário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {slot.room}
                        </div>
                        <div className="text-sm text-gray-600">{slot.instructor}</div>
                        <div className="text-sm font-medium text-purple-600">{slot.type}</div>
                      </div>

                      {editingSlot?.dayIndex === dayIndex && editingSlot?.slotIndex === slotIndex ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Capacidade Máxima
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={editCapacity}
                              onChange={(e) => setEditCapacity(parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveCapacity}
                              className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors min-h-[36px] flex items-center justify-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              Salvar
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors min-h-[36px] flex items-center justify-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCapacityColor(slot.currentBookings, slot.maxCapacity)}`}>
                              {slot.currentBookings}/{slot.maxCapacity} vagas
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(slot.currentBookings, slot.maxCapacity)}`}
                              style={{ width: `${Math.min((slot.currentBookings / slot.maxCapacity) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal para adicionar novo horário */}
            {showAddSlot?.dayIndex === dayIndex && (
              <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Adicionar Novo Horário</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horário *
                    </label>
                    <input
                      type="time"
                      value={newSlot.time}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, time: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm ${
                        errors.time ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.time && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.time}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacidade Máxima *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newSlot.maxCapacity}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) || 1 }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm ${
                        errors.maxCapacity ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Ex: 12"
                    />
                    {errors.maxCapacity && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.maxCapacity}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sala
                    </label>
                    <select
                      value={newSlot.room}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, room: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                    >
                      {rooms.map((room) => (
                        <option key={room} value={room}>
                          {room}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instrutor
                    </label>
                    <select
                      value={newSlot.instructor}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, instructor: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                    >
                      {instructors.map((instructor) => (
                        <option key={instructor} value={instructor}>
                          {instructor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Aula
                    </label>
                    <select
                      value={newSlot.type}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                    >
                      {classTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAddSlot}
                    className="bg-primary-gradient text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 hover:shadow-lg text-sm min-h-[40px]"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Horário
                  </button>
                  <button
                    onClick={() => {
                      setShowAddSlot(null);
                      setNewSlot({
                        time: '',
                        maxCapacity: 1,
                        room: 'Sala 1',
                        instructor: 'Sarah Costa Silva',
                        type: 'Pilates Solo'
                      });
                      setErrors({});
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 hover:bg-gray-600 text-sm min-h-[40px]"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleCapacity;