import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  Calendar,
  User,
  TrendingUp,
  ArrowLeft,
  Star,
  Clock,
  Target,
  Activity
} from 'lucide-react';
import EvolutionRecordForm from './EvolutionRecordForm';
import EvolutionRecordDetails from './EvolutionRecordDetails';

interface EvolutionRecord {
  id: number;
  studentId: number;
  studentName: string;
  instructorId: number;
  instructorName: string;
  date: string;
  session: number;
  focus: string;
  exercisesPerformed: string[];
  progressNotes: string;
  difficultiesObserved: string;
  improvements: string;
  nextSessionGoals: string;
  overallRating: number;
  painLevel: number;
  mobilityLevel: number;
  strengthLevel: number;
  balanceLevel: number;
  enduranceLevel: number;
  observations: string;
  equipment: string[];
  duration: number;
  createdAt: string;
}

const EvolutionRecords = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<EvolutionRecord[]>([
    {
      id: 1,
      studentId: 1,
      studentName: 'Ana Silva Santos',
      instructorId: 1,
      instructorName: 'Sarah Costa Silva',
      date: '2024-12-15',
      session: 15,
      focus: 'Fortalecimento do Core',
      exercisesPerformed: ['Hundred', 'Roll Up', 'Single Leg Circles', 'Teaser', 'Plank'],
      progressNotes: 'Excelente evolução na estabilização do tronco. Conseguiu manter a postura durante todo o exercício Hundred.',
      difficultiesObserved: 'Ainda apresenta dificuldades no Roll Up completo, necessitando apoio das mãos.',
      improvements: 'Melhora significativa na coordenação e controle respiratório. Força abdominal aumentou visivelmente.',
      nextSessionGoals: 'Trabalhar mais extensão da coluna e flexibilidade dos isquiotibiais.',
      overallRating: 4,
      painLevel: 2,
      mobilityLevel: 4,
      strengthLevel: 4,
      balanceLevel: 3,
      enduranceLevel: 4,
      observations: 'Aluna motivada e dedicada. Segue todas as orientações corretamente.',
      equipment: ['Mat', 'Bola', 'Magic Circle'],
      duration: 60,
      createdAt: '2024-12-15T10:00:00Z'
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Maria Santos Oliveira',
      instructorId: 1,
      instructorName: 'Sarah Costa Silva',
      date: '2024-12-14',
      session: 8,
      focus: 'Mobilidade e Flexibilidade',
      exercisesPerformed: ['Spine Stretch', 'Saw', 'Swan', 'Cat Stretch', 'Hip Circles'],
      progressNotes: 'Boa evolução na flexibilidade da coluna vertebral. Movimento mais fluido nos exercícios de mobilização.',
      difficultiesObserved: 'Rigidez nos quadris ainda presente, limitando amplitude de movimento.',
      improvements: 'Melhora na respiração coordenada com movimento. Menos tensão na região cervical.',
      nextSessionGoals: 'Intensificar trabalho de abertura dos quadris e alongamento posterior.',
      overallRating: 3,
      painLevel: 3,
      mobilityLevel: 3,
      strengthLevel: 3,
      balanceLevel: 3,
      enduranceLevel: 3,
      observations: 'Precisa de mais incentivo para manter regularidade nos exercícios em casa.',
      equipment: ['Mat', 'Theraband', 'Rolo'],
      duration: 50,
      createdAt: '2024-12-14T14:30:00Z'
    },
    {
      id: 3,
      studentId: 3,
      studentName: 'João Pedro Costa',
      instructorId: 2,
      instructorName: 'Carla Mendes Santos',
      date: '2024-12-13',
      session: 22,
      focus: 'Reabilitação Lombar',
      exercisesPerformed: ['Pelvic Tilts', 'Modified Hundreds', 'Knee Rocks', 'Single Leg Stretch', 'Dead Bug'],
      progressNotes: 'Significativa redução na dor lombar. Consegue executar movimentos com maior confiança.',
      difficultiesObserved: 'Ainda evita alguns movimentos por receio, mesmo sem dor presente.',
      improvements: 'Estabilidade pélvica muito melhor. Consciência corporal aprimorada.',
      nextSessionGoals: 'Introduzir exercícios de maior desafio progressivamente.',
      overallRating: 5,
      painLevel: 1,
      mobilityLevel: 4,
      strengthLevel: 3,
      balanceLevel: 4,
      enduranceLevel: 3,
      observations: 'Paciente modelo na reabilitação. Excelente adesão ao tratamento.',
      equipment: ['Mat', 'Bola', 'Almofada'],
      duration: 55,
      createdAt: '2024-12-13T16:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStudent, setFilterStudent] = useState('Todos');
  const [filterInstructor, setFilterInstructor] = useState('Todos');
  const [filterFocus, setFilterFocus] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<EvolutionRecord | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Mock students and instructors - in a real app, this would come from an API
  const students = [
    { id: 1, name: 'Ana Silva Santos' },
    { id: 2, name: 'Maria Santos Oliveira' },
    { id: 3, name: 'João Pedro Costa' },
  ];

  const instructors = [
    { id: 1, name: 'Sarah Costa Silva' },
    { id: 2, name: 'Carla Mendes Santos' },
  ];

  const focusAreas = ['Fortalecimento do Core', 'Mobilidade e Flexibilidade', 'Reabilitação Lombar', 'Equilíbrio', 'Condicionamento'];

  // Get unique values for filters
  const allStudents = Array.from(new Set(records.map(record => record.studentName)));
  const allInstructors = Array.from(new Set(records.map(record => record.instructorName)));
  const allFocusAreas = Array.from(new Set(records.map(record => record.focus)));

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.progressNotes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStudent = filterStudent === 'Todos' || record.studentName === filterStudent;
    const matchesInstructor = filterInstructor === 'Todos' || record.instructorName === filterInstructor;
    const matchesFocus = filterFocus === 'Todos' || record.focus === filterFocus;
    return matchesSearch && matchesStudent && matchesInstructor && matchesFocus;
  });

  const handleAddRecord = () => {
    setSelectedRecord(null);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEditRecord = (record: EvolutionRecord) => {
    setSelectedRecord(record);
    setEditMode(true);
    setShowForm(true);
  };

  const handleViewRecord = (record: EvolutionRecord) => {
    setSelectedRecord(record);
    setShowDetails(true);
  };

  const handleDeleteRecord = (recordId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta ficha de evolução?')) {
      setRecords(records.filter(r => r.id !== recordId));
    }
  };

  const handleSaveRecord = (recordData: Omit<EvolutionRecord, 'id'>) => {
    if (editMode && selectedRecord) {
      setRecords(records.map(r => 
        r.id === selectedRecord.id 
          ? { ...recordData, id: selectedRecord.id }
          : r
      ));
    } else {
      const newRecord = {
        ...recordData,
        id: Math.max(...records.map(r => r.id)) + 1
      };
      setRecords([...records, newRecord]);
    }
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600 bg-green-100';
    if (rating >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAverageRating = () => {
    if (records.length === 0) return 0;
    return records.reduce((acc, record) => acc + record.overallRating, 0) / records.length;
  };

  const getLatestRecords = () => {
    return records
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  if (showForm) {
    return (
      <EvolutionRecordForm
        record={selectedRecord}
        isEdit={editMode}
        onSave={handleSaveRecord}
        onCancel={() => setShowForm(false)}
        students={students}
        instructors={instructors}
      />
    );
  }

  if (showDetails && selectedRecord) {
    return (
      <EvolutionRecordDetails
        record={selectedRecord}
        onEdit={() => {
          setShowDetails(false);
          handleEditRecord(selectedRecord);
        }}
        onClose={() => setShowDetails(false)}
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
              Fichas de Evolução
              <div className="absolute -bottom-1 lg:-bottom-2 left-0 w-12 lg:w-16 h-0.5 lg:h-1 bg-primary-gradient rounded-full"></div>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Acompanhe o progresso dos seus alunos</p>
          </div>
        </div>
        <button 
          onClick={handleAddRecord}
          className="bg-primary-gradient text-white px-4 sm:px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-500 hover:shadow-neon hover:-translate-y-1 text-sm sm:text-base min-h-[44px] justify-center"
        >
          <Plus className="w-5 h-5" />
          Nova Ficha
        </button>
      </header>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-4 sm:p-6 mb-6 lg:mb-8">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por aluno, instrutor, foco ou observações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-slate-50 transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:bg-white text-base"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStudent}
                onChange={(e) => setFilterStudent(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500 text-base"
              >
                <option value="Todos">Todos os Alunos</option>
                {allStudents.map((student) => (
                  <option key={student} value={student}>
                    {student}
                  </option>
                ))}
              </select>
            </div>
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
            <select
              value={filterFocus}
              onChange={(e) => setFilterFocus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500 text-base"
            >
              <option value="Todos">Todos os Focos</option>
              {allFocusAreas.map((focus) => (
                <option key={focus} value={focus}>
                  {focus}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Fichas</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{records.length}</p>
            </div>
            <FileText className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avaliação Média</p>
              <div className="flex items-center gap-2">
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {getAverageRating().toFixed(1)}
                </p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= getAverageRating() ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Este Mês</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {records.filter(r => {
                  const recordMonth = new Date(r.date).getMonth();
                  const currentMonth = new Date().getMonth();
                  return recordMonth === currentMonth;
                }).length}
              </p>
            </div>
            <Calendar className="w-6 sm:w-8 h-6 sm:h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Alunos Ativos</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">
                {Array.from(new Set(records.map(r => r.studentId))).length}
              </p>
            </div>
            <User className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Lista de Fichas */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Fichas de Evolução ({filteredRecords.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Data/Sessão</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Aluno</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Instrutor</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Foco</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Avaliação</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Duração</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-100 transition-all duration-300 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                        <Calendar className="w-4 h-4" />
                        {formatDate(record.date)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Target className="w-4 h-4" />
                        Sessão #{record.session}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-gray-800 text-sm sm:text-base">{record.studentName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700 text-sm sm:text-base">{record.instructorName}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-800 font-medium text-sm sm:text-base">{record.focus}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRatingColor(record.overallRating)}`}>
                        {record.overallRating}/5
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= record.overallRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {record.duration}min
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewRecord(record)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditRecord(record)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
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

        {filteredRecords.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma ficha encontrada</h3>
            <p className="text-gray-500">
              {searchTerm || filterStudent !== 'Todos' || filterInstructor !== 'Todos' || filterFocus !== 'Todos'
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece criando sua primeira ficha de evolução'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvolutionRecords;