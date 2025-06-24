import React from 'react';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Calendar, 
  Weight,
  Ruler,
  Heart,
  Activity,
  Target,
  Camera,
  FileText,
  Download,
  TrendingUp
} from 'lucide-react';

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

interface PhysicalEvaluationDetailsProps {
  evaluation: PhysicalEvaluation;
  onEdit: () => void;
  onClose: () => void;
}

const PhysicalEvaluationDetails: React.FC<PhysicalEvaluationDetailsProps> = ({ 
  evaluation, 
  onEdit, 
  onClose 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const renderProgressBar = (value: number, max: number = 5, color: string = 'blue') => {
    const percentage = (value / max) * 100;
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      indigo: 'bg-indigo-500'
    };

    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-600 min-w-[40px]">
          {value}/{max}
        </span>
      </div>
    );
  };

  const bmiInfo = calculateBMICategory(evaluation.bmi);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent relative">
              Avaliação Física
              <div className="absolute -bottom-1 lg:-bottom-2 left-0 w-12 lg:w-16 h-0.5 lg:h-1 bg-primary-gradient rounded-full"></div>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              {evaluation.studentName} • {formatDate(evaluation.date)}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 hover:bg-gray-200 text-sm sm:text-base min-h-[44px] justify-center"
          >
            <Download className="w-5 h-5" />
            Imprimir
          </button>
          <button 
            onClick={onEdit}
            className="bg-primary-gradient text-white px-4 sm:px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-500 hover:shadow-neon hover:-translate-y-1 text-sm sm:text-base min-h-[44px] justify-center"
          >
            <Edit className="w-5 h-5" />
            Editar Avaliação
          </button>
        </div>
      </header>

      <div className="max-w-none lg:max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Informações Gerais */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Informações Gerais</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Aluno</p>
                  <p className="font-semibold text-gray-800">{evaluation.studentName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Target className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Instrutor</p>
                  <p className="font-semibold text-gray-800">{evaluation.instructorName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Data</p>
                    <p className="font-semibold text-gray-800">{new Date(evaluation.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <FileText className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Tipo</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(evaluation.type)}`}>
                      {evaluation.type}
                    </span>
                  </div>
                </div>
              </div>

              {evaluation.nextEvaluationDate && (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-yellow-600">Próxima Avaliação</p>
                    <p className="font-semibold text-yellow-800">{new Date(evaluation.nextEvaluationDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dados Antropométricos */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Ruler className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Dados Antropométricos</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Weight className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-blue-600">Peso</p>
                  <p className="text-2xl font-bold text-blue-800">{evaluation.weight} kg</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <Ruler className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-600">Altura</p>
                  <p className="text-2xl font-bold text-green-800">{evaluation.height} m</p>
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <p className="text-sm text-purple-600 mb-2">Índice de Massa Corporal</p>
                <p className="text-3xl font-bold text-purple-800 mb-1">{evaluation.bmi}</p>
                <p className={`text-sm font-medium ${bmiInfo.color}`}>{bmiInfo.category}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <Heart className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm text-orange-600">FC Repouso</p>
                  <p className="text-xl font-bold text-orange-800">{evaluation.heartRate} bpm</p>
                </div>

                <div className="text-center p-4 bg-indigo-50 rounded-xl">
                  <Activity className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                  <p className="text-sm text-indigo-600">PA</p>
                  <p className="text-xl font-bold text-indigo-800">{evaluation.bloodPressure || 'N/A'}</p>
                </div>
              </div>

              {(evaluation.bodyFat || evaluation.muscleMass) && (
                <div className="grid grid-cols-2 gap-4">
                  {evaluation.bodyFat && (
                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                      <p className="text-sm text-yellow-600">% Gordura</p>
                      <p className="text-xl font-bold text-yellow-800">{evaluation.bodyFat}%</p>
                    </div>
                  )}
                  {evaluation.muscleMass && (
                    <div className="text-center p-4 bg-red-50 rounded-xl">
                      <p className="text-sm text-red-600">Massa Muscular</p>
                      <p className="text-xl font-bold text-red-800">{evaluation.muscleMass} kg</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Medidas Corporais */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Medidas Corporais</h2>
            </div>

            <div className="space-y-4">
              {Object.entries(evaluation.measurements).map(([key, value]) => {
                const labels: Record<string, string> = {
                  chest: 'Tórax',
                  waist: 'Cintura',
                  hip: 'Quadril',
                  thigh: 'Coxa',
                  arm: 'Braço'
                };

                return (
                  <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{labels[key]}</span>
                    <span className="text-lg font-bold text-purple-600">{value} cm</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flexibilidade */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Flexibilidade</h2>
            </div>

            <div className="space-y-4">
              {Object.entries(evaluation.flexibility).map(([key, value]) => {
                const labels: Record<string, string> = {
                  shoulderFlexion: 'Flexão do Ombro',
                  spinalFlexion: 'Flexão da Coluna',
                  hipFlexion: 'Flexão do Quadril',
                  ankleFlexion: 'Flexão do Tornozelo'
                };

                return (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{labels[key]}</span>
                      <span className="text-sm font-bold text-orange-600">{value}°</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((value / 180) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Força */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Força</h2>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Core</span>
                </div>
                {renderProgressBar(evaluation.strength.core, 5, 'red')}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Membros Superiores</span>
                </div>
                {renderProgressBar(evaluation.strength.upperBody, 5, 'red')}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Membros Inferiores</span>
                </div>
                {renderProgressBar(evaluation.strength.lowerBody, 5, 'red')}
              </div>

              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-gray-700">Força de Preensão</span>
                <span className="text-lg font-bold text-red-600">{evaluation.strength.grip} kg</span>
              </div>
            </div>
          </div>

          {/* Equilíbrio */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Equilíbrio</h2>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Equilíbrio Estático</span>
                </div>
                {renderProgressBar(evaluation.balance.staticBalance, 5, 'indigo')}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Equilíbrio Dinâmico</span>
                </div>
                {renderProgressBar(evaluation.balance.dynamicBalance, 5, 'indigo')}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Propriocepção</span>
                </div>
                {renderProgressBar(evaluation.balance.proprioception, 5, 'indigo')}
              </div>
            </div>
          </div>

          {/* Análise Postural */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Análise Postural</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(evaluation.postureAnalysis).map(([key, value]) => {
                const labels: Record<string, string> = {
                  head: 'Cabeça',
                  shoulders: 'Ombros',
                  spine: 'Coluna Vertebral',
                  pelvis: 'Pelve',
                  knees: 'Joelhos',
                  feet: 'Pés'
                };

                return (
                  <div key={key} className="space-y-3">
                    <h3 className="font-semibold text-gray-800">{labels[key]}</h3>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-gray-700 leading-relaxed">
                        {value || 'Nenhuma observação registrada'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Observações e Plano */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Observações e Plano de Tratamento</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {evaluation.medicalObservations && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">Observações Médicas</h3>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-gray-700 leading-relaxed">{evaluation.medicalObservations}</p>
                  </div>
                </div>
              )}

              {evaluation.objectives && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">Objetivos</h3>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <p className="text-gray-700 leading-relaxed">{evaluation.objectives}</p>
                  </div>
                </div>
              )}

              {evaluation.treatmentPlan && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">Plano de Tratamento</h3>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <p className="text-gray-700 leading-relaxed">{evaluation.treatmentPlan}</p>
                  </div>
                </div>
              )}

              {evaluation.recommendations && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">Recomendações</h3>
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-gray-700 leading-relaxed">{evaluation.recommendations}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fotos e Anexos */}
          {(evaluation.photos.length > 0 || evaluation.attachments.length > 0) && (
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Camera className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                </div>
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Fotos e Anexos</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {evaluation.photos.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Fotos de Avaliação</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {evaluation.photos.map((photo, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400" />
                          <span className="sr-only">{photo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {evaluation.attachments.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Anexos</h3>
                    <div className="space-y-2">
                      {evaluation.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-700">{attachment}</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Informações de Criação */}
        <div className="mt-6 lg:mt-8 bg-white rounded-2xl lg:rounded-3xl shadow-3d p-4 sm:p-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Avaliação criada em {formatDate(evaluation.createdAt)} às {formatTime(evaluation.createdAt)}</span>
            <span>ID: #{evaluation.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalEvaluationDetails;