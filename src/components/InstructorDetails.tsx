import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Award,
  BookOpen,
  Clock,
  DollarSign,
  AlertCircle,
  Star,
  Activity,
  TrendingUp
} from 'lucide-react';

interface WorkingHours {
  start: string;
  end: string;
  available: boolean;
}

interface Instructor {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  specialties: string[];
  certifications: string[];
  experience: string;
  bio: string;
  status: 'Ativo' | 'Inativo' | 'Férias';
  hireDate: string;
  hourlyRate: number;
  workingHours: {
    monday: WorkingHours;
    tuesday: WorkingHours;
    wednesday: WorkingHours;
    thursday: WorkingHours;
    friday: WorkingHours;
    saturday: WorkingHours;
    sunday: WorkingHours;
  };
  totalClasses: number;
  rating: number;
  avatar?: string;
}

interface InstructorDetailsProps {
  instructor: Instructor;
  onEdit: () => void;
  onClose: () => void;
}

const InstructorDetails: React.FC<InstructorDetailsProps> = ({ instructor, onEdit, onClose }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'text-green-600 bg-green-100';
      case 'Inativo': return 'text-gray-600 bg-gray-100';
      case 'Férias': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateWorkingYears = () => {
    const hireDate = new Date(instructor.hireDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - hireDate.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    return diffYears;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Segunda' },
    { key: 'tuesday', label: 'Terça' },
    { key: 'wednesday', label: 'Quarta' },
    { key: 'thursday', label: 'Quinta' },
    { key: 'friday', label: 'Sexta' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={onClose}
            className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent relative">
              Perfil do Instrutor
              <div className="absolute -bottom-2 left-0 w-16 h-1 bg-primary-gradient rounded-full"></div>
            </h1>
            <p className="text-gray-600 mt-2">Informações detalhadas do instrutor</p>
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
        {/* Cabeçalho do Perfil */}
        <div className="bg-white rounded-3xl shadow-3d p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-primary-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {instructor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{instructor.name}</h2>
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(instructor.status)}`}>
                  {instructor.status}
                </span>
                <span className="text-gray-600">ID: {instructor.id}</span>
                <span className="text-gray-600">{calculateAge(instructor.birthDate)} anos</span>
                <span className="text-gray-600">{calculateWorkingYears()} anos no estúdio</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  {instructor.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  {instructor.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  R$ {instructor.hourlyRate}/hora
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-3d">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-800">{instructor.totalClasses.toLocaleString()}</span>
            </div>
            <p className="text-gray-600 text-sm">Total de Aulas</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-3d">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                {renderStars(instructor.rating)}
              </div>
              <span className="text-2xl font-bold text-gray-800">{instructor.rating.toFixed(1)}</span>
            </div>
            <p className="text-gray-600 text-sm">Avaliação Média</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-3d">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold text-gray-800">{instructor.specialties.length}</span>
            </div>
            <p className="text-gray-600 text-sm">Especialidades</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-3d">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-gray-800">156</span>
            </div>
            <p className="text-gray-600 text-sm">Aulas este mês</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dados Pessoais */}
          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Dados Pessoais</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Nome Completo</label>
                <p className="text-gray-800 font-medium">{instructor.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Data de Nascimento</label>
                <p className="text-gray-800">{formatDate(instructor.birthDate)} ({calculateAge(instructor.birthDate)} anos)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-gray-800">{instructor.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Telefone</label>
                <p className="text-gray-800">{instructor.phone}</p>
              </div>
              
              {instructor.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Endereço</label>
                  <p className="text-gray-800">{instructor.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contato de Emergência */}
          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Informações Profissionais</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Contato de Emergência</label>
                <p className="text-gray-800 font-medium">{instructor.emergencyContact}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Telefone de Emergência</label>
                <p className="text-gray-800">{instructor.emergencyPhone}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Data de Contratação</label>
                <p className="text-gray-800">{formatDate(instructor.hireDate)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Valor por Hora</label>
                <p className="text-gray-800 font-medium text-green-600">R$ {instructor.hourlyRate.toFixed(2)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(instructor.status)}`}>
                  {instructor.status}
                </span>
              </div>
            </div>
          </div>

          {/* Especialidades */}
          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Especialidades</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {instructor.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Certificações */}
          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Certificações</h3>
            </div>

            <div className="space-y-3">
              {instructor.certifications.length > 0 ? (
                instructor.certifications.map((certification, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Award className="w-5 h-5 text-green-500" />
                    <span className="text-gray-800">{certification}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">Nenhuma certificação registrada</p>
              )}
            </div>
          </div>
        </div>

        {/* Horários de Trabalho */}
        <div className="bg-white rounded-3xl shadow-3d p-8 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Horários de Trabalho</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {daysOfWeek.map(({ key, label }) => {
              const daySchedule = instructor.workingHours[key as keyof typeof instructor.workingHours];
              return (
                <div key={key} className="p-4 border border-gray-200 rounded-xl">
                  <h4 className="font-medium text-gray-800 mb-2">{label}</h4>
                  {daySchedule.available ? (
                    <div className="text-sm text-gray-600">
                      <p>{daySchedule.start} - {daySchedule.end}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Não disponível</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Experiência e Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Experiência</h3>
            </div>

            <div>
              {instructor.experience ? (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-800 leading-relaxed">{instructor.experience}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">Nenhuma experiência registrada</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Biografia</h3>
            </div>

            <div>
              {instructor.bio ? (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-800 leading-relaxed">{instructor.bio}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">Nenhuma biografia registrada</p>
              )}
            </div>
          </div>
        </div>

        {/* Histórico de Performance (Placeholder) */}
        <div className="bg-white rounded-3xl shadow-3d p-8 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Performance Recente</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">42</p>
              <p className="text-sm text-gray-600">Aulas esta semana</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600">98%</p>
              <p className="text-sm text-gray-600">Taxa de presença</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="text-2xl font-bold text-purple-600">4.9</p>
              <p className="text-sm text-gray-600">Avaliação média</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetails;