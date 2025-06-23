import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  Phone,
  Mail,
  Calendar,
  Award,
  Clock,
  Star,
  User,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import InstructorForm from './InstructorForm';
import InstructorDetails from './InstructorDetails';

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
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  totalClasses: number;
  rating: number;
  avatar?: string;
}

const InstructorManagement = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState<Instructor[]>([
    {
      id: 1,
      name: 'Sarah Costa Silva',
      email: 'sarah.costa@email.com',
      phone: '(11) 99999-9999',
      birthDate: '1985-05-20',
      address: 'Rua das Palmeiras, 456 - São Paulo/SP',
      emergencyContact: 'Carlos Costa',
      emergencyPhone: '(11) 88888-8888',
      specialties: ['Pilates Solo', 'Pilates Aparelhos', 'Pilates Terapêutico'],
      certifications: ['Certificação Romana\'s Pilates', 'Formação em Pilates Clínico', 'Workshop Pilates na Gravidez'],
      experience: '8 anos de experiência em pilates, especializada em reabilitação e condicionamento físico.',
      bio: 'Instrutora principal do estúdio, apaixonada por ajudar pessoas a descobrirem o poder transformador do pilates.',
      status: 'Ativo',
      hireDate: '2020-01-15',
      hourlyRate: 80,
      workingHours: {
        monday: { start: '08:00', end: '18:00', available: true },
        tuesday: { start: '08:00', end: '18:00', available: true },
        wednesday: { start: '08:00', end: '18:00', available: true },
        thursday: { start: '08:00', end: '18:00', available: true },
        friday: { start: '08:00', end: '16:00', available: true },
        saturday: { start: '08:00', end: '12:00', available: true },
        sunday: { start: '', end: '', available: false }
      },
      totalClasses: 1250,
      rating: 4.9
    },
    {
      id: 2,
      name: 'Carla Mendes Santos',
      email: 'carla.mendes@email.com',
      phone: '(11) 77777-7777',
      birthDate: '1990-08-12',
      address: 'Av. Brigadeiro Faria Lima, 789 - São Paulo/SP',
      emergencyContact: 'Ana Mendes',
      emergencyPhone: '(11) 66666-6666',
      specialties: ['Pilates Aparelhos', 'Pilates para Idosos', 'Pilates Funcional'],
      certifications: ['Formação Completa em Pilates', 'Especialização Pilates Sênior', 'Curso de Pilates Funcional'],
      experience: '5 anos de experiência, focada em atendimento a terceira idade e reabilitação.',
      bio: 'Especialista em pilates para idosos, com abordagem cuidadosa e personalizada para cada aluno.',
      status: 'Ativo',
      hireDate: '2021-03-10',
      hourlyRate: 70,
      workingHours: {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '09:00', end: '17:00', available: true },
        friday: { start: '09:00', end: '17:00', available: true },
        saturday: { start: '', end: '', available: false },
        sunday: { start: '', end: '', available: false }
      },
      totalClasses: 680,
      rating: 4.8
    },
    {
      id: 3,
      name: 'Roberto Lima Oliveira',
      email: 'roberto.lima@email.com',
      phone: '(11) 55555-5555',
      birthDate: '1982-12-03',
      address: 'Rua Oscar Freire, 321 - São Paulo/SP',
      emergencyContact: 'Marina Lima',
      emergencyPhone: '(11) 44444-4444',
      specialties: ['Pilates Solo', 'Pilates para Atletas', 'Pilates Funcional'],
      certifications: ['Certificação Internacional de Pilates', 'Formação em Pilates Esportivo', 'Workshop Pilates e Performance'],
      experience: '10 anos de experiência, especializado em pilates para atletas e alta performance.',
      bio: 'Ex-atleta profissional, traz uma perspectiva única sobre condicionamento físico e performance.',
      status: 'Férias',
      hireDate: '2019-08-20',
      hourlyRate: 85,
      workingHours: {
        monday: { start: '07:00', end: '15:00', available: true },
        tuesday: { start: '07:00', end: '15:00', available: true },
        wednesday: { start: '07:00', end: '15:00', available: true },
        thursday: { start: '07:00', end: '15:00', available: true },
        friday: { start: '07:00', end: '15:00', available: true },
        saturday: { start: '07:00', end: '11:00', available: true },
        sunday: { start: '', end: '', available: false }
      },
      totalClasses: 1580,
      rating: 4.7
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterSpecialty, setFilterSpecialty] = useState('Todas');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Get all unique specialties for filter
  const allSpecialties = Array.from(
    new Set(instructors.flatMap(instructor => instructor.specialties))
  );

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.phone.includes(searchTerm) ||
                         instructor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'Todos' || instructor.status === filterStatus;
    const matchesSpecialty = filterSpecialty === 'Todas' || instructor.specialties.includes(filterSpecialty);
    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  const handleAddInstructor = () => {
    setSelectedInstructor(null);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setEditMode(true);
    setShowForm(true);
  };

  const handleViewInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setShowDetails(true);
  };

  const handleDeleteInstructor = (instructorId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este instrutor?')) {
      setInstructors(instructors.filter(i => i.id !== instructorId));
    }
  };

  const handleSaveInstructor = (instructorData: Omit<Instructor, 'id'>) => {
    if (editMode && selectedInstructor) {
      setInstructors(instructors.map(i => 
        i.id === selectedInstructor.id 
          ? { ...instructorData, id: selectedInstructor.id }
          : i
      ));
    } else {
      const newInstructor = {
        ...instructorData,
        id: Math.max(...instructors.map(i => i.id)) + 1
      };
      setInstructors([...instructors, newInstructor]);
    }
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'text-green-600 bg-green-100';
      case 'Inativo': return 'text-gray-600 bg-gray-100';
      case 'Férias': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (showForm) {
    return (
      <InstructorForm
        instructor={selectedInstructor}
        isEdit={editMode}
        onSave={handleSaveInstructor}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  if (showDetails && selectedInstructor) {
    return (
      <InstructorDetails
        instructor={selectedInstructor}
        onEdit={() => {
          setShowDetails(false);
          handleEditInstructor(selectedInstructor);
        }}
        onClose={() => setShowDetails(false)}
      />
    );
  }

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent relative">
              Gestão de Instrutores
              <div className="absolute -bottom-2 left-0 w-16 h-1 bg-primary-gradient rounded-full"></div>
            </h1>
            <p className="text-gray-600 mt-2">Gerencie todos os instrutores do seu estúdio</p>
          </div>
        </div>
        <button 
          onClick={handleAddInstructor}
          className="bg-primary-gradient text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-500 hover:shadow-neon hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          Novo Instrutor
        </button>
      </header>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-3xl shadow-3d p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, email, telefone ou especialidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-slate-50 transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500"
              >
                <option value="Todos">Todos os Status</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Férias">Férias</option>
              </select>
            </div>
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500"
            >
              <option value="Todas">Todas Especialidades</option>
              {allSpecialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Instrutores</p>
              <p className="text-2xl font-bold text-gray-800">{instructors.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Instrutores Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {instructors.filter(i => i.status === 'Ativo').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avaliação Média</p>
              <p className="text-2xl font-bold text-yellow-600">
                {(instructors.reduce((acc, i) => acc + i.rating, 0) / instructors.length).toFixed(1)}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Aulas</p>
              <p className="text-2xl font-bold text-purple-600">
                {instructors.reduce((acc, i) => acc + i.totalClasses, 0).toLocaleString()}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Lista de Instrutores */}
      <div className="bg-white rounded-3xl shadow-3d overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            Lista de Instrutores ({filteredInstructors.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700">Instrutor</th>
                <th className="text-left p-4 font-semibold text-gray-700">Contato</th>
                <th className="text-left p-4 font-semibold text-gray-700">Especialidades</th>
                <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700">Avaliação</th>
                <th className="text-left p-4 font-semibold text-gray-700">Total Aulas</th>
                <th className="text-left p-4 font-semibold text-gray-700">Valor/Hora</th>
                <th className="text-left p-4 font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstructors.map((instructor) => (
                <tr
                  key={instructor.id}
                  className="border-b border-gray-100 transition-all duration-300 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center text-white font-semibold">
                        {instructor.avatar ? (
                          <img src={instructor.avatar} alt={instructor.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          instructor.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{instructor.name}</p>
                        <p className="text-sm text-gray-500">ID: {instructor.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {instructor.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {instructor.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {instructor.specialties.slice(0, 2).map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                      {instructor.specialties.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{instructor.specialties.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(instructor.status)}`}>
                      {instructor.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {renderStars(instructor.rating)}
                      <span className="text-sm text-gray-600 ml-1">
                        {instructor.rating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-gray-800">{instructor.totalClasses.toLocaleString()}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-green-600">R$ {instructor.hourlyRate}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewInstructor(instructor)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditInstructor(instructor)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInstructor(instructor.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
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

        {filteredInstructors.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum instrutor encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'Todos' || filterSpecialty !== 'Todas'
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece adicionando seu primeiro instrutor'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorManagement;