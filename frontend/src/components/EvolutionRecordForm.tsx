import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  User, 
  GraduationCap, 
  Calendar, 
  Clock,
  Target,
  Activity,
  FileText,
  Star,
  AlertCircle,
  Plus,
  X,
  TrendingUp
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

interface Student {
  id: number;
  name: string;
}

interface Instructor {
  id: number;
  name: string;
}

interface EvolutionRecordFormProps {
  record?: EvolutionRecord | null;
  isEdit: boolean;
  onSave: (record: Omit<EvolutionRecord, 'id'>) => void;
  onCancel: () => void;
  students: Student[];
  instructors: Instructor[];
}

const EvolutionRecordForm: React.FC<EvolutionRecordFormProps> = ({ 
  record, 
  isEdit, 
  onSave, 
  onCancel, 
  students, 
  instructors 
}) => {
  const [formData, setFormData] = useState({
    studentId: 0,
    studentName: '',
    instructorId: 0,
    instructorName: '',
    date: new Date().toISOString().split('T')[0],
    session: 1,
    focus: '',
    exercisesPerformed: [] as string[],
    progressNotes: '',
    difficultiesObserved: '',
    improvements: '',
    nextSessionGoals: '',
    overallRating: 3,
    painLevel: 0,
    mobilityLevel: 3,
    strengthLevel: 3,
    balanceLevel: 3,
    enduranceLevel: 3,
    observations: '',
    equipment: [] as string[],
    duration: 60,
    createdAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newExercise, setNewExercise] = useState('');
  const [newEquipment, setNewEquipment] = useState('');

  const focusAreas = [
    'Fortalecimento do Core',
    'Mobilidade e Flexibilidade', 
    'Reabilitação Lombar',
    'Equilíbrio e Coordenação',
    'Condicionamento Físico',
    'Alívio de Dores',
    'Postura',
    'Respiração',
    'Relaxamento',
    'Funcional'
  ];

  const commonExercises = [
    'Hundred', 'Roll Up', 'Roll Down', 'Single Leg Circles', 'Rolling Like a Ball',
    'Single Leg Stretch', 'Double Leg Stretch', 'Scissors', 'Lower Lift', 'Teaser',
    'Swan', 'Single Leg Kick', 'Double Leg Kick', 'Neck Pull', 'Spine Stretch',
    'Open Leg Rocker', 'Corkscrew', 'Saw', 'Side Kick Series', 'Swimming',
    'Leg Pull Front', 'Leg Pull Back', 'Push Up', 'Plank', 'Side Plank'
  ];

  const commonEquipment = [
    'Mat', 'Bola', 'Magic Circle', 'Theraband', 'Reformer', 'Cadillac',
    'Chair', 'Barrel', 'Bosu', 'Rolo', 'Almofada', 'Faixa Elástica'
  ];

  useEffect(() => {
    if (record && isEdit) {
      setFormData({
        studentId: record.studentId,
        studentName: record.studentName,
        instructorId: record.instructorId,
        instructorName: record.instructorName,
        date: record.date,
        session: record.session,
        focus: record.focus,
        exercisesPerformed: record.exercisesPerformed,
        progressNotes: record.progressNotes,
        difficultiesObserved: record.difficultiesObserved,
        improvements: record.improvements,
        nextSessionGoals: record.nextSessionGoals,
        overallRating: record.overallRating,
        painLevel: record.painLevel,
        mobilityLevel: record.mobilityLevel,
        strengthLevel: record.strengthLevel,
        balanceLevel: record.balanceLevel,
        enduranceLevel: record.enduranceLevel,
        observations: record.observations,
        equipment: record.equipment,
        duration: record.duration,
        createdAt: record.createdAt
      });
    }
  }, [record, isEdit]);

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

    if (!formData.focus.trim()) {
      newErrors.focus = 'Foco da sessão é obrigatório';
    }

    if (formData.session < 1) {
      newErrors.session = 'Número da sessão deve ser maior que zero';
    }

    if (formData.duration < 1) {
      newErrors.duration = 'Duração deve ser maior que zero';
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

  const addExercise = () => {
    if (newExercise.trim() && !formData.exercisesPerformed.includes(newExercise.trim())) {
      handleInputChange('exercisesPerformed', [...formData.exercisesPerformed, newExercise.trim()]);
      setNewExercise('');
    }
  };

  const addCommonExercise = (exercise: string) => {
    if (!formData.exercisesPerformed.includes(exercise)) {
      handleInputChange('exercisesPerformed', [...formData.exercisesPerformed, exercise]);
    }
  };

  const removeExercise = (exercise: string) => {
    handleInputChange('exercisesPerformed', formData.exercisesPerformed.filter(e => e !== exercise));
  };

  const addEquipment = () => {
    if (newEquipment.trim() && !formData.equipment.includes(newEquipment.trim())) {
      handleInputChange('equipment', [...formData.equipment, newEquipment.trim()]);
      setNewEquipment('');
    }
  };

  const addCommonEquipment = (equipment: string) => {
    if (!formData.equipment.includes(equipment)) {
      handleInputChange('equipment', [...formData.equipment, equipment]);
    }
  };

  const removeEquipment = (equipment: string) => {
    handleInputChange('equipment', formData.equipment.filter(e => e !== equipment));
  };

  const renderRatingStars = (rating: number, onRatingChange: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`p-1 rounded transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
            }`}
          >
            <Star className={`w-5 h-5 ${star <= rating ? 'fill-current' : ''}`} />
          </button>
        ))}
      </div>
    );
  };

  const renderLevelSlider = (label: string, value: number, onChange: (value: number) => void, max: number = 5) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}: {value}/{max}
        </label>
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #6C5CE7 0%, #6C5CE7 ${(value/max)*100}%, #e5e7eb ${(value/max)*100}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>{max}</span>
        </div>
      </div>
    );
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
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent relative">
            {isEdit ? 'Editar Ficha de Evolução' : 'Nova Ficha de Evolução'}
            <div className="absolute -bottom-1 lg:-bottom-2 left-0 w-12 lg:w-16 h-0.5 lg:h-1 bg-primary-gradient rounded-full"></div>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {isEdit ? 'Atualize o progresso do aluno' : 'Registre o progresso da sessão'}
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-none lg:max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Informações Básicas */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Informações Básicas</h2>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <div>
                <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-2">
                  Aluno *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    id="student"
                    value={formData.studentId}
                    onChange={(e) => handleStudentChange(parseInt(e.target.value))}
                    className={`w-full pl-12 pr-4 py-3 lg:py-4 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-base ${
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
                </div>
                {errors.studentId && (
                  <p id="student-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.studentId}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-2">
                  Instrutor *
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    id="instructor"
                    value={formData.instructorId}
                    onChange={(e) => handleInstructorChange(parseInt(e.target.value))}
                    className={`w-full pl-12 pr-4 py-3 lg:py-4 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-base ${
                      errors.instructorId ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                    }`}
                    aria-describedby={errors.instructorId ? "instructor-error" : undefined}
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
                  <p id="instructor-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.instructorId}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Data da Sessão *
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
                  <label htmlFor="session" className="block text-sm font-medium text-gray-700 mb-2">
                    Nº da Sessão *
                  </label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="session"
                      type="number"
                      min="1"
                      value={formData.session}
                      onChange={(e) => handleInputChange('session', parseInt(e.target.value) || 1)}
                      className={`w-full pl-12 pr-4 py-3 lg:py-4 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-base ${
                        errors.session ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                      }`}
                      aria-describedby={errors.session ? "session-error" : undefined}
                    />
                  </div>
                  {errors.session && (
                    <p id="session-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.session}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="focus" className="block text-sm font-medium text-gray-700 mb-2">
                    Foco da Sessão *
                  </label>
                  <select
                    id="focus"
                    value={formData.focus}
                    onChange={(e) => handleInputChange('focus', e.target.value)}
                    className={`w-full px-4 py-3 lg:py-4 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-base ${
                      errors.focus ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                    }`}
                    aria-describedby={errors.focus ? "focus-error" : undefined}
                  >
                    <option value="">Selecione o foco</option>
                    {focusAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  {errors.focus && (
                    <p id="focus-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.focus}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    Duração (min) *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="duration"
                      type="number"
                      min="1"
                      max="120"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 60)}
                      className={`w-full pl-12 pr-4 py-3 lg:py-4 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-base ${
                        errors.duration ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                      }`}
                      aria-describedby={errors.duration ? "duration-error" : undefined}
                    />
                  </div>
                  {errors.duration && (
                    <p id="duration-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.duration}
                    </p>
                  )}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Avaliação Geral da Sessão
                </label>
                {renderRatingStars(formData.overallRating, (rating) => handleInputChange('overallRating', rating))}
              </div>

              <div className="space-y-4">
                {renderLevelSlider('Nível de Dor', formData.painLevel, (value) => handleInputChange('painLevel', value), 10)}
                {renderLevelSlider('Mobilidade', formData.mobilityLevel, (value) => handleInputChange('mobilityLevel', value))}
                {renderLevelSlider('Força', formData.strengthLevel, (value) => handleInputChange('strengthLevel', value))}
                {renderLevelSlider('Equilíbrio', formData.balanceLevel, (value) => handleInputChange('balanceLevel', value))}
                {renderLevelSlider('Resistência', formData.enduranceLevel, (value) => handleInputChange('enduranceLevel', value))}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exercícios Comuns
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {commonExercises.map((exercise) => (
                    <button
                      key={exercise}
                      type="button"
                      onClick={() => addCommonExercise(exercise)}
                      className={`p-2 text-sm rounded-lg border transition-all duration-200 min-h-[40px] ${
                        formData.exercisesPerformed.includes(exercise)
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {exercise}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="newExercise" className="block text-sm font-medium text-gray-700 mb-2">
                  Adicionar Exercício Personalizado
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="newExercise"
                    type="text"
                    value={newExercise}
                    onChange={(e) => setNewExercise(e.target.value)}
                    className="flex-1 px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                    placeholder="Digite um exercício"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExercise())}
                  />
                  <button
                    type="button"
                    onClick={addExercise}
                    className="px-4 py-3 lg:py-4 bg-primary-gradient text-white rounded-xl hover:shadow-lg transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exercícios Selecionados
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.exercisesPerformed.map((exercise) => (
                    <span
                      key={exercise}
                      className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {exercise}
                      <button
                        type="button"
                        onClick={() => removeExercise(exercise)}
                        className="text-green-500 hover:text-green-700 min-h-[24px] min-w-[24px] flex items-center justify-center"
                        aria-label={`Remover ${exercise}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                  {formData.exercisesPerformed.length === 0 && (
                    <p className="text-gray-500 italic text-sm">Nenhum exercício selecionado</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Equipamentos */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Plus className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Equipamentos Utilizados</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipamentos Comuns
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {commonEquipment.map((equipment) => (
                    <button
                      key={equipment}
                      type="button"
                      onClick={() => addCommonEquipment(equipment)}
                      className={`p-3 text-sm rounded-lg border transition-all duration-200 min-h-[44px] ${
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
                <label htmlFor="newEquipment" className="block text-sm font-medium text-gray-700 mb-2">
                  Adicionar Equipamento Personalizado
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="newEquipment"
                    type="text"
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    className="flex-1 px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                    placeholder="Digite um equipamento"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
                  />
                  <button
                    type="button"
                    onClick={addEquipment}
                    className="px-4 py-3 lg:py-4 bg-primary-gradient text-white rounded-xl hover:shadow-lg transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                      className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {equipment}
                      <button
                        type="button"
                        onClick={() => removeEquipment(equipment)}
                        className="text-purple-500 hover:text-purple-700 min-h-[24px] min-w-[24px] flex items-center justify-center"
                        aria-label={`Remover ${equipment}`}
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

          {/* Notas de Progresso */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Notas de Progresso</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="progressNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Progresso Observado
                </label>
                <textarea
                  id="progressNotes"
                  value={formData.progressNotes}
                  onChange={(e) => handleInputChange('progressNotes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Descreva os progressos observados durante a sessão..."
                />
              </div>

              <div>
                <label htmlFor="difficultiesObserved" className="block text-sm font-medium text-gray-700 mb-2">
                  Dificuldades Observadas
                </label>
                <textarea
                  id="difficultiesObserved"
                  value={formData.difficultiesObserved}
                  onChange={(e) => handleInputChange('difficultiesObserved', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Descreva as dificuldades encontradas pelo aluno..."
                />
              </div>

              <div>
                <label htmlFor="improvements" className="block text-sm font-medium text-gray-700 mb-2">
                  Melhorias Observadas
                </label>
                <textarea
                  id="improvements"
                  value={formData.improvements}
                  onChange={(e) => handleInputChange('improvements', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Descreva as melhorias em relação às sessões anteriores..."
                />
              </div>

              <div>
                <label htmlFor="nextSessionGoals" className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivos para Próxima Sessão
                </label>
                <textarea
                  id="nextSessionGoals"
                  value={formData.nextSessionGoals}
                  onChange={(e) => handleInputChange('nextSessionGoals', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Defina os objetivos e focos para a próxima sessão..."
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-2">
                Observações Gerais
              </label>
              <textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                placeholder="Observações adicionais sobre o aluno, comportamento, motivação, etc..."
              />
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6 lg:mt-8">
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

export default EvolutionRecordForm;