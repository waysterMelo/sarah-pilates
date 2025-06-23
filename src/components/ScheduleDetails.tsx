import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  GraduationCap, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  Phone,
  Mail
} from 'lucide-react';

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

interface ScheduleDetailsProps {
  schedule: Schedule;
  onEdit: () => void;
  onClose: () => void;
  onStatusChange: (scheduleId: number, newStatus: Schedule['status']) => void;
}

const ScheduleDetails: React.FC<ScheduleDetailsProps> = ({ schedule, onEdit, onClose, onStatusChange }) => {
  const navigate = useNavigate();

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('pt-BR');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Agendado': return <Clock className="w-5 h-5" />;
      case 'Confirmado': return <CheckCircle className="w-5 h-5" />;
      case 'Concluído': return <CheckCircle className="w-5 h-5" />;
      case 'Cancelado': return <XCircle className="w-5 h-5" />;
      case 'Falta': return <AlertCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent relative">
              Detalhes do Agendamento
              <div className="absolute -bottom-2 left-0 w-16 h-1 bg-primary-gradient rounded-full"></div>
            </h1>
            <p className="text-gray-600 mt-2">Informações completas do agendamento</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="bg-primary-gradient text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-500 hover:shadow-neon hover:-translate-y-1"
        >
          <Edit className="w-5 h-5" />
          Editar
        </button>
      </header>

      <div className="max-w-6xl">
        {/* Cabeçalho do Agendamento */}
        <div className="bg-white rounded-3xl shadow-3d p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center text-white text-xl font-bold">
                {schedule.type.split(' ').map(word => word[0]).join('')}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{schedule.type}</h2>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(schedule.status)}`}>
                    {getStatusIcon(schedule.status)}
                    {schedule.status}
                  </span>
                  <span className="text-gray-600">ID: {schedule.id}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-600">R$ {schedule.price}</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(schedule.paymentStatus)}`}>
                {schedule.paymentStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Data</p>
                <p className="font-semibold text-gray-800">{formatDate(schedule.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Clock className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Horário</p>
                <p className="font-semibold text-gray-800">
                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <MapPin className="w-6 h-6 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Local</p>
                <p className="font-semibold text-gray-800">{schedule.room}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-3xl shadow-3d p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Ações Rápidas</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onStatusChange(schedule.id, 'Confirmado')}
              disabled={schedule.status === 'Confirmado'}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-medium transition-all duration-300 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Aula
            </button>
            <button
              onClick={() => onStatusChange(schedule.id, 'Concluído')}
              disabled={schedule.status === 'Concluído'}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium transition-all duration-300 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Marcar como Concluída
            </button>
            <button
              onClick={() => onStatusChange(schedule.id, 'Falta')}
              disabled={schedule.status === 'Falta'}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-medium transition-all duration-300 hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Marcar Falta
            </button>
            <button
              onClick={() => onStatusChange(schedule.id, 'Cancelado')}
              disabled={schedule.status === 'Cancelado'}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-medium transition-all duration-300 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar Aula
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações do Aluno */}
          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Informações do Aluno</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center text-white font-semibold">
                  {schedule.studentName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{schedule.studentName}</p>
                  <p className="text-sm text-gray-600">ID: {schedule.studentId}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">ana.silva@email.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">(11) 99999-9999</span>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Instrutor */}
          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Informações do Instrutor</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary-gradient rounded-full flex items-center justify-center text-white font-semibold">
                  {schedule.instructorName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{schedule.instructorName}</p>
                  <p className="text-sm text-gray-600">ID: {schedule.instructorId}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">sarah.costa@email.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">(11) 88888-8888</span>
                </div>
              </div>
            </div>
          </div>

          {/* Equipamentos */}
          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Equipamentos Utilizados</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {schedule.equipment.length > 0 ? (
                schedule.equipment.map((equipment, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {equipment}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">Nenhum equipamento específico</p>
              )}
            </div>
          </div>

          {/* Informações Financeiras */}
          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Informações Financeiras</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Valor da Aula</span>
                <span className="text-xl font-bold text-green-600">R$ {schedule.price}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Status do Pagamento</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(schedule.paymentStatus)}`}>
                  {schedule.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Data de Criação</span>
                <span className="text-sm text-gray-800">{formatDateTime(schedule.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Observações */}
        {schedule.notes && (
          <div className="bg-white rounded-3xl shadow-3d p-8 mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Observações</h3>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-800 leading-relaxed">{schedule.notes}</p>
            </div>
          </div>
        )}

        {/* Histórico de Status (Placeholder) */}
        <div className="bg-white rounded-3xl shadow-3d p-8 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Histórico de Status</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Agendamento criado</p>
                <p className="text-sm text-gray-600">{formatDateTime(schedule.createdAt)}</p>
              </div>
            </div>
            {schedule.status !== 'Agendado' && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className={`w-2 h-2 rounded-full ${
                  schedule.status === 'Confirmado' ? 'bg-green-500' :
                  schedule.status === 'Concluído' ? 'bg-purple-500' :
                  schedule.status === 'Cancelado' ? 'bg-red-500' :
                  'bg-orange-500'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Status alterado para {schedule.status}</p>
                  <p className="text-sm text-gray-600">Hoje às 14:30</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetails;