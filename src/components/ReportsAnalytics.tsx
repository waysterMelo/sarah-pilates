import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  DollarSign,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  Activity,
  Target,
  Clock,
  Award,
  AlertTriangle
} from 'lucide-react';

interface ReportData {
  totalStudents: number;
  activeStudents: number;
  monthlyRevenue: number;
  completedClasses: number;
  averageAttendance: number;
  topInstructors: Array<{
    name: string;
    classes: number;
    revenue: number;
  }>;
  monthlyGrowth: Array<{
    month: string;
    students: number;
    revenue: number;
    classes: number;
  }>;
  classTypeDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  attendanceByDay: Array<{
    day: string;
    attendance: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
}

const ReportsAnalytics = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Mock data - em produção viria da API
  useEffect(() => {
    const mockData: ReportData = {
      totalStudents: 156,
      activeStudents: 142,
      monthlyRevenue: 12480,
      completedClasses: 324,
      averageAttendance: 87.5,
      topInstructors: [
        { name: 'Sarah Costa Silva', classes: 89, revenue: 7120 },
        { name: 'Carla Mendes Santos', classes: 76, revenue: 6080 },
        { name: 'Roberto Lima Oliveira', classes: 45, revenue: 3600 }
      ],
      monthlyGrowth: [
        { month: 'Jan', students: 120, revenue: 9600, classes: 280 },
        { month: 'Fev', students: 125, revenue: 10000, classes: 295 },
        { month: 'Mar', students: 132, revenue: 10560, classes: 310 },
        { month: 'Abr', students: 138, revenue: 11040, classes: 315 },
        { month: 'Mai', students: 145, revenue: 11600, classes: 320 },
        { month: 'Jun', students: 156, revenue: 12480, classes: 324 }
      ],
      classTypeDistribution: [
        { type: 'Pilates Solo', count: 145, percentage: 44.8 },
        { type: 'Pilates Aparelhos', count: 89, percentage: 27.5 },
        { type: 'Pilates Terapêutico', count: 56, percentage: 17.3 },
        { type: 'Pilates para Idosos', count: 34, percentage: 10.4 }
      ],
      attendanceByDay: [
        { day: 'Seg', attendance: 92 },
        { day: 'Ter', attendance: 88 },
        { day: 'Qua', attendance: 95 },
        { day: 'Qui', attendance: 90 },
        { day: 'Sex', attendance: 85 },
        { day: 'Sáb', attendance: 78 }
      ],
      revenueByMonth: [
        { month: 'Jan', revenue: 9600 },
        { month: 'Fev', revenue: 10000 },
        { month: 'Mar', revenue: 10560 },
        { month: 'Abr', revenue: 11040 },
        { month: 'Mai', revenue: 11600 },
        { month: 'Jun', revenue: 12480 }
      ]
    };

    setTimeout(() => {
      setReportData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const exportReport = (format: 'pdf' | 'excel') => {
    // Implementar exportação
    console.log(`Exportando relatório em ${format}`);
  };

  const refreshData = () => {
    setLoading(true);
    // Recarregar dados
    setTimeout(() => setLoading(false), 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
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
              Relatórios e Analytics
              <div className="absolute -bottom-1 lg:-bottom-2 left-0 w-12 lg:w-16 h-0.5 lg:h-1 bg-primary-gradient rounded-full"></div>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Análise completa do desempenho do seu estúdio</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button
            onClick={refreshData}
            className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 hover:bg-gray-200 text-sm sm:text-base min-h-[44px] justify-center"
          >
            <RefreshCw className="w-5 h-5" />
            Atualizar
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => exportReport('pdf')}
              className="bg-red-500 text-white px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 hover:bg-red-600 text-sm min-h-[44px] justify-center"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={() => exportReport('excel')}
              className="bg-green-500 text-white px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 hover:bg-green-600 text-sm min-h-[44px] justify-center"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-4 sm:p-6 mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500 text-base"
            >
              <option value="week">Última Semana</option>
              <option value="month">Último Mês</option>
              <option value="quarter">Último Trimestre</option>
              <option value="year">Último Ano</option>
            </select>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'financial', label: 'Financeiro', icon: DollarSign },
              { id: 'attendance', label: 'Frequência', icon: Users },
              { id: 'performance', label: 'Performance', icon: TrendingUp }
            ].map((report) => {
              const Icon = report.icon;
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 text-sm min-h-[44px] ${
                    selectedReport === report.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {report.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Alunos</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{reportData?.totalStudents}</p>
              <p className="text-sm text-green-600 mt-1">+12% vs mês anterior</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Receita Mensal</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                R$ {reportData?.monthlyRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">+8% vs mês anterior</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Aulas Concluídas</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">{reportData?.completedClasses}</p>
              <p className="text-sm text-green-600 mt-1">+5% vs mês anterior</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl lg:rounded-3xl shadow-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Taxa de Presença</p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">{reportData?.averageAttendance}%</p>
              <p className="text-sm text-green-600 mt-1">+2% vs mês anterior</p>
            </div>
            <Activity className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
        {/* Crescimento Mensal */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
            </div>
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Crescimento Mensal</h2>
          </div>
          
          <div className="space-y-4">
            {reportData?.monthlyGrowth.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{month.month}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-blue-600">{month.students} alunos</span>
                  <span className="text-green-600">R$ {month.revenue.toLocaleString()}</span>
                  <span className="text-purple-600">{month.classes} aulas</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribuição por Tipo de Aula */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <PieChart className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
            </div>
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Tipos de Aula</h2>
          </div>
          
          <div className="space-y-3">
            {reportData?.classTypeDistribution.map((type, index) => (
              <div key={type.type} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{type.type}</span>
                  <span className="text-gray-600">{type.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${type.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Instrutores */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 mb-6 lg:mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Award className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-600" />
          </div>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Top Instrutores</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reportData?.topInstructors.map((instructor, index) => (
            <div key={instructor.name} className="text-center p-6 bg-gray-50 rounded-xl">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold ${
                index === 0 ? 'bg-yellow-500' :
                index === 1 ? 'bg-gray-400' : 'bg-orange-500'
              }`}>
                {index + 1}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{instructor.name}</h3>
              <p className="text-sm text-gray-600">{instructor.classes} aulas</p>
              <p className="text-sm text-green-600 font-medium">R$ {instructor.revenue.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Frequência por Dia da Semana */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
          </div>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Frequência por Dia da Semana</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {reportData?.attendanceByDay.map((day) => (
            <div key={day.day} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">{day.day}</p>
              <p className="text-2xl font-bold text-green-600">{day.attendance}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;