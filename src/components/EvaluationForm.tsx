import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Calendar, 
  FileText,
  Target,
  AlertCircle,
  Camera,
  Upload,
  Plus,
  X,
  Ruler,
  Activity,
  Stethoscope,
  MapPin
} from 'lucide-react';
import AnatomicalDiagram from './AnatomicalDiagram';

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

interface EvaluationFormProps {
  evaluation?: Evaluation | null;
  isEdit: boolean;
  onSave: (evaluation: Omit<Evaluation, 'id'>) => void;
  onCancel: () => void;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ evaluation, isEdit, onSave, onCancel }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: 0,
    studentName: '',
    evaluatorId: 1,
    evaluatorName: 'Sarah Costa Silva',
    date: new Date().toISOString().split('T')[0],
    type: 'Inicial' as 'Inicial' | 'Reavaliação' | 'Controle',
    status: 'Pendente' as 'Pendente' | 'Concluída' | 'Revisão',
    anthropometrics: {
      weight: 0,
      height: 0,
      bmi: 0,
      bodyFat: 0
    },
    perimeters: {
      chest: 0,
      waist: 0,
      hip: 0,
      arm: 0,
      thigh: 0
    },
    flexibility: {
      shoulderFlexion: 0,
      spinalFlexion: 0,
      hipFlexion: 0
    },
    posturalAssessment: '',
    medicalHistory: '',
    objectives: '',
    restrictions: '',
    anatomicalMarkers: [] as {
      id: string;
      x: number;
      y: number;
      type: 'pain' | 'injury' | 'observation';
      description: string;
    }[],
    photos: [] as string[],
    documents: [] as string[],
    professionalNotes: '',
    recommendations: '',
    nextEvaluationDate: '',
    createdAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentTab, setCurrentTab] = useState('basic');

  // Mock data - em um app real, viria de uma API
  const students = [
    { id: 1, name: 'Ana Silva Santos' },
    { id: 2, name: 'Maria Santos Oliveira' },
    { id: 3, name: 'João Pedro Costa' },
  ];

  const evaluators = [
    { id: 1, name: 'Sarah Costa Silva' },
    { id: 2, name: 'Carla Mendes Santos' },
    { id: 3, name: 'Roberto Lima Oliveira' },
  ];

  useEffect(() => {
    if (evaluation && isEdit) {
      setFormData({
        studentId: evaluation.studentId,
        studentName: evaluation.studentName,
        evaluatorId: evaluation.evaluatorId,
        evaluatorName: evaluation.evaluatorName,
        date: evaluation.date,
        type: evaluation.type,
        status: evaluation.status,
        anthropometrics: evaluation.anthropometrics,
        perimeters: evaluation.perimeters,
        flexibility: evaluation.flexibility,
        posturalAssessment: evaluation.posturalAssessment,
        medicalHistory: evaluation.medicalHistory,
        objectives: evaluation.objectives,
        restrictions: evaluation.restrictions,
        anatomicalMarkers: evaluation.anatomicalMarkers,
        photos: evaluation.photos,
        documents: evaluation.documents,
        professionalNotes: evaluation.professionalNotes,
        recommendations: evaluation.recommendations,
        nextEvaluationDate: evaluation.nextEvaluationDate,
        createdAt: evaluation.createdAt
      });
    }
  }, [evaluation, isEdit]);

  // Calcular IMC automaticamente
  useEffect(() => {
    if (formData.anthropometrics.weight > 0 && formData.anthropometrics.height > 0) {
      const heightInMeters = formData.anthropometrics.height / 100;
      const bmi = formData.anthropometrics.weight / (heightInMeters * heightInMeters);
      setFormData(prev => ({
        ...prev,
        anthropometrics: {
          ...prev.anthropometrics,
          bmi: parseFloat(bmi.toFixed(1))
        }
      }));
    }
  }, [formData.anthropometrics.weight, formData.anthropometrics.height]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentId) {
      newErrors.studentId = 'Aluno é obrigatório';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (formData.anthropometrics.weight <= 0) {
      newErrors.weight = 'Peso deve ser maior que zero';
    }

    if (formData.anthropometrics.height <= 0) {
      newErrors.height = 'Altura deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev] as any,
        [field]: value
      }
    }));
  };

  const handleStudentChange = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      handleInputChange('studentId', studentId);
      handleInputChange('studentName', student.name);
    }
  };

  const handleEvaluatorChange = (evaluatorId: number) => {
    const evaluator = evaluators.find(e => e.id === evaluatorId);
    if (evaluator) {
      handleInputChange('evaluatorId', evaluatorId);
      handleInputChange('evaluatorName', evaluator.name);
    }
  };

  const handleAnatomicalMarkerAdd = (marker: {
    x: number;
    y: number;
    type: 'pain' | 'injury' | 'observation';
    description: string;
  }) => {
    const newMarker = {
      ...marker,
      id: Date.now().toString()
    };
    handleInputChange('anatomicalMarkers', [...formData.anatomicalMarkers, newMarker]);
  };

  const handleAnatomicalMarkerRemove = (markerId: string) => {
    handleInputChange('anatomicalMarkers', formData.anatomicalMarkers.filter(m => m.id !== markerId));
  };

  const tabs = [
    { id: 'basic', label: 'Dados Básicos', icon: User },
    { id: 'anthropometrics', label: 'Antropometria', icon: Ruler },
    { id: 'flexibility', label: 'Flexibilidade', icon: Activity },
    { id: 'anatomical', label: 'Avaliação Anatômica', icon: MapPin },
    { id: 'medical', label: 'Histórico Médico', icon: Stethoscope },
    { id: 'notes', label: 'Observações', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 lg:mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Voltar ao dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={onCancel}
            className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Cancelar"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent relative">
            {isEdit ? 'Editar Avaliação' : 'Nova Avaliação'}
            <div className="absolute -bottom-1 lg:-bottom-2 left-0 w-12 lg:w-16 h-0.5 lg:h-1 bg-primary-gradient rounded-full"></div>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {isEdit ? 'Atualize as informações da avaliação' : 'Preencha os dados da nova avaliação'}
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d mb-6 lg:mb-8 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap min-h-[60px] ${
                  currentTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Dados Básicos */}
        {currentTab === 'basic' && (
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 mb-6 lg:mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Dados Básicos</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-2">
                  Aluno *
                </label>
                <select
                  id="student"
                  value={formData.studentId}
                  onChange={(e) => handleStudentChange(parseInt(e.target.value))}
                  className={`w-full px-4 py-3 lg:py-4 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-base ${
                    errors.studentId ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                  }`}
                  aria-describedby={errors.studentId ? "student-error" : undefined}
                >
                  <option value={0}>Selecione um aluno</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
                {errors.studentId && (
                  <p id="student-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.studentId}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="evaluator" className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliador
                </label>
                <select
                  id="evaluator"
                  value={formData.evaluatorId}
                  onChange={(e) => handleEvaluatorChange(parseInt(e.target.value))}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                >
                  {evaluators.map((evaluator) => (
                    <option key={evaluator.id} value={evaluator.id}>
                      {evaluator.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Data da Avaliação *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 lg:py-4 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-base ${
                      errors.date ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                    }`}
                    aria-describedby={errors.date ? "date-error" : undefined}
                  />
                </div>
                {errors.date && (
                  <p id="date-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="nextEvaluationDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Próxima Avaliação
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="nextEvaluationDate"
                    type="date"
                    value={formData.nextEvaluationDate}
                    onChange={(e) => handleInputChange('nextEvaluationDate', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Avaliação
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value as 'Inicial' | 'Reavaliação' | 'Controle')}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                >
                  <option value="Inicial">Inicial</option>
                  <option value="Reavaliação">Reavaliação</option>
                  <option value="Controle">Controle</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as 'Pendente' | 'Concluída' | 'Revisão')}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Concluída">Concluída</option>
                  <option value="Revisão">Revisão</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Antropometria */}
        {currentTab === 'anthropometrics' && (
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 mb-6 lg:mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Ruler className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Dados Antropométricos</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Medidas Básicas */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800">Medidas Básicas</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                      Peso (kg) *
                    </label>
                    <input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.anthropometrics.weight || ''}
                      onChange={(e) => handleNestedInputChange('anthropometrics', 'weight', parseFloat(e.target.value) || 0)}
                      className={`w-full px-4 py-3 lg:py-4 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-base ${
                        errors.weight ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                      }`}
                      placeholder="0.0"
                      aria-describedby={errors.weight ? "weight-error" : undefined}
                    />
                    {errors.weight && (
                      <p id="weight-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.weight}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                      Altura (cm) *
                    </label>
                    <input
                      id="height"
                      type="number"
                      value={formData.anthropometrics.height || ''}
                      onChange={(e) => handleNestedInputChange('anthropometrics', 'height', parseFloat(e.target.value) || 0)}
                      className={`w-full px-4 py-3 lg:py-4 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-base ${
                        errors.height ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                      }`}
                      placeholder="0"
                      aria-describedby={errors.height ? "height-error" : undefined}
                    />
                    {errors.height && (
                      <p id="height-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.height}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IMC
                    </label>
                    <div className="px-4 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-medium text-gray-800">
                      {formData.anthropometrics.bmi || '0.0'}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bodyFat" className="block text-sm font-medium text-gray-700 mb-2">
                      % Gordura
                    </label>
                    <input
                      id="bodyFat"
                      type="number"
                      step="0.1"
                      value={formData.anthropometrics.bodyFat || ''}
                      onChange={(e) => handleNestedInputChange('anthropometrics', 'bodyFat', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>

              {/* Perímetros */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800">Perímetros (cm)</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="chest" className="block text-sm font-medium text-gray-700 mb-2">
                      Tórax
                    </label>
                    <input
                      id="chest"
                      type="number"
                      step="0.1"
                      value={formData.perimeters.chest || ''}
                      onChange={(e) => handleNestedInputChange('perimeters', 'chest', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label htmlFor="waist" className="block text-sm font-medium text-gray-700 mb-2">
                      Cintura
                    </label>
                    <input
                      id="waist"
                      type="number"
                      step="0.1"
                      value={formData.perimeters.waist || ''}
                      onChange={(e) => handleNestedInputChange('perimeters', 'waist', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label htmlFor="hip" className="block text-sm font-medium text-gray-700 mb-2">
                      Quadril
                    </label>
                    <input
                      id="hip"
                      type="number"
                      step="0.1"
                      value={formData.perimeters.hip || ''}
                      onChange={(e) => handleNestedInputChange('perimeters', 'hip', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label htmlFor="arm" className="block text-sm font-medium text-gray-700 mb-2">
                      Braço
                    </label>
                    <input
                      id="arm"
                      type="number"
                      step="0.1"
                      value={formData.perimeters.arm || ''}
                      onChange={(e) => handleNestedInputChange('perimeters', 'arm', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label htmlFor="thigh" className="block text-sm font-medium text-gray-700 mb-2">
                      Coxa
                    </label>
                    <input
                      id="thigh"
                      type="number"
                      step="0.1"
                      value={formData.perimeters.thigh || ''}
                      onChange={(e) => handleNestedInputChange('perimeters', 'thigh', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flexibilidade */}
        {currentTab === 'flexibility' && (
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 mb-6 lg:mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Testes de Flexibilidade</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="shoulderFlexion" className="block text-sm font-medium text-gray-700 mb-2">
                  Flexão do Ombro (graus)
                </label>
                <input
                  id="shoulderFlexion"
                  type="number"
                  value={formData.flexibility.shoulderFlexion || ''}
                  onChange={(e) => handleNestedInputChange('flexibility', 'shoulderFlexion', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="spinalFlexion" className="block text-sm font-medium text-gray-700 mb-2">
                  Flexão da Coluna (cm)
                </label>
                <input
                  id="spinalFlexion"
                  type="number"
                  value={formData.flexibility.spinalFlexion || ''}
                  onChange={(e) => handleNestedInputChange('flexibility', 'spinalFlexion', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="hipFlexion" className="block text-sm font-medium text-gray-700 mb-2">
                  Flexão do Quadril (graus)
                </label>
                <input
                  id="hipFlexion"
                  type="number"
                  value={formData.flexibility.hipFlexion || ''}
                  onChange={(e) => handleNestedInputChange('flexibility', 'hipFlexion', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="posturalAssessment" className="block text-sm font-medium text-gray-700 mb-2">
                Avaliação Postural
              </label>
              <textarea
                id="posturalAssessment"
                value={formData.posturalAssessment}
                onChange={(e) => handleInputChange('posturalAssessment', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                placeholder="Descreva a avaliação postural do aluno..."
              />
            </div>
          </div>
        )}

        {/* Avaliação Anatômica */}
        {currentTab === 'anatomical' && (
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 mb-6 lg:mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Avaliação Anatômica Interativa</h2>
            </div>

            <AnatomicalDiagram
              markers={formData.anatomicalMarkers}
              onMarkerAdd={handleAnatomicalMarkerAdd}
              onMarkerRemove={handleAnatomicalMarkerRemove}
            />
          </div>
        )}

        {/* Histórico Médico */}
        {currentTab === 'medical' && (
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 mb-6 lg:mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Histórico Médico e Objetivos</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-2">
                  Histórico Médico
                </label>
                <textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Descreva condições médicas, lesões, cirurgias, medicamentos..."
                />
              </div>

              <div>
                <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivos do Aluno
                </label>
                <textarea
                  id="objectives"
                  value={formData.objectives}
                  onChange={(e) => handleInputChange('objectives', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Descreva os objetivos e metas do aluno..."
                />
              </div>

              <div>
                <label htmlFor="restrictions" className="block text-sm font-medium text-gray-700 mb-2">
                  Restrições e Limitações
                </label>
                <textarea
                  id="restrictions"
                  value={formData.restrictions}
                  onChange={(e) => handleInputChange('restrictions', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Descreva restrições médicas, limitações físicas..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Observações */}
        {currentTab === 'notes' && (
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 mb-6 lg:mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Observações e Documentos</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="professionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notas do Profissional
                </label>
                <textarea
                  id="professionalNotes"
                  value={formData.professionalNotes}
                  onChange={(e) => handleInputChange('professionalNotes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Observações técnicas, impressões, notas importantes..."
                />
              </div>

              <div>
                <label htmlFor="recommendations" className="block text-sm font-medium text-gray-700 mb-2">
                  Recomendações
                </label>
                <textarea
                  id="recommendations"
                  value={formData.recommendations}
                  onChange={(e) => handleInputChange('recommendations', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Recomendações de exercícios, frequência, cuidados especiais..."
                />
              </div>

              {/* Upload de Fotos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registro Fotográfico
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Clique para adicionar fotos</p>
                  <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
                </div>
              </div>

              {/* Upload de Documentos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documentos e Exames
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Clique para adicionar documentos</p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX até 10MB</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-4 border border-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-300 hover:bg-gray-50 hover:-translate-y-1 min-h-[44px] text-base"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto bg-primary-gradient text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-500 hover:shadow-neon hover:-translate-y-1 min-h-[44px] text-base"
          >
            <Save className="w-5 h-5" />
            {isEdit ? 'Atualizar Avaliação' : 'Salvar Avaliação'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvaluationForm;