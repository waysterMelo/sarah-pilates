import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  User,
  Calendar,
  Activity,
  Ruler,
  Weight,
  Heart,
  Target,
  Camera,
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import PhysicalEvaluationForm from './PhysicalEvaluationForm';
import PhysicalEvaluationDetails from './PhysicalEvaluationDetails';

interface PhysicalEvaluation {
  id: number;
  studentId: number;
  studentName: string;
  instructorId: number;
  instructorName: string;
  date: string;
  type: 'Inicial' | 'Progresso' | 'Final' | 'Médica';
  weight: number;
  height: number;
  bmi: number;
  bloodPressure: string;
  heartRate: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements: {
    chest: number;
    waist: number;
    hip: number;
    thigh: number;
    arm: number;
  };
  flexibility: {
    shoulderFlexion: number;
    spinalFlexion: number;
    hipFlexion: number;
    ankleFlexion: number;
  };
  strength: {
    core: number;
    upperBody: number;
    lowerBody: number;
    grip: number;
  };
  balance: {
    staticBalance: number;
    dynamicBalance: number;
    proprioception: number;
  };
  postureAnalysis: {
    head: string;
    shoulders: string;
    spine: string;
    pelvis: string;
    knees: string;
    feet: string;
  };
  medicalObservations: string;
  objectives: string;
  treatmentPlan: string;
  recommendations: string;
  nextEvaluationDate: string;
  photos: string[];
  attachments: string[];
  createdAt: string;
}

const PhysicalEvaluation = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<PhysicalEvaluation[]>([
    {
      id: 1,
      studentId: 1,
      studentName: 'Ana Silva Santos',
      instructorId: 1,
      instructorName: 'Sarah Costa Silva',
      date: '2024-12-15',
      type: 'Inicial',
      weight: 65.5,
      height: 1.68,
      bmi: 23.2,
      bloodPressure: '120/80',
      heartRate: 72,
      bodyFat: 22.5,
      muscleMass: 45.2,
      measurements: {
        chest: 88,
        waist: 72,
        hip: 95,
        thigh: 58,
        arm: 28
      },
      flexibility: {
        shoulderFlexion: 170,
        spinalFlexion: 45,
        hipFlexion: 90,
        ankleFlexion: 15
      },
      strength: {
        core: 3,
        upperBody: 2,
        lowerBody: 4,
        grip: 25
      },
      balance: {
        staticBalance: 4,
        dynamicBalance: 3,
        proprioception: 3
      },
      postureAnalysis: {
        head: 'Leve anteriorização',
        shoulders: 'Elevação do ombro direito',
        spine: 'Hiperlordose lombar discreta',
        pelvis: 'Anteversão pélvica',
        knees: 'Valgo bilateral leve',
        feet: 'Pé plano bilateral'
      },
      medicalObservations: 'Paciente relata dores lombares ocasionais, principalmente após longos períodos sentada.',
      objectives: 'Fortalecimento do core, melhora da postura, alívio das dores lombares',
      treatmentPlan: 'Pilates terapêutico 2x/semana, foco em estabilização lombar e fortalecimento do core',
      recommendations: 'Alongamentos diários, correção postural no trabalho, hidratação adequada',
      nextEvaluationDate: '2024-03-15',
      photos: ['foto1.jpg', 'foto2.jpg'],
      attachments: ['exame1.pdf'],
      createdAt: '2024-12-15T10:00:00Z'
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Maria Santos Oliveira',
      instructorId: 2,
      instructorName: 'Carla Mendes Santos',
      date: '2024-12-10',
      type: 'Progresso',
      weight: 58.2,
      height: 1.62,
      bmi: 22.2,
      bloodPressure: '115/75',
      heartRate: 68,
      bodyFat: 20.1,
      muscleMass: 42.8,
      measurements: {
        chest: 85,
        waist: 68,
        hip: 92,
        thigh: 55,
        arm: 26
      },
      flexibility: {
        shoulderFlexion: 175,
        spinalFlexion: 50,
        hipFlexion: 95,
        ankleFlexion: 18
      },
      strength: {
        core: 4,
        upperBody: 3,
        lowerBody: 4,
        grip: 22
      },
      balance: {
        staticBalance: 4,
        dynamicBalance: 4,
        proprioception: 4
      },
      postureAnalysis: {
        head: 'Alinhamento adequado',
        shoulders: 'Simetria melhorada',
        spine: 'Curvaturas fisiológicas',
        pelvis: 'Posição neutra',
        knees: 'Alinhamento adequado',
        feet: 'Arco longitudinal preservado'
      },
      medicalObservations: 'Evolução positiva, redução significativa das dores articulares.',
      objectives: 'Manutenção dos ganhos, aumento da resistência muscular',
      treatmentPlan: 'Pilates funcional 3x/semana, introdução de exercícios mais desafiadores',
      recommendations: 'Manter atividade física regular, atenção à alimentação',
      nextEvaluationDate: '2024-06-10',
      photos: ['foto3.jpg', 'foto4.jpg'],
      attachments: [],
      createdAt: '2024-12-10T14:30:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const [filterDate, setFilterDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<PhysicalEvaluation | null>(null);
  const [editMode, setEditMode] = useState(false);

  const evaluationTypes = ['Todos', 'Inicial', 'Progresso', 'Final', 'Médica'];

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = evaluation.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Todos' || evaluation.type === filterType;
    const matchesDate = !filterDate || evaluation.date === filterDate;
    return matchesSearch && matchesType && matchesDate;
  });

  const handleAddEvaluation = () => {
    setSelectedEvaluation(null);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEditEvaluation = (evaluation: PhysicalEvaluation) => {
    setSelectedEvaluation(evaluation);
    setEditMode(true);
    setShowForm(true);
  };

  const handleViewEvaluation = (evaluation: PhysicalEvaluation) => {
    setSelectedEvaluation(evaluation);
    setShowDetails(true);
  };

  const handleDeleteEvaluation = (evaluationId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação física?')) {
      setEvaluations(evaluations.filter(e => e.id !== evaluationId));
    }
  };

  const handleSaveEvaluation = (evaluationData: Omit<PhysicalEvaluation, 'id'>) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Inicial': return 'text-blue-600 bg-blue-100';
      case 'Progresso': return 'text-green-600 bg-green-100';
      case 'Final': return 'text-purple-600 bg-purple-100';
      case 'Médica': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Abaixo do peso', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Peso normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Sobrepeso', color: 'text-yellow-600' };
    return { category: 'Obesidade', color: 'text-red-600' };
  };

  if (showForm) {
    return (
      <PhysicalEvaluationForm
        evaluation={selectedEvaluation}
        isEdit={editMode}
        onSave={handleSaveEvaluation}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  if (showDetails && selectedEvaluation) {
    return (
      <PhysicalEvaluationDetails
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
              Avaliação Física
              <div className="absolute -bottom-1 lg:-bottom-2 left-0 w-12 lg:w-16 h-0.5 lg:h-1 bg-primary-gradient rounded-full"></div>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Sistema completo de avaliação física e acompanhamento</p>
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
              placeholder="Buscar por aluno ou instrutor..."
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
                {evaluationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'Todos' ? 'Todos os Tipos' : type}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500 text-base"
            />
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Avaliações</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{evaluations.length}</p>
            </div>
            <FileText className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avaliações Iniciais</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {evaluations.filter(e => e.type === 'Inicial').length}
              </p>
            </div>
            <Target className="w-6 sm:w-8 h-6 sm:h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Acompanhamentos</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">
                {evaluations.filter(e => e.type === 'Progresso').length}
              </p>
            </div>
            <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">IMC Médio</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600">
                {(evaluations.reduce((acc, e) => acc + e.bmi, 0) / evaluations.length).toFixed(1)}
              </p>
            </div>
            <Activity className="w-6 sm:w-8 h-6 sm:h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Lista de Avaliações */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Avaliações Físicas ({filteredEvaluations.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Data</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Aluno</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Tipo</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Dados Físicos</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">IMC</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Instrutor</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvaluations
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((evaluation) => {
                  const bmiInfo = calculateBMICategory(evaluation.bmi);
                  return (
                    <tr
                      key={evaluation.id}
                      className="border-b border-gray-100 transition-all duration-300 hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                          <Calendar className="w-4 h-4" />
                          {formatDate(evaluation.date)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-gray-800 text-sm sm:text-base">{evaluation.studentName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(evaluation.type)}`}>
                          {evaluation.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1">
                            <Weight className="w-3 h-3 text-gray-400" />
                            <span>{evaluation.weight} kg</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Ruler className="w-3 h-3 text-gray-400" />
                            <span>{evaluation.height} m</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-gray-400" />
                            <span>{evaluation.heartRate} bpm</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-center">
                          <p className="font-semibold text-gray-800">{evaluation.bmi}</p>
                          <p className={`text-xs ${bmiInfo.color}`}>{bmiInfo.category}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-700 text-sm sm:text-base">{evaluation.instructorName}</span>
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
                            onClick={() => handleDeleteEvaluation(evaluation.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {filteredEvaluations.length === 0 && (
          <div className="p-12 text-center">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma avaliação encontrada</h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== 'Todos' || filterDate
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece criando sua primeira avaliação física'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhysicalEvaluation;