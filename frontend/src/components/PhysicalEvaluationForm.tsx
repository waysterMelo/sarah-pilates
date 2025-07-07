import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  User, 
  GraduationCap, 
  Calendar, 
  Weight,
  Ruler,
  Heart,
  Activity,
  Target,
  Camera,
  Upload,
  AlertCircle,
  Plus,
  X
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

interface Student {
  id: number;
  name: string;
}

interface Instructor {
  id: number;
  name: string;
}

interface PhysicalEvaluationFormProps {
  evaluation?: PhysicalEvaluation | null;
  isEdit: boolean;
  onSave: (evaluation: Omit<PhysicalEvaluation, 'id'>) => void;
  onCancel: () => void;
}

const PhysicalEvaluationForm: React.FC<PhysicalEvaluationFormProps> = ({ 
  evaluation, 
  isEdit, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    studentId: 0,
    studentName: '',
    instructorId: 0,
    instructorName: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Inicial' as 'Inicial' | 'Progresso' | 'Final' | 'Médica',
    weight: 0,
    height: 0,
    bmi: 0,
    bloodPressure: '',
    heartRate: 0,
    bodyFat: 0,
    muscleMass: 0,
    measurements: {
      chest: 0,
      waist: 0,
      hip: 0,
      thigh: 0,
      arm: 0
    },
    flexibility: {
      shoulderFlexion: 0,
      spinalFlexion: 0,
      hipFlexion: 0,
      ankleFlexion: 0
    },
    strength: {
      core: 0,
      upperBody: 0,
      lowerBody: 0,
      grip: 0
    },
    balance: {
      staticBalance: 0,
      dynamicBalance: 0,
      proprioception: 0
    },
    postureAnalysis: {
      head: '',
      shoulders: '',
      spine: '',
      pelvis: '',
      knees: '',
      feet: ''
    },
    medicalObservations: '',
    objectives: '',
    treatmentPlan: '',
    recommendations: '',
    nextEvaluationDate: '',
    photos: [] as string[],
    attachments: [] as string[],
    createdAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data - em um app real, viria de uma API
  const students: Student[] = [
    { id: 1, name: 'Ana Silva Santos' },
    { id: 2, name: 'Maria Santos Oliveira' },
    { id: 3, name: 'João Pedro Costa' },
  ];

  const instructors: Instructor[] = [
    { id: 1, name: 'Sarah Costa Silva' },
    { id: 2, name: 'Carla Mendes Santos' },
    { id: 3, name: 'Roberto Lima Oliveira' },
  ];

  useEffect(() => {
    if (evaluation && isEdit) {
      setFormData({
        studentId: evaluation.studentId,
        studentName: evaluation.studentName,
        instructorId: evaluation.instructorId,
        instructorName: evaluation.instructorName,
        date: evaluation.date,
        type: evaluation.type,
        weight: evaluation.weight,
        height: evaluation.height,
        bmi: evaluation.bmi,
        bloodPressure: evaluation.bloodPressure,
        heartRate: evaluation.heartRate,
        bodyFat: evaluation.bodyFat || 0,
        muscleMass: evaluation.muscleMass || 0,
        measurements: evaluation.measurements,
        flexibility: evaluation.flexibility,
        strength: evaluation.strength,
        balance: evaluation.balance,
        postureAnalysis: evaluation.postureAnalysis,
        medicalObservations: evaluation.medicalObservations,
        objectives: evaluation.objectives,
        treatmentPlan: evaluation.treatmentPlan,
        recommendations: evaluation.recommendations,
        nextEvaluationDate: evaluation.nextEvaluationDate,
        photos: evaluation.photos,
        attachments: evaluation.attachments,
        createdAt: evaluation.createdAt
      });
    }
  }, [evaluation, isEdit]);

  // Calcular IMC automaticamente
  useEffect(() => {
    if (formData.weight > 0 && formData.height > 0) {
      const bmi = formData.weight / (formData.height * formData.height);
      setFormData(prev => ({ ...prev, bmi: parseFloat(bmi.toFixed(1)) }));
    }
  }, [formData.weight, formData.height]);

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

    if (formData.weight <= 0) {
      newErrors.weight = 'Peso deve ser maior que zero';
    }

    if (formData.height <= 0) {
      newErrors.height = 'Altura deve ser maior que zero';
    }

    if (formData.heartRate <= 0) {
      newErrors.heartRate = 'Frequência cardíaca deve ser maior que zero';
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

  const handleInstructorChange = (instructorId: number) => {
    const instructor = instructors.find(i => i.id === instructorId);
    if (instructor) {
      handleInputChange('instructorId', instructorId);
      handleInputChange('instructorName', instructor.name);
    }
  };

  const addPhoto = () => {
    // Simular upload de foto
    const newPhoto = `foto_${Date.now()}.jpg`;
    handleInputChange('photos', [...formData.photos, newPhoto]);
  };

  const removePhoto = (photo: string) => {
    handleInputChange('photos', formData.photos.filter(p => p !== photo));
  };

  const addAttachment = () => {
    // Simular upload de anexo
    const newAttachment = `documento_${Date.now()}.pdf`;
    handleInputChange('attachments', [...formData.attachments, newAttachment]);
  };

  const removeAttachment = (attachment: string) => {
    handleInputChange('attachments', formData.attachments.filter(a => a !== attachment));
  };

  const renderScaleInput = (label: string, value: number, onChange: (value: number) => void, max: number = 5) => {
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
            {isEdit ? 'Editar Avaliação Física' : 'Nova Avaliação Física'}
            <div className="absolute -bottom-1 lg:-bottom-2 left-0 w-12 lg:w-16 h-0.5 lg:h-1 bg-primary-gradient rounded-full"></div>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {isEdit ? 'Atualize os dados da avaliação física' : 'Registre uma nova avaliação física completa'}
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-none lg:max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Informações Básicas */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
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
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Avaliação
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value as PhysicalEvaluation['type'])}
                    className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  >
                    <option value="Inicial">Inicial</option>
                    <option value="Progresso">Progresso</option>
                    <option value="Final">Final</option>
                    <option value="Médica">Médica</option>
                  </select>
                </div>
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

            <div className="space-y-4 lg:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg) *
                  </label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight || ''}
                      onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                      className={`w-full pl-12 pr-4 py-3 lg:py-4 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-base ${
                        errors.weight ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                      }`}
                      placeholder="0.0"
                      aria-describedby={errors.weight ? "weight-error" : undefined}
                    />
                  </div>
                  {errors.weight && (
                    <p id="weight-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.weight}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (m) *
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="height"
                      type="number"
                      step="0.01"
                      value={formData.height || ''}
                      onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
                      className={`w-full pl-12 pr-4 py-3 lg:py-4 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-base ${
                        errors.height ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                      }`}
                      placeholder="0.00"
                      aria-describedby={errors.height ? "height-error" : undefined}
                    />
                  </div>
                  {errors.height && (
                    <p id="height-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.height}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IMC
                  </label>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <span className="text-2xl font-bold text-primary-600">{formData.bmi}</span>
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
                    value={formData.bodyFat || ''}
                    onChange={(e) => handleInputChange('bodyFat', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label htmlFor="muscleMass" className="block text-sm font-medium text-gray-700 mb-2">
                    Massa Muscular (kg)
                  </label>
                  <input
                    id="muscleMass"
                    type="number"
                    step="0.1"
                    value={formData.muscleMass || ''}
                    onChange={(e) => handleInputChange('muscleMass', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700 mb-2">
                    Pressão Arterial
                  </label>
                  <input
                    id="bloodPressure"
                    type="text"
                    value={formData.bloodPressure}
                    onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                    className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                    placeholder="120/80"
                  />
                </div>

                <div>
                  <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700 mb-2">
                    Frequência Cardíaca (bpm) *
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="heartRate"
                      type="number"
                      value={formData.heartRate || ''}
                      onChange={(e) => handleInputChange('heartRate', parseInt(e.target.value) || 0)}
                      className={`w-full pl-12 pr-4 py-3 lg:py-4 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-base ${
                        errors.heartRate ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                      }`}
                      placeholder="0"
                      aria-describedby={errors.heartRate ? "heartRate-error" : undefined}
                    />
                  </div>
                  {errors.heartRate && (
                    <p id="heartRate-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.heartRate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Medidas Corporais */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Medidas Corporais (cm)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chest" className="block text-sm font-medium text-gray-700 mb-2">
                  Tórax
                </label>
                <input
                  id="chest"
                  type="number"
                  value={formData.measurements.chest || ''}
                  onChange={(e) => handleNestedInputChange('measurements', 'chest', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="waist" className="block text-sm font-medium text-gray-700 mb-2">
                  Cintura
                </label>
                <input
                  id="waist"
                  type="number"
                  value={formData.measurements.waist || ''}
                  onChange={(e) => handleNestedInputChange('measurements', 'waist', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="hip" className="block text-sm font-medium text-gray-700 mb-2">
                  Quadril
                </label>
                <input
                  id="hip"
                  type="number"
                  value={formData.measurements.hip || ''}
                  onChange={(e) => handleNestedInputChange('measurements', 'hip', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="thigh" className="block text-sm font-medium text-gray-700 mb-2">
                  Coxa
                </label>
                <input
                  id="thigh"
                  type="number"
                  value={formData.measurements.thigh || ''}
                  onChange={(e) => handleNestedInputChange('measurements', 'thigh', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="arm" className="block text-sm font-medium text-gray-700 mb-2">
                  Braço
                </label>
                <input
                  id="arm"
                  type="number"
                  value={formData.measurements.arm || ''}
                  onChange={(e) => handleNestedInputChange('measurements', 'arm', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Testes de Flexibilidade */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Flexibilidade (graus)</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="shoulderFlexion" className="block text-sm font-medium text-gray-700 mb-2">
                  Flexão do Ombro
                </label>
                <input
                  id="shoulderFlexion"
                  type="number"
                  value={formData.flexibility.shoulderFlexion || ''}
                  onChange={(e) => handleNestedInputChange('flexibility', 'shoulderFlexion', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="spinalFlexion" className="block text-sm font-medium text-gray-700 mb-2">
                  Flexão da Coluna
                </label>
                <input
                  id="spinalFlexion"
                  type="number"
                  value={formData.flexibility.spinalFlexion || ''}
                  onChange={(e) => handleNestedInputChange('flexibility', 'spinalFlexion', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="hipFlexion" className="block text-sm font-medium text-gray-700 mb-2">
                  Flexão do Quadril
                </label>
                <input
                  id="hipFlexion"
                  type="number"
                  value={formData.flexibility.hipFlexion || ''}
                  onChange={(e) => handleNestedInputChange('flexibility', 'hipFlexion', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="ankleFlexion" className="block text-sm font-medium text-gray-700 mb-2">
                  Flexão do Tornozelo
                </label>
                <input
                  id="ankleFlexion"
                  type="number"
                  value={formData.flexibility.ankleFlexion || ''}
                  onChange={(e) => handleNestedInputChange('flexibility', 'ankleFlexion', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Testes de Força */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Testes de Força</h2>
            </div>

            <div className="space-y-6">
              {renderScaleInput(
                'Core',
                formData.strength.core,
                (value) => handleNestedInputChange('strength', 'core', value)
              )}

              {renderScaleInput(
                'Membros Superiores',
                formData.strength.upperBody,
                (value) => handleNestedInputChange('strength', 'upperBody', value)
              )}

              {renderScaleInput(
                'Membros Inferiores',
                formData.strength.lowerBody,
                (value) => handleNestedInputChange('strength', 'lowerBody', value)
              )}

              <div>
                <label htmlFor="grip" className="block text-sm font-medium text-gray-700 mb-2">
                  Força de Preensão (kg)
                </label>
                <input
                  id="grip"
                  type="number"
                  value={formData.strength.grip || ''}
                  onChange={(e) => handleNestedInputChange('strength', 'grip', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-base"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Testes de Equilíbrio */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Testes de Equilíbrio</h2>
            </div>

            <div className="space-y-6">
              {renderScaleInput(
                'Equilíbrio Estático',
                formData.balance.staticBalance,
                (value) => handleNestedInputChange('balance', 'staticBalance', value)
              )}

              {renderScaleInput(
                'Equilíbrio Dinâmico',
                formData.balance.dynamicBalance,
                (value) => handleNestedInputChange('balance', 'dynamicBalance', value)
              )}

              {renderScaleInput(
                'Propriocepção',
                formData.balance.proprioception,
                (value) => handleNestedInputChange('balance', 'proprioception', value)
              )}
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
              <div>
                <label htmlFor="head" className="block text-sm font-medium text-gray-700 mb-2">
                  Cabeça
                </label>
                <textarea
                  id="head"
                  value={formData.postureAnalysis.head}
                  onChange={(e) => handleNestedInputChange('postureAnalysis', 'head', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Observações sobre a posição da cabeça..."
                />
              </div>

              <div>
                <label htmlFor="shoulders" className="block text-sm font-medium text-gray-700 mb-2">
                  Ombros
                </label>
                <textarea
                  id="shoulders"
                  value={formData.postureAnalysis.shoulders}
                  onChange={(e) => handleNestedInputChange('postureAnalysis', 'shoulders', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Observações sobre os ombros..."
                />
              </div>

              <div>
                <label htmlFor="spine" className="block text-sm font-medium text-gray-700 mb-2">
                  Coluna Vertebral
                </label>
                <textarea
                  id="spine"
                  value={formData.postureAnalysis.spine}
                  onChange={(e) => handleNestedInputChange('postureAnalysis', 'spine', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Observações sobre a coluna..."
                />
              </div>

              <div>
                <label htmlFor="pelvis" className="block text-sm font-medium text-gray-700 mb-2">
                  Pelve
                </label>
                <textarea
                  id="pelvis"
                  value={formData.postureAnalysis.pelvis}
                  onChange={(e) => handleNestedInputChange('postureAnalysis', 'pelvis', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Observações sobre a pelve..."
                />
              </div>

              <div>
                <label htmlFor="knees" className="block text-sm font-medium text-gray-700 mb-2">
                  Joelhos
                </label>
                <textarea
                  id="knees"
                  value={formData.postureAnalysis.knees}
                  onChange={(e) => handleNestedInputChange('postureAnalysis', 'knees', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Observações sobre os joelhos..."
                />
              </div>

              <div>
                <label htmlFor="feet" className="block text-sm font-medium text-gray-700 mb-2">
                  Pés
                </label>
                <textarea
                  id="feet"
                  value={formData.postureAnalysis.feet}
                  onChange={(e) => handleNestedInputChange('postureAnalysis', 'feet', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Observações sobre os pés..."
                />
              </div>
            </div>
          </div>

          {/* Observações e Plano */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Observações e Plano de Tratamento</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="medicalObservations" className="block text-sm font-medium text-gray-700 mb-2">
                  Observações Médicas
                </label>
                <textarea
                  id="medicalObservations"
                  value={formData.medicalObservations}
                  onChange={(e) => handleInputChange('medicalObservations', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Observações médicas relevantes..."
                />
              </div>

              <div>
                <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivos
                </label>
                <textarea
                  id="objectives"
                  value={formData.objectives}
                  onChange={(e) => handleInputChange('objectives', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Objetivos do tratamento..."
                />
              </div>

              <div>
                <label htmlFor="treatmentPlan" className="block text-sm font-medium text-gray-700 mb-2">
                  Plano de Tratamento
                </label>
                <textarea
                  id="treatmentPlan"
                  value={formData.treatmentPlan}
                  onChange={(e) => handleInputChange('treatmentPlan', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none text-base"
                  placeholder="Plano detalhado de tratamento..."
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
                  placeholder="Recomendações gerais..."
                />
              </div>
            </div>
          </div>

          {/* Fotos e Anexos */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-3d p-6 lg:p-8 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Camera className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Fotos e Anexos</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos de Avaliação
                </label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={addPhoto}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-primary-500 hover:text-primary-500 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Adicionar Foto
                  </button>
                  <div className="space-y-2">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{photo}</span>
                        <button
                          type="button"
                          onClick={() => removePhoto(photo)}
                          className="text-red-500 hover:text-red-700 min-h-[24px] min-w-[24px] flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anexos (Exames, Laudos)
                </label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={addAttachment}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-primary-500 hover:text-primary-500 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Adicionar Anexo
                  </button>
                  <div className="space-y-2">
                    {formData.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{attachment}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment)}
                          className="text-red-500 hover:text-red-700 min-h-[24px] min-w-[24px] flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
            {isEdit ? 'Atualizar Avaliação' : 'Salvar Avaliação'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PhysicalEvaluationForm;