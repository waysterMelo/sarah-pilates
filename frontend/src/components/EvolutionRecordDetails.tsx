import React from 'react';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  GraduationCap, 
  Calendar, 
  Clock,
  Target,
  Activity,
  Star,
  TrendingUp,
  FileText,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

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

interface EvolutionRecordDetailsProps {
  record: EvolutionRecord;
  onEdit: () => void;
  onClose: () => void;
}

const EvolutionRecordDetails: React.FC<EvolutionRecordDetailsProps> = ({ 
  record, 
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const renderLevelBar = (level: number, maxLevel: number = 5, color: string = 'blue') => {
    const percentage = (level / maxLevel) * 100;
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
          {level}/{maxLevel}
        </span>
      </div>
    );
  };

  const getPainLevelText = (level: number) => {
    if (level === 0) return 'Sem dor';
    if (level <= 3) return 'Dor leve';
    if (level <= 6) return 'Dor moderada';
    if (level <= 8) return 'Dor forte';
    return 'Dor severa';
  };

  const getPainLevelColor = (level: number) => {
    if (level === 0) return 'text-green-600';
    if (level <= 3) return 'text-yellow-600';
    if (level <= 6) return 'text-orange-600';
    return 'text-red-600';
  };

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
              Ficha de Evolução
              <div className="absolute -bottom-1 lg:-bottom-2 left-0 w-12 lg:w-16 h-0.5 lg:h-1 bg-primary-gradient rounded-full"></div>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Sessão #{record.session} • {formatDate(record.date)}
            </p>
          </div>
        </div>
        <button 
          onClick={onEdit}
          className="bg-primary-gradient text-white px-4 sm:px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-500 hover:shadow-neon hover:-translate-y-1 text-sm sm:text-base min-h-[44px] justify-center"
        >
          <Edit className="w-5 h-5" />
          Editar Ficha
        </button>
      </header>

      <div className="max-w-none lg:max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Informações da Sessão */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Informações da Sessão</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Aluno</p>
                  <p className="font-semibold text-gray-800">{record.studentName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <GraduationCap className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Instrutor</p>
                  <p className="font-semibold text-gray-800">{record.instructorName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Data</p>
                    <p className="font-semibold text-gray-800">{new Date(record.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Duração</p>
                    <p className="font-semibold text-gray-800">{record.duration} min</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Target className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-sm text-gray-600">Foco da Sessão</p>
                  <p className="font-semibold text-gray-800">{record.focus}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Avaliação Geral */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Avaliação Geral</h2>
            </div>

            <div className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Avaliação da Sessão</p>
                  {renderStars(record.overallRating)}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Nível de Dor</span>
                    <span className={`text-sm font-medium ${getPainLevelColor(record.painLevel)}`}>
                      {getPainLevelText(record.painLevel)}
                    </span>
                  </div>
                  {renderLevelBar(record.painLevel, 10, 'red')}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Mobilidade</span>
                  </div>
                  {renderLevelBar(record.mobilityLevel, 5, 'blue')}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Força</span>
                  </div>
                  {renderLevelBar(record.strengthLevel, 5, 'green')}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Equilíbrio</span>
                  </div>
                  {renderLevelBar(record.balanceLevel, 5, 'purple')}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Resistência</span>
                  </div>
                  {renderLevelBar(record.enduranceLevel, 5, 'indigo')}
                </div>
              </div>
            </div>
          </div>

          {/* Exercícios Realizados */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Exercícios Realizados</h2>
            </div>

            <div className="space-y-4">
              {record.exercisesPerformed.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {record.exercisesPerformed.map((exercise, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-green-800">{exercise}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum exercício registrado</p>
                </div>
              )}
            </div>
          </div>

          {/* Equipamentos */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Equipamentos Utilizados</h2>
            </div>

            <div className="space-y-4">
              {record.equipment.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {record.equipment.map((equipment, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {equipment}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum equipamento registrado</p>
                </div>
              )}
            </div>
          </div>

          {/* Notas de Progresso */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Notas de Progresso</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {record.progressNotes && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-gray-800">Progresso Observado</h3>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <p className="text-gray-700 leading-relaxed">{record.progressNotes}</p>
                  </div>
                </div>
              )}

              {record.difficultiesObserved && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <h3 className="font-semibold text-gray-800">Dificuldades Observadas</h3>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-gray-700 leading-relaxed">{record.difficultiesObserved}</p>
                  </div>
                </div>
              )}

              {record.improvements && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-800">Melhorias Observadas</h3>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-gray-700 leading-relaxed">{record.improvements}</p>
                  </div>
                </div>
              )}

              {record.nextSessionGoals && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold text-gray-800">Objetivos Próxima Sessão</h3>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <p className="text-gray-700 leading-relaxed">{record.nextSessionGoals}</p>
                  </div>
                </div>
              )}
            </div>

            {record.observations && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <h3 className="font-semibold text-gray-800">Observações Gerais</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-gray-700 leading-relaxed">{record.observations}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informações de Criação */}
        <div className="mt-6 lg:mt-8 bg-white rounded-2xl lg:rounded-3xl shadow-3d p-4 sm:p-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Ficha criada em {formatDate(record.createdAt)} às {formatTime(record.createdAt)}</span>
            <span>ID: #{record.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvolutionRecordDetails;