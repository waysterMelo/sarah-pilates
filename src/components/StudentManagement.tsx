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
  MapPin,
  User,
  ArrowLeft
} from 'lucide-react';
import StudentForm from './StudentForm';
import StudentDetails from './StudentDetails';

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
  avatar?: string;
}

const StudentManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: 'Ana Silva Santos',
      email: 'ana.silva@email.com',
      phone: '(11) 99999-9999',
      birthDate: '1985-03-15',
      address: 'Rua das Flores, 123 - São Paulo/SP',
      emergencyContact: 'João Silva',
      emergencyPhone: '(11) 88888-8888',
      medicalHistory: 'Dor lombar crônica, sem restrições para exercícios',
      objectives: 'Fortalecimento do core, melhora da postura',
      plan: 'Mensal - 8 aulas',
      status: 'Ativo',
      registrationDate: '2024-01-15',
      lastClass: '2024-12-10',
      totalClasses: 45
    },
    {
      id: 2,
      name: 'Maria Santos Oliveira',
      email: 'maria.santos@email.com',
      phone: '(11) 77777-7777',
      birthDate: '1990-07-22',
      address: 'Av. Paulista, 456 - São Paulo/SP',
      emergencyContact: 'Pedro Santos',
      emergencyPhone: '(11) 66666-6666',
      medicalHistory: 'Sem restrições médicas',
      objectives: 'Condicionamento físico, flexibilidade',
      plan: 'Trimestral - 24 aulas',
      status: 'Ativo',
      registrationDate: '2024-02-01',
      lastClass: '2024-12-09',
      totalClasses: 32
    },
    {
      id: 3,
      name: 'João Pedro Costa',
      email: 'joao.pedro@email.com',
      phone: '(11) 55555-5555',
      birthDate: '1978-11-08',
      address: 'Rua Augusta, 789 - São Paulo/SP',
      emergencyContact: 'Carla Costa',
      emergencyPhone: '(11) 44444-4444',
      medicalHistory: 'Hérnia de disco L4-L5, liberado para pilates',
      objectives: 'Reabilitação, fortalecimento da musculatura',
      plan: 'Mensal - 12 aulas',
      status: 'Ativo',
      registrationDate: '2024-03-10',
      lastClass: '2024-12-08',
      totalClasses: 28
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editMode, setEditMode] = useState(false);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'Todos' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditMode(true);
    setShowForm(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowDetails(true);
  };

  const handleDeleteStudent = (studentId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      setStudents(students.filter(s => s.id !== studentId));
    }
  };

  const handleSaveStudent = (studentData: Omit<Student, 'id'>) => {
    if (editMode && selectedStudent) {
      setStudents(students.map(s => 
        s.id === selectedStudent.id 
          ? { ...studentData, id: selectedStudent.id }
          : s
      ));
    } else {
      const newStudent = {
        ...studentData,
        id: Math.max(...students.map(s => s.id)) + 1
      };
      setStudents([...students, newStudent]);
    }
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'text-green-600 bg-green-100';
      case 'Inativo': return 'text-gray-600 bg-gray-100';
      case 'Suspenso': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (showForm) {
    return (
      <StudentForm
        student={selectedStudent}
        isEdit={editMode}
        onSave={handleSaveStudent}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  if (showDetails && selectedStudent) {
    return (
      <StudentDetails
        student={selectedStudent}
        onEdit={() => {
          setShowDetails(false);
          handleEditStudent(selectedStudent);
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
              Gestão de Alunos
              <div className="absolute -bottom-2 left-0 w-16 h-1 bg-primary-gradient rounded-full"></div>
            </h1>
            <p className="text-gray-600 mt-2">Gerencie todos os alunos do seu estúdio</p>
          </div>
        </div>
        <button 
          onClick={handleAddStudent}
          className="bg-primary-gradient text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-500 hover:shadow-neon hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          Novo Aluno
        </button>
      </header>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-3xl shadow-3d p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-slate-50 transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:bg-white"
            />
          </div>
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
              <option value="Suspenso">Suspenso</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Alunos</p>
              <p className="text-2xl font-bold text-gray-800">{students.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Alunos Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {students.filter(s => s.status === 'Ativo').length}
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
              <p className="text-gray-600 text-sm">Novos este Mês</p>
              <p className="text-2xl font-bold text-purple-600">8</p>
            </div>
            <Plus className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Taxa de Retenção</p>
              <p className="text-2xl font-bold text-orange-600">94%</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Alunos */}
      <div className="bg-white rounded-3xl shadow-3d overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            Lista de Alunos ({filteredStudents.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700">Aluno</th>
                <th className="text-left p-4 font-semibold text-gray-700">Contato</th>
                <th className="text-left p-4 font-semibold text-gray-700">Plano</th>
                <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700">Última Aula</th>
                <th className="text-left p-4 font-semibold text-gray-700">Total Aulas</th>
                <th className="text-left p-4 font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-100 transition-all duration-300 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center text-white font-semibold">
                        {student.avatar ? (
                          <img src={student.avatar} alt={student.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          student.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{student.name}</p>
                        <p className="text-sm text-gray-500">ID: {student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {student.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700 font-medium">{student.plan}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(student.lastClass).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-gray-800">{student.totalClasses}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewStudent(student)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
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

        {filteredStudents.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum aluno encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'Todos' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece adicionando seu primeiro aluno'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;