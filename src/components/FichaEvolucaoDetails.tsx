import React from 'react';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Calendar, 
  Clock,
  FileText,
  CheckCircle,
  X
} from 'lucide-react';

interface FichaEvolucao {
  id: number;
  nomePaciente: string;
  data: string;
  mes: string;
  pacienteChegou: string;
  foiRealizado: string;
  exercicios: {
    [aparelho: string]: {
      [local: string]: {
        alongamento: boolean;
        fortalecimento: boolean;
        coordenacao: boolean;
        equilibrio: boolean;
        core: boolean;
      }
    }
  };
  observacoes: string;
  fisioterapeuta: string;
  crefito: string;
  createdAt: string;
}

interface FichaEvolucaoDetailsProps {
  ficha: FichaEvolucao;
  onEdit: () => void;
  onClose: () => void;
}

const FichaEvolucaoDetails: React.FC<FichaEvolucaoDetailsProps> = ({ 
  ficha, 
  onEdit, 
  onClose 
}) => {
  const aparelhos = ['CADILLAC', 'REFORMER', 'CHAIR', 'BARREL', 'MAT PILATES'];
  const locais = ['MMSS', 'MMII', 'Coluna Vertebral'];
  const tiposExercicio = ['alongamento', 'fortalecimento', 'coordenacao', 'equilibrio', 'core'];

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

  const getTipoExercicioLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      alongamento: 'Alongamento',
      fortalecimento: 'Fortalecimento',
      coordenacao: 'Coordenação',
      equilibrio: 'Equilíbrio',
      core: 'Core'
    };
    return labels[tipo] || tipo;
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
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              FICHA DE EVOLUÇÃO PILATES
            </h1>
            <h2 className="text-lg sm:text-xl text-gray-600 font-medium">
              ESPAÇO VIVER
            </h2>
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

      <div className="max-w-none lg:max-w-6xl mx-auto">
        {/* Cabeçalho da Ficha */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 mb-6 lg:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <User className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Nome do Paciente</p>
                <p className="font-semibold text-gray-800">{ficha.nomePaciente}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Data</p>
                <p className="font-semibold text-gray-800">{formatDate(ficha.data)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Clock className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Mês</p>
                <p className="font-semibold text-gray-800">{ficha.mes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informações da Sessão */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
            </div>
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Informações da Sessão</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Paciente chegou ao estúdio:</h3>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-gray-700 leading-relaxed">
                  {ficha.pacienteChegou || 'Não informado'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Foi Realizado:</h3>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-gray-700 leading-relaxed">
                  {ficha.foiRealizado || 'Não informado'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Exercícios */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
            </div>
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Exercícios Realizados</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Aparelho</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Locais</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">Alongamento</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">Fortalecimento</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">Coordenação</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">Equilíbrio</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">Core</th>
                </tr>
              </thead>
              <tbody>
                {aparelhos.map((aparelho, aparelhoIndex) => (
                  locais.map((local, localIndex) => (
                    <tr key={`${aparelho}-${local}`} className="hover:bg-gray-50">
                      {localIndex === 0 && (
                        <td 
                          className="border border-gray-300 px-4 py-3 font-medium text-gray-800 bg-gray-50"
                          rowSpan={locais.length}
                        >
                          {aparelho}
                        </td>
                      )}
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">
                        {local}
                      </td>
                      {tiposExercicio.map((tipo) => (
                        <td key={tipo} className="border border-gray-300 px-4 py-3 text-center">
                          {ficha.exercicios[aparelho]?.[local]?.[tipo] ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Observações e Assinatura */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 mb-6 lg:mb-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">OBSERVAÇÕES</h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-gray-700 leading-relaxed">
                  {ficha.observacoes || 'Nenhuma observação registrada'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Fisioterapeuta</h3>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <p className="text-gray-700 font-medium">
                    {ficha.fisioterapeuta || 'Não informado'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Crefito</h3>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <p className="text-gray-700 font-medium">
                    {ficha.crefito || 'Não informado'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações de Criação */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-4 sm:p-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Ficha criada em {formatDate(ficha.createdAt)} às {formatTime(ficha.createdAt)}</span>
            <span>ID: #{ficha.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichaEvolucaoDetails;