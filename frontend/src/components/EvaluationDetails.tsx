import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Calendar, 
  FileText,
  Target,
  AlertCircle,
  Camera,
  Download,
  Mail,
  Ruler,
  Activity,
  Stethoscope,
  MapPin,
  TrendingUp,
  BarChart3,
  Eye,
  Share2
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

interface EvaluationDetailsProps {
  evaluation: Evaluation;
  onEdit: () => void;
  onClose: () => void;
}

const EvaluationDetails: React.FC<EvaluationDetailsProps> = ({ evaluation, onEdit, onClose }) => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('overview');

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
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Abaixo do peso', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Peso normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Sobrepeso', color: 'text-yellow-600' };
    return { category: 'Obesidade', color: 'text-red-600' };
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Eye },
    { id: 'anthropometrics', label: 'Antropometria', icon: Ruler },
    { id: 'flexibility', label: 'Flexibilidade', icon: Activity },
    { id: 'anatomical', label: 'Avaliação Anatômica', icon: MapPin },
    { id: 'medical', label: 'Histórico Médico', icon: Stethoscope },
    { id: 'evolution', label: 'Evolução', icon: TrendingUp }
  ];

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
          <button
            onClick={onClose}
            className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent relative">
              Avaliação Física
              <div className="absolute -bottom-1 lg:-bottom-2 left-0 w-12 lg:w-16 h-0.5 lg:h-1 bg-primary-gradient rounded-full"></div>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Detalhes completos da avaliação
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="bg-secondary-gradient text-white px-4 sm:px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 text-sm sm:text-base min-h-[44px] justify-center"
          >
            <Download className="w-5 h-5" />
            Gerar PDF
          </button>
          <button
            className="bg-orange-500 text-white px-4 sm:px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 text-sm sm:text-base min-h-[44px] justify-center"
          >
            <Mail className="w-5 h-5" />
            Enviar Email
          </button>
          <button
            onClick={onEdit}
            className="bg-primary-gradient text-white px-4 sm:px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-500 hover:shadow-neon hover:-translate-y-1 text-sm sm:text-base min-h-[44px] justify-center"
          >
            <Edit className="w-5 h-5" />
            Editar
          </button>
        </div>
      </header>

      {/* Cabeçalho da Avaliação */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary-gradient rounded-full flex items-center justify-center text-white text-xl lg:text-2xl font-bold">
            {evaluation.studentName.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{evaluation.studentName}</h2>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getTypeColor(evaluation.type)}`}>
                {evaluation.type}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(evaluation.status)}`}>
                {evaluation.status}
              </span>
              <span className="text-gray-600">ID: {evaluation.id}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                {formatDate(evaluation.date)}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                {evaluation.evaluatorName}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Ruler className="w-4 h-4" />
                IMC: {evaluation.anthropometrics.bmi}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                Próxima: {formatDate(evaluation.nextEvaluationDate)}
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Visão Geral */}
      {currentTab === 'overview' && (
        <div className="space-y-6 lg:space-y-8">
          {/* Resumo Executivo */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Resumo Executivo</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Ruler className="w-6 h-6 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Antropometria</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Peso:</span> {evaluation.anthropometrics.weight} kg</p>
                  <p><span className="font-medium">Altura:</span> {evaluation.anthropometrics.height} cm</p>
                  <p><span className="font-medium">IMC:</span> {evaluation.anthropometrics.bmi}</p>
                  <p><span className="font-medium">% Gordura:</span> {evaluation.anthropometrics.bodyFat}%</p>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="w-6 h-6 text-purple-600" />
                  <h4 className="font-semibold text-purple-800">Flexibilidade</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Ombro:</span> {evaluation.flexibility.shoulderFlexion}°</p>
                  <p><span className="font-medium">Coluna:</span> {evaluation.flexibility.spinalFlexion} cm</p>
                  <p><span className="font-medium">Quadril:</span> {evaluation.flexibility.hipFlexion}°</p>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-6 h-6 text-green-600" />
                  <h4 className="font-semibold text-green-800">Objetivos</h4>
                </div>
                <p className="text-sm text-gray-700 line-clamp-4">
                  {evaluation.objectives || 'Nenhum objetivo específico registrado'}
                </p>
              </div>
            </div>
          </div>

          {/* Observações Principais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Avaliação Postural</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-700 leading-relaxed">
                  {evaluation.posturalAssessment || 'Nenhuma observação postural registrada'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recomendações</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-700 leading-relaxed">
                  {evaluation.recommendations || 'Nenhuma recomendação específica registrada'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Antropometria */}
      {currentTab === 'anthropometrics' && (
        <div className="space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Medidas Básicas */}
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Medidas Básicas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">Peso</span>
                  <span className="text-xl font-bold text-gray-800">{evaluation.anthropometrics.weight} kg</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">Altura</span>
                  <span className="text-xl font-bold text-gray-800">{evaluation.anthropometrics.height} cm</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                  <span className="font-medium text-blue-700">IMC</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-blue-800">{evaluation.anthropometrics.bmi}</span>
                    <p className={`text-sm ${getBMICategory(evaluation.anthropometrics.bmi).color}`}>
                      {getBMICategory(evaluation.anthropometrics.bmi).category}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">% Gordura</span>
                  <span className="text-xl font-bold text-gray-800">{evaluation.anthropometrics.bodyFat}%</span>
                </div>
              </div>
            </div>

            {/* Perímetros */}
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Perímetros (cm)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">Tórax</span>
                  <span className="text-xl font-bold text-gray-800">{evaluation.perimeters.chest} cm</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">Cintura</span>
                  <span className="text-xl font-bold text-gray-800">{evaluation.perimeters.waist} cm</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">Quadril</span>
                  <span className="text-xl font-bold text-gray-800">{evaluation.perimeters.hip} cm</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">Braço</span>
                  <span className="text-xl font-bold text-gray-800">{evaluation.perimeters.arm} cm</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">Coxa</span>
                  <span className="text-xl font-bold text-gray-800">{evaluation.perimeters.thigh} cm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flexibilidade */}
      {currentTab === 'flexibility' && (
        <div className="space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Testes de Flexibilidade</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                  <span className="font-medium text-purple-700">Flexão do Ombro</span>
                  <span className="text-xl font-bold text-purple-800">{evaluation.flexibility.shoulderFlexion}°</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                  <span className="font-medium text-purple-700">Flexão da Coluna</span>
                  <span className="text-xl font-bold text-purple-800">{evaluation.flexibility.spinalFlexion} cm</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                  <span className="font-medium text-purple-700">Flexão do Quadril</span>
                  <span className="text-xl font-bold text-purple-800">{evaluation.flexibility.hipFlexion}°</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Avaliação Postural</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-700 leading-relaxed">
                  {evaluation.posturalAssessment || 'Nenhuma observação postural registrada'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Avaliação Anatômica */}
      {currentTab === 'anatomical' && (
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Mapeamento Anatômico</h3>
          <AnatomicalDiagram
            markers={evaluation.anatomicalMarkers}
            onMarkerAdd={() => {}} // Read-only mode
            onMarkerRemove={() => {}} // Read-only mode
          />
        </div>
      )}

      {/* Histórico Médico */}
      {currentTab === 'medical' && (
        <div className="space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Histórico Médico</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-700 leading-relaxed">
                  {evaluation.medicalHistory || 'Nenhum histórico médico registrado'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Restrições</h3>
              <div className="bg-red-50 p-4 rounded-xl">
                <p className="text-gray-700 leading-relaxed">
                  {evaluation.restrictions || 'Nenhuma restrição específica'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Objetivos</h3>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-gray-700 leading-relaxed">
                  {evaluation.objectives || 'Nenhum objetivo específico registrado'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Notas do Profissional</h3>
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-gray-700 leading-relaxed">
                  {evaluation.professionalNotes || 'Nenhuma observação profissional registrada'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evolução */}
      {currentTab === 'evolution' && (
        <div className="space-y-6 lg:space-y-8">
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Gráfico de Evolução</h3>
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Gráficos de evolução serão exibidos aqui</p>
              <p className="text-sm text-gray-500 mt-2">
                Compare medidas entre avaliações para acompanhar o progresso
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Histórico de Avaliações</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="font-medium text-blue-800">Avaliação Inicial</p>
                  <p className="text-sm text-blue-600">{formatDate(evaluation.date)}</p>
                </div>
                <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                  Atual
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationDetails;