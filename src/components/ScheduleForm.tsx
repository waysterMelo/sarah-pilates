import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  User, 
  GraduationCap, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText,
  DollarSign,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';

interface Schedule {
  id: number;
  studentId: number;
  studentName: string;
  instructorId: number;
  instructorName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  status: 'Agendado' | 'Confirmado' | 'Concluído' | 'Cancelado' | 'Falta';
  notes: string;
  room: string;
  equipment: string[];
  price: number;
  paymentStatus: 'Pendente' | 'Pago' | 'Isento';
  createdAt: string;
}

interface ScheduleFormProps {
  schedule?: Schedule | null;
  isEdit: boolean;
  onSave: (schedule: Omit<Schedule, 'id'>) => void;
  onCancel: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ schedule, isEdit, onSave, onCancel }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: 0,
    studentName: '',
    instructorId: 0,
    instructorName: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'Pilates Solo',
    status: 'Agendado' as 'Agendado' | 'Confirmado' | 'Concluído' | 'Cancelado' | 'Falta',
    notes: '',
    room: 'Sala 1',
    equipment: [] as string[],
    price: 80,
    paymentStatus: 'Pendente' as 'Pendente' | 'Pago' | 'Isento',
    createdAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newEquipment, setNewEquipment] = useState('');

  // Mock data - em um app real, viria de uma API
  const students = [
    { id: 1, name: 'Ana Silva Santos' },
    { id: 2, name: 'Maria Santos Oliveira' },
    { id: 3, name: 'João Pedro Costa' },
  ];

  const instructors = [
    { id: 1, name: 'Sarah Costa Silva' },
    { id: 2, name: 'Carla Mendes Santos' },
    { id: 3, name: 'Roberto Lima Oliveira' },
  ];

  const classTypes = [
    'Pilates Solo',
    'Pilates Aparelhos',
    'Pilates Terapêutico',
    'Pilates para Idosos',
    'Pilates na Gravidez',
    'Pilates para Atletas',
    'Pilates Funcional'
  ];

  const rooms = [
    'Sala 1',
    'Sala 2',
    'Sala 3',
    'Sala de Aparelhos',
    'Sala Terapêutica'
  ];

  const commonEquipment = [
    'Mat',
    'Bola',
    'Magic Circle',
    'Theraband',
    'Reformer',
    'Cadillac',
    'Chair',
    'Barrel',
    'Bosu',
    'Rolo'
  ];

  useEffect(() => {
    if (schedule && isEdit) {
      setFormData({
        studentId: schedule.studentId,
        studentName: schedule.studentName,
        instructorId: schedule.instructorId,
        instructorName: schedule.instructorName,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        type: schedule.type,
        status: schedule.status,
        notes: schedule.notes,
        room: schedule.room,
        equipment: schedule.equipment,
        price: schedule.price,
        paymentStatus: schedule.paymentStatus,
        createdAt: schedule.createdAt
      });
    }
  }, [schedule, isEdit]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentId) {
      newErrors.studentId = 'Aluno é obrigatório';
    }

    if (!formData.instructorId) {
      newErrors.instructorId = 'Instrutor é obrigatório';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Horário de início é obrigatório';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Horário de fim é obrigatório';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'Horário de fim deve ser posterior ao início';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Valor deve ser maior que zero';
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

  const handleStudentChange = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      handleInputChange('studentId', studentId);
      handleInputChange('studentName', student.name);
    }
  };

  const handleInstructorChange = (instructorId: number) => {
    const instructor = instructors.find(i => i.id === instructorId);
    if (instructor) {
      handleInputChange('instructorId', instructorId);
      handleInputChange('instructorName', instructor.name);
    }
  };

  const addEquipment = () => {
    if (newEquipment.trim() && !formData.equipment.includes(newEquipment.trim())) {
      handleInputChange('equipment', [...formData.equipment, newEquipment.trim()]);
      setNewEquipment('');
    }
  };

  const removeEquipment = (equipment: string) => {
    handleInputChange('equipment', formData.equipment.filter(e => e !== equipment));
  };

  const addCommonEquipment = (equipment: string) => {
    if (!formData.equipment.includes(equipment)) {
      handleInputChange('equipment', [...formData.equipment, equipment]);
    }
  };

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={onCancel}
          className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent relative">
            {isEdit ? 'Editar Agendamento' : 'Novo Agendamento'}
            <div className="absolute -bottom-2 left-0 w-16 h-1 bg-primary-gradient rounded-full"></div>
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Atualize as informações do agendamento' : 'Preencha os dados do novo agendamento'}
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações Básicas */}
          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Informações Básicas</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aluno *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={formData.studentId}
                    onChange={(e) => handleStudentChange(parseInt(e.target.value))}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 ${
                      errors.studentId ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                    }`}
                  >
                    <option value={0}>Selecione um aluno</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.studentId && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.studentId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instrutor *
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={formData.instructorId}
                    onChange={(e) => handleInstructorChange(parseInt(e.target.value))}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 ${
                      errors.instructorId ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                    }`}
                  >
                    <option value={0}>Selecione um instrutor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.instructorId && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.instructorId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 ${
                      errors.date ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                    }`}
                  />
                </div>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.date}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário Início *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 ${
                        errors.startTime ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                      }`}
                    />
                  </div>
                  {errors.startTime && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.startTime}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário Fim *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 ${
                        errors.endTime ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                      }`}
                    />
                  </div>
                  {errors.endTime && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.endTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detalhes da Aula */}
          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Detalhes da Aula</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Aula
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20"
                >
                  {classTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sala
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={formData.room}
                    onChange={(e) => handleInputChange('room', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20"
                  >
                    {rooms.map((room) => (
                      <option key={room} value={room}>
                        {room}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor da Aula *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 ${
                      errors.price ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.price}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as Schedule['status'])}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20"
                  >
                    <option value="Agendado">Agendado</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Falta">Falta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Pagamento
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => handleInputChange('paymentStatus', e.target.value as Schedule['paymentStatus'])}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                    <option value="Isento">Isento</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Equipamentos */}
          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Equipamentos</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipamentos Comuns
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {commonEquipment.map((equipment) => (
                    <button
                      key={equipment}
                      type="button"
                      onClick={() => addCommonEquipment(equipment)}
                      className={`p-2 text-sm rounded-lg border transition-all duration-200 ${
                        formData.equipment.includes(equipment)
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {equipment}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adicionar Equipamento Personalizado
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20"
                    placeholder="Digite um equipamento"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
                  />
                  <button
                    type="button"
                    onClick={addEquipment}
                    className="px-4 py-3 bg-primary-gradient text-white rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipamentos Selecionados
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.equipment.map((equipment) => (
                    <span
                      key={equipment}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {equipment}
                      <button
                        type="button"
                        onClick={() => removeEquipment(equipment)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                  {formData.equipment.length === 0 && (
                    <p className="text-gray-500 italic text-sm">Nenhum equipamento selecionado</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="bg-white rounded-3xl shadow-3d p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Observações</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas da Aula
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none"
                placeholder="Observações sobre a aula, objetivos específicos, restrições, etc..."
              />
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-300 hover:bg-gray-50 hover:-translate-y-1"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-primary-gradient text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-500 hover:shadow-neon hover:-translate-y-1"
          >
            <Save className="w-5 h-5" />
            {isEdit ? 'Atualizar Agendamento' : 'Salvar Agendamento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;