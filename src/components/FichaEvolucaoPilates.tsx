import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Calendar, 
  Clock,
  FileText,
  AlertCircle
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

interface FichaEvolucaoPilatesProps {
  ficha?: FichaEvolucao | null;
  isEdit: boolean;
  onSave: (ficha: Omit<FichaEvolucao, 'id'>) => void;
  onCancel: () => void;
}

const FichaEvolucaoPilates: React.FC<FichaEvolucaoPilatesProps> = ({ 
  ficha, 
  isEdit, 
  onSave, 
  onCancel 
}) => {
  const aparelhos = ['CADILLAC', 'REFORMER', 'CHAIR', 'BARREL', 'MAT PILATES'];
  const locais = ['MMSS', 'MMII', 'Coluna Vertebral'];
  const tiposExercicio = ['alongamento', 'fortalecimento', 'coordenacao', 'equilibrio', 'core'];

  const [formData, setFormData] = useState({
    nomePaciente: '',
    data: new Date().toISOString().split('T')[0],
    mes: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    pacienteChegou: '',
    foiRealizado: '',
    exercicios: {} as any,
    observacoes: '',
    fisioterapeuta: '',
    crefito: '',
    createdAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inicializar estado dos exercícios
  useEffect(() => {
    const inicializarExercicios = () => {
      const exercicios: any = {};
      aparelhos.forEach(aparelho => {
        exercicios[aparelho] = {};
        locais.forEach(local => {
          exercicios[aparelho][local] = {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          };
        });
      });
      return exercicios;
    };

    if (ficha && isEdit) {
      setFormData({
        nomePaciente: ficha.nomePaciente,
        data: ficha.data,
        mes: ficha.mes,
        pacienteChegou: ficha.pacienteChegou,
        foiRealizado: ficha.foiRealizado,
        exercicios: ficha.exercicios,
        observacoes: ficha.observacoes,
        fisioterapeuta: ficha.fisioterapeuta,
        crefito: ficha.crefito,
        createdAt: ficha.createdAt
      });
    } else {
      setFormData(prev => ({
        ...prev,
        exercicios: inicializarExercicios()
      }));
    }
  }, [ficha, isEdit]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomePaciente.trim()) {
      newErrors.nomePaciente = 'Nome do paciente é obrigatório';
    }

    if (!formData.data) {
      newErrors.data = 'Data é obrigatória';
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

  const handleCheckboxChange = (aparelho: string, local: string, tipo: string) => {
    setFormData(prev => ({
      ...prev,
      exercicios: {
        ...prev.exercicios,
        [aparelho]: {
          ...prev.exercicios[aparelho],
          [local]: {
            ...prev.exercicios[aparelho][local],
            [tipo]: !prev.exercicios[aparelho][local][tipo]
          }
        }
      }
    }));
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
      <header className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 lg:mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            FICHA DE EVOLUÇÃO PILATES
          </h1>
          <h2 className="text-lg sm:text-xl text-gray-600 font-medium">
            ESPAÇO VIVER
          </h2>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-none lg:max-w-6xl mx-auto">
        {/* Cabeçalho da Ficha */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 mb-6 lg:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div>
              <label htmlFor="nomePaciente" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Paciente *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="nomePaciente"
                  type="text"
                  value={formData.nomePaciente}
                  onChange={(e) => handleInputChange('nomePaciente', e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 lg:py-4 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-base ${
                    errors.nomePaciente ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                  }`}
                  placeholder="Digite o nome do paciente"
                  aria-describedby={errors.nomePaciente ? "nomePaciente-error" : undefined}
                />
              </div>
              {errors.nomePaciente && (
                <p id="nomePaciente-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.nomePaciente}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-2">
                Data *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 lg:py-4 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-base ${
                    errors.data ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                  }`}
                  aria-describedby={errors.data ? "data-error" : undefined}
                />
              </div>
              {errors.data && (
                <p id="data-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.data}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="mes" className="block text-sm font-medium text-gray-700 mb-2">
                Mês
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="mes"
                  type="text"
                  value={formData.mes}
                  onChange={(e) => handleInputChange('mes', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="Ex: dezembro 2024"
                />
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
            <div>
              <label htmlFor="pacienteChegou" className="block text-sm font-medium text-gray-700 mb-2">
                Paciente chegou ao estúdio:
              </label>
              <textarea
                id="pacienteChegou"
                value={formData.pacienteChegou}
                onChange={(e) => handleInputChange('pacienteChegou', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                placeholder="Descreva como o paciente chegou ao estúdio, seu estado geral, queixas, etc..."
              />
            </div>

            <div>
              <label htmlFor="foiRealizado" className="block text-sm font-medium text-gray-700 mb-2">
                Foi Realizado:
              </label>
              <textarea
                id="foiRealizado"
                value={formData.foiRealizado}
                onChange={(e) => handleInputChange('foiRealizado', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                placeholder="Descreva o que foi realizado na sessão, exercícios, abordagens, etc..."
              />
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
                          <input
                            type="checkbox"
                            checked={formData.exercicios[aparelho]?.[local]?.[tipo] || false}
                            onChange={() => handleCheckboxChange(aparelho, local, tipo)}
                            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 cursor-pointer"
                          />
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
            <div>
              <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">
                OBSERVAÇÕES
              </label>
              <textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                placeholder="Observações gerais sobre a sessão, evolução do paciente, recomendações, etc..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fisioterapeuta" className="block text-sm font-medium text-gray-700 mb-2">
                  Fisioterapeuta
                </label>
                <input
                  id="fisioterapeuta"
                  type="text"
                  value={formData.fisioterapeuta}
                  onChange={(e) => handleInputChange('fisioterapeuta', e.target.value)}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="Nome do fisioterapeuta"
                />
              </div>

              <div>
                <label htmlFor="crefito" className="block text-sm font-medium text-gray-700 mb-2">
                  Crefito
                </label>
                <input
                  id="crefito"
                  type="text"
                  value={formData.crefito}
                  onChange={(e) => handleInputChange('crefito', e.target.value)}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="Número do Crefito"
                />
              </div>
            </div>
          </div>
        </div>

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
            {isEdit ? 'Atualizar Ficha' : 'Salvar Ficha'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FichaEvolucaoPilates;