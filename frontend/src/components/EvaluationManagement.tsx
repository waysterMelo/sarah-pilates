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
  ArrowLeft,
  TrendingUp,
  Camera,
  Download,
  Mail,
  Bell
} from 'lucide-react';
import EvaluationForm from './EvaluationForm';
import EvaluationDetails from './EvaluationDetails';

interface Evaluation {
  id: number;
  studentId: number;
  studentName: string;
  evaluatorId: number;
  evaluatorName: string;
  date: string;
  type: 'Inicial' | 'Reavaliação' | 'Controle';
  status: 'Pendente' | 'Concluída' | 'Revisão';
  anthropometrics: {
    weight: number;
    height: number;
    bmi: number;
    bodyFat: number;
  };
  perimeters: {
    chest: number;
    waist: number;
    hip: number;
    arm: number;
    thigh: number;
  };
  flexibility: {
    shoulderFlexion: number;
    spinalFlexion: number;
    hipFlexion: number;
  };
  posturalAssessment: string;
  medicalHistory: string;
  objectives: string;
  restrictions: string;
  anatomicalMarkers: {
    id: string;
    x: number;
    y: number;
    type: 'pain' | 'injury' | 'observation';
    description: string;
  }[];
  photos: string[];
  documents: string[];
  professionalNotes: string;
  recommendations: string;
  nextEvaluationDate: string;
  createdAt: string;
}

