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
  FileText,
  Target,
  AlertCircle,
  Activity,
  Clock,
  Award
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory: string;
  objectives: string;
  plan: string;
  status: 'Ativo' | 'Inativo' | 'Suspenso';
  registrationDate: string;
  lastClass: string;
  totalClasses: number;
}

interface StudentDetailsProps {
  student: Student;
  onEdit: () => void;
  onClose: () => void;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ student, onEdit, onClose }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'text-green-600 bg-green-100';
      case 'Inativo': return 'text-gray-600 bg-gray-100';
      case 'Suspenso': return 'text-red-600 bg-red-100';
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

  const daysSinceLastClass = () => {
    const lastClass = new Date(student.lastClass);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastClass.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
              Perfil do Aluno
              <div className="absolute -bottom-2 left-0 w-16 h-1 bg-primary-gradient rounded-full"></div>
            </h1>
            <p className="text-gray-600 mt-2">Informações detalhadas do aluno</p>
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
              {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{student.name}</h2>
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(student.status)}`}>
                  {student.status}
                </span>
                <span className="text-gray-600">ID: {student.id}</span>
                <span className="text-gray-600">{calculateAge(student.birthDate)} anos</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  {student.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  {student.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  Desde {formatDate(student.registrationDate)}
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
              <span className="text-2xl font-bold text-gray-800">{student.totalClasses}</span>
            </div>
            <p className="text-gray-600 text-sm">Total de Aulas</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-3d">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-gray-800">{daysSinceLastClass()}</span>
            </div>
            <p className="text-gray-600 text-sm">Dias desde última aula</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-3d">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold text-gray-800">95%</span>
            </div>
            <p className="text-gray-600 text-sm">Taxa de Presença</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-3d">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-800">8</span>
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
                <p className="text-gray-800 font-medium">{student.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Data de Nascimento</label>
                <p className="text-gray-800">{formatDate(student.birthDate)} ({calculateAge(student.birthDate)} anos)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-gray-800">{student.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Telefone</label>
                <p className="text-gray-800">{student.phone}</p>
              </div>
              
              {student.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Endereço</label>
                  <p className="text-gray-800">{student.address}</p>
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
              <h3 className="text-xl font-semibold text-gray-800">Contato de Emergência</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Nome do Contato</label>
                <p className="text-gray-800 font-medium">{student.emergencyContact}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Telefone</label>
                <p className="text-gray-800">{student.emergencyPhone}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Plano Atual</label>
                <p className="text-gray-800 font-medium">{student.plan}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Data de Cadastro</label>
                <p className="text-gray-800">{formatDate(student.registrationDate)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Última Aula</label>
                <p className="text-gray-800">{formatDate(student.lastClass)}</p>
              </div>
            </div>
          </div>

          {/* Informações Médicas */}
          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Informações Médicas</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Histórico Médico</label>
              {student.medicalHistory ? (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-800 leading-relaxed">{student.medicalHistory}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">Nenhuma informação médica registrada</p>
              )}
            </div>
          </div>

          {/* Objetivos */}
          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Objetivos</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Objetivos com o Pilates</label>
              {student.objectives ? (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-800 leading-relaxed">{student.objectives}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">Nenhum objetivo específico registrado</p>
              )}
            </div>
          </div>
        </div>

        {/* Histórico de Aulas (Placeholder) */}
        <div className="bg-white rounded-3xl shadow-3d p-8 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Histórico de Aulas Recentes</h3>
          <div className="space-y-4">
            {[
              { date: '2024-12-10', instructor: 'Sarah Costa', type: 'Pilates Solo', status: 'Concluída' },
              { date: '2024-12-08', instructor: 'Carla Mendes', type: 'Pilates Aparelhos', status: 'Concluída' },
              { date: '2024-12-05', instructor: 'Sarah Costa', type: 'Pilates Solo', status: 'Concluída' },
              { date: '2024-12-03', instructor: 'Carla Mendes', type: 'Pilates Aparelhos', status: 'Falta' },
            ].map((aula, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-800">{aula.type}</p>
                    <p className="text-sm text-gray-600">Instrutor: {aula.instructor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{formatDate(aula.date)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    aula.status === 'Concluída' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {aula.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;