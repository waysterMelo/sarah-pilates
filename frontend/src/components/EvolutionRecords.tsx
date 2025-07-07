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
import FichaEvolucaoPilates from './FichaEvolucaoPilates';
import FichaEvolucaoDetails from './FichaEvolucaoDetails';

interface FichaEvolucao {
  id: number;
  nomePaciente: string;
  date: string;
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

const EvolutionRecords = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<FichaEvolucao[]>([
    {
      id: 1,
      nomePaciente: 'Ana Silva Santos',
      date: '2024-12-15',
      mes: 'dezembro 2024',
      pacienteChegou: 'Paciente chegou ao estúdio relatando dores lombares leves após longo período sentada no trabalho.',
      foiRealizado: 'Sessão focada em fortalecimento do core e mobilização da coluna vertebral com exercícios de Mat Pilates.',
      exercicios: {
        'MAT PILATES': {
          'MMSS': {
            alongamento: true,
            fortalecimento: false,
            coordenacao: true,
            equilibrio: false,
            core: false
          },
          'MMII': {
            alongamento: true,
            fortalecimento: true,
            coordenacao: false,
            equilibrio: true,
            core: false
          },
          'Coluna Vertebral': {
            alongamento: true,
            fortalecimento: true,
            coordenacao: true,
            equilibrio: false,
            core: true
          }
        },
        'REFORMER': {
          'MMSS': {
            alongamento: false,
            fortalecimento: true,
            coordenacao: false,
            equilibrio: false,
            core: false
          },
          'MMII': {
            alongamento: false,
            fortalecimento: true,
            coordenacao: true,
            equilibrio: false,
            core: true
          },
          'Coluna Vertebral': {
            alongamento: true,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: true
          }
        },
        'CADILLAC': {
          'MMSS': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          },
          'MMII': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          },
          'Coluna Vertebral': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          }
        },
        'CHAIR': {
          'MMSS': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          },
          'MMII': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          },
          'Coluna Vertebral': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          }
        },
        'BARREL': {
          'MMSS': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          },
          'MMII': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          },
          'Coluna Vertebral': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          }
        }
      },
      observacoes: 'Paciente apresentou boa evolução durante a sessão. Executou os exercícios com consciência corporal e respiração adequada.',
      fisioterapeuta: 'Sarah Costa Silva',
      crefito: 'CREFITO-3/123456',
      createdAt: '2024-12-15T10:00:00Z'
    },
    {
      id: 2,
      nomePaciente: 'Maria Santos Oliveira',
      date: '2024-12-14',
      mes: 'dezembro 2024',
      pacienteChegou: 'Paciente chegou mais animada, relatando melhora na flexibilidade após as últimas sessões.',
      foiRealizado: 'Trabalho de mobilidade articular no Reformer e exercícios de alongamento no Mat.',
      exercicios: {
        'MAT PILATES': {
          'MMSS': {
            alongamento: true,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          },
          'MMII': {
            alongamento: true,
            fortalecimento: false,
            coordenacao: true,
            equilibrio: false,
            core: false
          },
          'Coluna Vertebral': {
            alongamento: true,
            fortalecimento: false,
            coordenacao: true,
            equilibrio: false,
            core: false
          }
        },
        'REFORMER': {
          'MMSS': {
            alongamento: true,
            fortalecimento: false,
            coordenacao: true,
            equilibrio: false,
            core: false
          },
          'MMII': {
            alongamento: true,
            fortalecimento: true,
            coordenacao: false,
            equilibrio: true,
            core: false
          },
          'Coluna Vertebral': {
            alongamento: true,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          }
        },
        'CADILLAC': {
          'MMSS': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          },
          'MMII': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          },
          'Coluna Vertebral': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          }
        },
        'CHAIR': {
          'MMSS': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          },
          'MMII': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          },
          'Coluna Vertebral': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          }
        },
        'BARREL': {
          'MMSS': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          },
          'MMII': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          },
          'Coluna Vertebral': {
            alongamento: false,
            fortalecimento: false,
            coordenacao: false,
            equilibrio: false,
            core: false
          }
        }
      },
      observacoes: 'Excelente progresso na mobilidade. Paciente demonstra maior consciência corporal.',
      fisioterapeuta: 'Carla Mendes Santos',
      crefito: 'CREFITO-3/654321',
      createdAt: '2024-12-14T14:30:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPatient, setFilterPatient] = useState('Todos');
  const [filterDate, setFilterDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FichaEvolucao | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Get unique patients for filter
  const allPatients = Array.from(new Set(records.map(record => record.nomePaciente)));

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.nomePaciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.fisioterapeuta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.observacoes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.pacienteChegou.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.foiRealizado.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPatient = filterPatient === 'Todos' || record.nomePaciente === filterPatient;
    const matchesDate = !filterDate || record.date === filterDate;
    return matchesSearch && matchesPatient && matchesDate;
  });

  const handleAddRecord = () => {
    setSelectedRecord(null);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEditRecord = (record: FichaEvolucao) => {
    setSelectedRecord(record);
    setEditMode(true);
    setShowForm(true);
  };

  const handleViewRecord = (record: FichaEvolucao) => {
    setSelectedRecord(record);
    setShowDetails(true);
  };

  const handleDeleteRecord = (recordId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta ficha de evolução?')) {
      setRecords(records.filter(r => r.id !== recordId));
    }
  };

  const handleSaveRecord = (recordData: Omit<FichaEvolucao, 'id'>) => {
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

  const getActiveExerciseCount = (ficha: FichaEvolucao) => {
    let count = 0;
    Object.values(ficha.exercicios).forEach(aparelho => {
      Object.values(aparelho).forEach(local => {
        Object.values(local).forEach(ativo => {
          if (ativo) count++;
        });
      });
    });
    return count;
  };

  const getTotalExerciseCount = () => {
    return records.reduce((acc, record) => acc + getActiveExerciseCount(record), 0);
  };

  if (showForm) {
    return (
      <FichaEvolucaoPilates
        ficha={selectedRecord}
        isEdit={editMode}
        onSave={handleSaveRecord}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  if (showDetails && selectedRecord) {
    return (
      <FichaEvolucaoDetails
        ficha={selectedRecord}
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
              placeholder="Buscar por paciente, fisioterapeuta ou observações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-slate-50 transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:bg-white text-base"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterPatient}
                onChange={(e) => setFilterPatient(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500 text-base"
              >
                <option value="Todos">Todos os Pacientes</option>
                {allPatients.map((patient) => (
                  <option key={patient} value={patient}>
                    {patient}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500 text-base"
              placeholder="Filtrar por data"
            />
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
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
              <p className="text-gray-600 text-sm">Total Exercícios</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{getTotalExerciseCount()}</p>
            </div>
            <Activity className="w-6 sm:w-8 h-6 sm:h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pacientes Únicos</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {allPatients.length}
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
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Data</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Paciente</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Fisioterapeuta</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Exercícios</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm sm:text-base">Mês</th>
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
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-gray-800 text-sm sm:text-base">{record.nomePaciente}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700 text-sm sm:text-base">{record.fisioterapeuta}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Activity className="w-4 h-4" />
                      {getActiveExerciseCount(record)} exercícios
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700 text-sm sm:text-base">{record.mes}</span>
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
              {searchTerm || filterPatient !== 'Todos' || filterDate
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