const EvaluationManagement = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    {
      id: 1,
      studentId: 1,
      studentName: 'Ana Silva Santos',
      evaluatorId: 1,
      evaluatorName: 'Sarah Costa Silva',
      date: '2024-12-01',
      type: 'Inicial',
      status: 'Concluída',
      anthropometrics: {
        weight: 65.5,
        height: 165,
        bmi: 24.1,
        bodyFat: 22.5
      },
      perimeters: {
        chest: 88,
        waist: 72,
        hip: 95,
        arm: 28,
        thigh: 58
      },
      flexibility: {
        shoulderFlexion: 170,
        spinalFlexion: 45,
        hipFlexion: 90
      },
      posturalAssessment: 'Leve anteriorização da cabeça, ombros elevados',
      medicalHistory: 'Dor lombar crônica, sem restrições para exercícios',
      objectives: 'Fortalecimento do core, melhora da postura',
      restrictions: 'Evitar flexão excessiva da coluna',
      anatomicalMarkers: [
        { id: '1', x: 45, y: 30, type: 'pain', description: 'Tensão cervical' },
        { id: '2', x: 48, y: 65, type: 'observation', description: 'Lordose acentuada' }
      ],
      photos: [],
      documents: [],
      professionalNotes: 'Paciente apresenta boa disposição para exercícios',
      recommendations: 'Pilates 2x por semana, foco em estabilização',
      nextEvaluationDate: '2024-12-30',
      createdAt: '2024-12-01T10:00:00Z'
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Maria Santos Oliveira',
      evaluatorId: 1,
      evaluatorName: 'Sarah Costa Silva',
      date: '2024-12-05',
      type: 'Inicial',
      status: 'Concluída',
      anthropometrics: {
        weight: 58.2,
        height: 160,
        bmi: 22.7,
        bodyFat: 20.1
      },
      perimeters: {
        chest: 85,
        waist: 68,
        hip: 92,
        arm: 26,
        thigh: 55
      },
      flexibility: {
        shoulderFlexion: 180,
        spinalFlexion: 50,
        hipFlexion: 95
      },
      posturalAssessment: 'Postura adequada, leve rotação interna dos ombros',
      medicalHistory: 'Sem restrições médicas',
      objectives: 'Condicionamento físico, flexibilidade',
      restrictions: 'Nenhuma',
      anatomicalMarkers: [],
      photos: [],
      documents: [],
      professionalNotes: 'Excelente condicionamento físico inicial',
      recommendations: 'Pilates 3x por semana, trabalho de mobilidade',
      nextEvaluationDate: '2025-01-05',
      createdAt: '2024-12-05T14:30:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [editMode, setEditMode] = useState(false);

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = evaluation.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.evaluatorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Todos' || evaluation.type === filterType;
    const matchesStatus = filterStatus === 'Todos' || evaluation.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddEvaluation = () => {
    setSelectedEvaluation(null);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEditEvaluation = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setEditMode(true);
    setShowForm(true);
  };

  const handleViewEvaluation = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setShowDetails(true);
  };

  const handleDeleteEvaluation = (evaluationId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      setEvaluations(evaluations.filter(e => e.id !== evaluationId));
    }
  };

  const handleSaveEvaluation = (evaluationData: Omit<Evaluation, 'id'>) => {
    if (editMode && selectedEvaluation) {
      setEvaluations(evaluations.map(e => 
        e.id === selectedEvaluation.id 
          ? { ...evaluationData, id: selectedEvaluation.id }
          : e
      ));
    } else {
      const newEvaluation = {
        ...evaluationData,
        id: Math.max(...evaluations.map(e => e.id)) + 1
      };
      setEvaluations([...evaluations, newEvaluation]);
    }
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluída': return 'text-green-600 bg-green-100';
      case 'Pendente': return 'text-yellow-600 bg-yellow-100';
      case 'Revisão': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Inicial': return 'text-blue-600 bg-blue-100';
      case 'Reavaliação': return 'text-purple-600 bg-purple-100';
      case 'Controle': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getPendingEvaluations = () => {
    return evaluations.filter(e => e.status === 'Pendente').length;
  };

  const getThisMonthEvaluations = () => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    return evaluations.filter(e => {
      const evalDate = new Date(e.date);
      return evalDate.getMonth() === thisMonth && evalDate.getFullYear() === thisYear;
    }).length;
  };

  const getUpcomingReevaluations = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return evaluations.filter(e => {
      const nextEvalDate = new Date(e.nextEvaluationDate);
      return nextEvalDate >= today && nextEvalDate <= nextWeek;
    }).length;
  };

  if (showForm) {
    return (
      <EvaluationForm
        evaluation={selectedEvaluation}
        isEdit={editMode}
        onSave={handleSaveEvaluation}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  if (showDetails && selectedEvaluation) {
    return (
      <EvaluationDetails
        evaluation={selectedEvaluation}
        onEdit={() => {
          setShowDetails(false);
          handleEditEvaluation(selectedEvaluation);
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
              Fichas de Avaliação
              <div className="absolute -bottom-1 lg:-bottom-2 left-0 w-12 lg:w-16 h-0.5 lg:h-1 bg-primary-gradient rounded-full"></div>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Gerencie avaliações físicas e acompanhe a evolução dos alunos
            </p>
          </div>
        </div>
        <button 
          onClick={handleAddEvaluation}
          className="bg-primary-gradient text-white px-4 sm:px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-500 hover:shadow-neon hover:-translate-y-1 text-sm sm:text-base min-h-[44px] justify-center"
        >
          <Plus className="w-5 h-5" />
          Nova Avaliação
        </button>
      </header>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-4 sm:p-6 mb-6 lg:mb-8">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por aluno ou avaliador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-slate-50 transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:bg-white text-base"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500 text-base"
              >
                <option value="Todos">Todos os Tipos</option>
                <option value="Inicial">Inicial</option>
                <option value="Reavaliação">Reavaliação</option>
                <option value="Controle">Controle</option>
              </select>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500 text-base"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Pendente">Pendente</option>
              <option value="Concluída">Concluída</option>
              <option value="Revisão">Revisão</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Avaliações</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{evaluations.length}</p>
            </div>
            <FileText className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pendentes</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{getPendingEvaluations()}</p>
            </div>
            <Bell className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Este Mês</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{getThisMonthEvaluations()}</p>
            </div>
            <Calendar className="w-6 sm:w-8 h-6 sm:h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Reavaliações</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{getUpcomingReevaluations()}</p>
            </div>
            <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Lista de Avaliações */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Avaliações ({filteredEvaluations.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Aluno</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Avaliador</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Data</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Tipo</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">IMC</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Próxima</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvaluations
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((evaluation) => (
                <tr
                  key={evaluation.id}
                  className="border-b border-gray-100 transition-all duration-300 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-gradient rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {evaluation.studentName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm sm:text-base">{evaluation.studentName}</p>
                        <p className="text-xs text-gray-500">ID: {evaluation.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700 text-sm sm:text-base">{evaluation.evaluatorName}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 text-sm sm:text-base">{formatDate(evaluation.date)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(evaluation.type)}`}>
                      {evaluation.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(evaluation.status)}`}>
                      {evaluation.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {evaluation.anthropometrics.bmi.toFixed(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-600 text-sm">{formatDate(evaluation.nextEvaluationDate)}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewEvaluation(evaluation)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditEvaluation(evaluation)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Gerar PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Enviar por Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvaluation(evaluation.id)}
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

        {filteredEvaluations.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma avaliação encontrada</h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== 'Todos' || filterStatus !== 'Todos'
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece criando sua primeira avaliação'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationManagement;