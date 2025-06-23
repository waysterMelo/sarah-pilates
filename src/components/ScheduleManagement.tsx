import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  Clock,
  User,
  GraduationCap,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  Users
} from 'lucide-react';
import ScheduleForm from './ScheduleForm';
import ScheduleDetails from './ScheduleDetails';

interface Schedule {
  id: number;
  studentId: number;
  studentName: string;
  instructorId: number;
  instructorName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  status: 'Agendado' | 'Confirmado' | 'Concluído' | 'Cancelado' | 'Falta';
  notes: string;
  room: string;
  equipment: string[];
  price: number;
  paymentStatus: 'Pendente' | 'Pago' | 'Isento';
  createdAt: string;
}

const ScheduleManagement = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: 1,
      studentId: 1,
      studentName: 'Ana Silva Santos',
      instructorId: 1,
      instructorName: 'Sarah Costa Silva',
      date: '2024-12-15',
      startTime: '09:00',
      endTime: '10:00',
      type: 'Pilates Solo',
      status: 'Confirmado',
      notes: 'Foco em fortalecimento do core',
      room: 'Sala 1',
      equipment: ['Mat', 'Bola'],
      price: 80,
      paymentStatus: 'Pago',
      createdAt: '2024-12-10T10:00:00Z'
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Maria Santos Oliveira',
      instructorId: 1,
      instructorName: 'Sarah Costa Silva',
      date: '2024-12-15',
      startTime: '10:00',
      endTime: '11:00',
      type: 'Pilates Aparelhos',
      status: 'Agendado',
      notes: 'Primeira aula com aparelhos',
      room: 'Sala 2',
      equipment: ['Reformer', 'Cadillac'],
      price: 100,
      paymentStatus: 'Pendente',
      createdAt: '2024-12-12T14:30:00Z'
    },
    {
      id: 3,
      studentId: 3,
      studentName: 'João Pedro Costa',
      instructorId: 2,
      instructorName: 'Carla Mendes Santos',
      date: '2024-12-15',
      startTime: '14:00',
      endTime: '15:00',
      type: 'Pilates Terapêutico',
      status: 'Confirmado',
      notes: 'Reabilitação lombar',
      room: 'Sala 3',
      equipment: ['Mat', 'Theraband', 'Bola'],
      price: 90,
      paymentStatus: 'Pago',
      createdAt: '2024-12-11T16:45:00Z'
    },
    {
      id: 4,
      studentId: 1,
      studentName: 'Ana Silva Santos',
      instructorId: 2,
      instructorName: 'Carla Mendes Santos',
      date: '2024-12-14',
      startTime: '15:00',
      endTime: '16:00',
      type: 'Pilates Solo',
      status: 'Concluído',
      notes: 'Excelente evolução',
      room: 'Sala 1',
      equipment: ['Mat', 'Magic Circle'],
      price: 80,
      paymentStatus: 'Pago',
      createdAt: '2024-12-09T11:20:00Z'
    },
    {
      id: 5,
      studentId: 2,
      studentName: 'Maria Santos Oliveira',
      instructorId: 1,
      instructorName: 'Sarah Costa Silva',
      date: '2024-12-13',
      startTime: '11:00',
      endTime: '12:00',
      type: 'Pilates Solo',
      status: 'Falta',
      notes: 'Não compareceu',
      room: 'Sala 1',
      equipment: ['Mat'],
      price: 80,
      paymentStatus: 'Isento',
      createdAt: '2024-12-08T09:15:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterDate, setFilterDate] = useState('');
  const [filterInstructor, setFilterInstructor] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Get unique instructors for filter
  const allInstructors = Array.from(
    new Set(schedules.map(schedule => schedule.instructorName))
  );

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todos' || schedule.status === filterStatus;
    const matchesDate = !filterDate || schedule.date === filterDate;
    const matchesInstructor = filterInstructor === 'Todos' || schedule.instructorName === filterInstructor;
    return matchesSearch && matchesStatus && matchesDate && matchesInstructor;
  });

  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setEditMode(true);
    setShowForm(true);
  };

  const handleViewSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setShowDetails(true);
  };

  const handleDeleteSchedule = (scheduleId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      setSchedules(schedules.filter(s => s.id !== scheduleId));
    }
  };

  const handleSaveSchedule = (scheduleData: Omit<Schedule, 'id'>) => {
    if (editMode && selectedSchedule) {
      setSchedules(schedules.map(s => 
        s.id === selectedSchedule.id 
          ? { ...scheduleData, id: selectedSchedule.id }
          : s
      ));
    } else {
      const newSchedule = {
        ...scheduleData,
        id: Math.max(...schedules.map(s => s.id)) + 1
      };
      setSchedules([...schedules, newSchedule]);
    }
    setShowForm(false);
  };

  const handleStatusChange = (scheduleId: number, newStatus: Schedule['status']) => {
    setSchedules(schedules.map(s => 
      s.id === scheduleId 
        ? { ...s, status: newStatus }
        : s
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendado': return 'text-blue-600 bg-blue-100';
      case 'Confirmado': return 'text-green-600 bg-green-100';
      case 'Concluído': return 'text-purple-600 bg-purple-100';
      case 'Cancelado': return 'text-red-600 bg-red-100';
      case 'Falta': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Pago': return 'text-green-600 bg-green-100';
      case 'Pendente': return 'text-yellow-600 bg-yellow-100';
      case 'Isento': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (time: string) => {
    return time;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTodaySchedules = () => {
    const today = new Date().toISOString().split('T')[0];
    return schedules.filter(s => s.date === today);
  };

  const getUpcomingSchedules = () => {
    const today = new Date().toISOString().split('T')[0];
    return schedules.filter(s => s.date > today && s.status !== 'Cancelado');
  };

  if (showForm) {
    return (
      <ScheduleForm
        schedule={selectedSchedule}
        isEdit={editMode}
        onSave={handleSaveSchedule}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  if (showDetails && selectedSchedule) {
    return (
      <ScheduleDetails
        schedule={selectedSchedule}
        onEdit={() => {
          setShowDetails(false);
          handleEditSchedule(selectedSchedule);
        }}
        onClose={() => setShowDetails(false)}
        onStatusChange={handleStatusChange}
      />
    );
  }

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
              Gestão de Agenda
              <div className="absolute -bottom-1 lg:-bottom-2 left-0 w-12 lg:w-16 h-0.5 lg:h-1 bg-primary-gradient rounded-full"></div>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Gerencie todos os agendamentos do seu estúdio</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/schedule-capacity')}
            className="bg-secondary-gradient text-white px-4 sm:px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 text-sm sm:text-base min-h-[44px] justify-center"
          >
            <Users className="w-5 h-5" />
            Ver Capacidade
          </button>
          <div className="flex bg-white rounded-xl shadow-md overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 sm:px-4 py-2 text-sm font-medium transition-colors min-h-[44px] ${
                viewMode === 'list' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 sm:px-4 py-2 text-sm font-medium transition-colors min-h-[44px] ${
                viewMode === 'calendar' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Calendário
            </button>
          </div>
          <button 
            onClick={handleAddSchedule}
            className="bg-primary-gradient text-white px-4 sm:px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-500 hover:shadow-neon hover:-translate-y-1 text-sm sm:text-base min-h-[44px] justify-center"
          >
            <Plus className="w-5 h-5" />
            Novo Agendamento
          </button>
        </div>
      </header>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-4 sm:p-6 mb-6 lg:mb-8">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por aluno, instrutor, tipo de aula ou sala..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-slate-50 transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:bg-white text-base"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500 text-base"
              >
                <option value="Todos">Todos os Status</option>
                <option value="Agendado">Agendado</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
                <option value="Falta">Falta</option>
              </select>
            </div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500 text-base"
            />
            <select
              value={filterInstructor}
              onChange={(e) => setFilterInstructor(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500 text-base"
            >
              <option value="Todos">Todos Instrutores</option>
              {allInstructors.map((instructor) => (
                <option key={instructor} value={instructor}>
                  {instructor}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 lg:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Hoje</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{getTodaySchedules().length}</p>
            </div>
            <Calendar className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Próximas</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{getUpcomingSchedules().length}</p>
            </div>
            <Clock className="w-6 sm:w-8 h-6 sm:h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Confirmados</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">
                {schedules.filter(s => s.status === 'Confirmado').length}
              </p>
            </div>
            <CheckCircle className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Concluídos</p>
              <p className="text-xl sm:text-2xl font-bold text-indigo-600">
                {schedules.filter(s => s.status === 'Concluído').length}
              </p>
            </div>
            <div className="w-6 sm:w-8 h-6 sm:h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-indigo-500 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Receita Hoje</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                R$ {getTodaySchedules()
                  .filter(s => s.paymentStatus === 'Pago')
                  .reduce((acc, s) => acc + s.price, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="w-6 sm:w-8 h-6 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Agendamentos ({filteredSchedules.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Data/Hora</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Aluno</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Instrutor</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Tipo/Sala</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Pagamento</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Valor</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules
                .sort((a, b) => new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime())
                .map((schedule) => (
                <tr
                  key={schedule.id}
                  className="border-b border-gray-100 transition-all duration-300 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                        <Calendar className="w-4 h-4" />
                        {formatDate(schedule.date)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-gray-800 text-sm sm:text-base">{schedule.studentName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-700 text-sm sm:text-base">{schedule.instructorName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="text-gray-800 font-medium text-sm sm:text-base">{schedule.type}</span>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {schedule.room}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={schedule.status}
                      onChange={(e) => handleStatusChange(schedule.id, e.target.value as Schedule['status'])}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 ${getStatusColor(schedule.status)}`}
                    >
                      <option value="Agendado">Agendado</option>
                      <option value="Confirmado">Confirmado</option>
                      <option value="Concluído">Concluído</option>
                      <option value="Cancelado">Cancelado</option>
                      <option value="Falta">Falta</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(schedule.paymentStatus)}`}>
                      {schedule.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-green-600 text-sm sm:text-base">R$ {schedule.price}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewSchedule(schedule)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditSchedule(schedule)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSchedules.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'Todos' || filterDate || filterInstructor !== 'Todos'
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece criando seu primeiro agendamento'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleManagement;