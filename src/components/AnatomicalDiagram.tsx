import React, { useState, useRef, useCallback } from 'react';
import { Plus, X, MapPin, AlertTriangle, Eye, Trash2 } from 'lucide-react';

interface AnatomicalMarker {
  id: string;
  x: number;
  y: number;
  type: 'pain' | 'injury' | 'observation';
  description: string;
  bodyPart: string;
}

interface AnatomicalDiagramProps {
  markers: AnatomicalMarker[];
  onMarkerAdd: (marker: Omit<AnatomicalMarker, 'id'>) => void;
  onMarkerRemove: (markerId: string) => void;
}

// Definição das áreas anatômicas com coordenadas precisas para o boneco original
const BODY_PARTS = {
  head: {
    name: 'Cabeça',
    bounds: { x: 180, y: 20, width: 40, height: 50 },
    center: { x: 200, y: 45 }
  },
  neck: {
    name: 'Pescoço',
    bounds: { x: 190, y: 70, width: 20, height: 20 },
    center: { x: 200, y: 80 }
  },
  leftShoulder: {
    name: 'Ombro Esquerdo',
    bounds: { x: 140, y: 90, width: 40, height: 30 },
    center: { x: 160, y: 105 }
  },
  rightShoulder: {
    name: 'Ombro Direito',
    bounds: { x: 220, y: 90, width: 40, height: 30 },
    center: { x: 240, y: 105 }
  },
  leftArm: {
    name: 'Braço Esquerdo',
    bounds: { x: 120, y: 120, width: 25, height: 80 },
    center: { x: 132, y: 160 }
  },
  rightArm: {
    name: 'Braço Direito',
    bounds: { x: 255, y: 120, width: 25, height: 80 },
    center: { x: 267, y: 160 }
  },
  leftForearm: {
    name: 'Antebraço Esquerdo',
    bounds: { x: 110, y: 200, width: 25, height: 80 },
    center: { x: 122, y: 240 }
  },
  rightForearm: {
    name: 'Antebraço Direito',
    bounds: { x: 265, y: 200, width: 25, height: 80 },
    center: { x: 277, y: 240 }
  },
  leftHand: {
    name: 'Mão Esquerda',
    bounds: { x: 105, y: 280, width: 20, height: 25 },
    center: { x: 115, y: 292 }
  },
  rightHand: {
    name: 'Mão Direita',
    bounds: { x: 275, y: 280, width: 20, height: 25 },
    center: { x: 285, y: 292 }
  },
  chest: {
    name: 'Tórax',
    bounds: { x: 170, y: 90, width: 60, height: 60 },
    center: { x: 200, y: 120 }
  },
  abdomen: {
    name: 'Abdômen',
    bounds: { x: 175, y: 150, width: 50, height: 50 },
    center: { x: 200, y: 175 }
  },
  pelvis: {
    name: 'Pelve',
    bounds: { x: 175, y: 200, width: 50, height: 40 },
    center: { x: 200, y: 220 }
  },
  leftThigh: {
    name: 'Coxa Esquerda',
    bounds: { x: 170, y: 240, width: 25, height: 80 },
    center: { x: 182, y: 280 }
  },
  rightThigh: {
    name: 'Coxa Direita',
    bounds: { x: 205, y: 240, width: 25, height: 80 },
    center: { x: 217, y: 280 }
  },
  leftKnee: {
    name: 'Joelho Esquerdo',
    bounds: { x: 170, y: 320, width: 25, height: 20 },
    center: { x: 182, y: 330 }
  },
  rightKnee: {
    name: 'Joelho Direito',
    bounds: { x: 205, y: 320, width: 25, height: 20 },
    center: { x: 217, y: 330 }
  },
  leftCalf: {
    name: 'Panturrilha Esquerda',
    bounds: { x: 170, y: 340, width: 25, height: 80 },
    center: { x: 182, y: 380 }
  },
  rightCalf: {
    name: 'Panturrilha Direita',
    bounds: { x: 205, y: 340, width: 25, height: 80 },
    center: { x: 217, y: 380 }
  },
  leftFoot: {
    name: 'Pé Esquerdo',
    bounds: { x: 165, y: 420, width: 30, height: 20 },
    center: { x: 180, y: 430 }
  },
  rightFoot: {
    name: 'Pé Direito',
    bounds: { x: 205, y: 420, width: 30, height: 20 },
    center: { x: 220, y: 430 }
  }
};

const AnatomicalDiagram: React.FC<AnatomicalDiagramProps> = ({
  markers,
  onMarkerAdd,
  onMarkerRemove
}) => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [hoveredBodyPart, setHoveredBodyPart] = useState<string | null>(null);
  const [showMarkerForm, setShowMarkerForm] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{ x: number; y: number } | null>(null);
  const [markerType, setMarkerType] = useState<'pain' | 'injury' | 'observation'>('observation');
  const [markerDescription, setMarkerDescription] = useState('');
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Função para detectar se um ponto está dentro de uma área retangular
  const isPointInBounds = useCallback((point: { x: number; y: number }, bounds: { x: number; y: number; width: number; height: number }): boolean => {
    return point.x >= bounds.x && 
           point.x <= bounds.x + bounds.width && 
           point.y >= bounds.y && 
           point.y <= bounds.y + bounds.height;
  }, []);

  // Função para encontrar a parte do corpo clicada
  const findBodyPartAtPoint = useCallback((point: { x: number; y: number }): string | null => {
    // Verificar em ordem de prioridade (partes menores primeiro)
    const priorityOrder = [
      'head', 'neck', 'leftHand', 'rightHand', 'leftFoot', 'rightFoot',
      'leftKnee', 'rightKnee', 'leftShoulder', 'rightShoulder',
      'leftForearm', 'rightForearm', 'leftCalf', 'rightCalf',
      'leftArm', 'rightArm', 'leftThigh', 'rightThigh',
      'chest', 'abdomen', 'pelvis'
    ];

    for (const partKey of priorityOrder) {
      const part = BODY_PARTS[partKey as keyof typeof BODY_PARTS];
      if (part && isPointInBounds(point, part.bounds)) {
        return partKey;
      }
    }
    return null;
  }, [isPointInBounds]);

  const handleSvgClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 450 / rect.height;
    
    const point = {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };

    const bodyPart = findBodyPartAtPoint(point);
    
    if (bodyPart) {
      setSelectedBodyPart(bodyPart);
      setMarkerPosition(point);
      setShowMarkerForm(true);
      setMarkerDescription('');
    }
  }, [findBodyPartAtPoint]);

  const handleBodyPartHover = useCallback((partKey: string | null) => {
    setHoveredBodyPart(partKey);
  }, []);

  const handleAddMarker = useCallback(() => {
    if (!markerPosition || !selectedBodyPart || !markerDescription.trim()) return;

    const bodyPart = BODY_PARTS[selectedBodyPart as keyof typeof BODY_PARTS];
    
    onMarkerAdd({
      x: markerPosition.x,
      y: markerPosition.y,
      type: markerType,
      description: markerDescription.trim(),
      bodyPart: bodyPart?.name || selectedBodyPart
    });

    setShowMarkerForm(false);
    setMarkerPosition(null);
    setSelectedBodyPart(null);
    setMarkerDescription('');
  }, [markerPosition, selectedBodyPart, markerType, markerDescription, onMarkerAdd]);

  const handleCancelMarker = useCallback(() => {
    setShowMarkerForm(false);
    setMarkerPosition(null);
    setSelectedBodyPart(null);
    setMarkerDescription('');
  }, []);

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'pain': return <AlertTriangle className="w-3 h-3" />;
      case 'injury': return <X className="w-3 h-3" />;
      case 'observation': return <Eye className="w-3 h-3" />;
      default: return <MapPin className="w-3 h-3" />;
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'pain': return 'text-red-600 bg-red-100 border-red-300';
      case 'injury': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'observation': return 'text-blue-600 bg-blue-100 border-blue-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Instruções */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">Como usar:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Clique em qualquer parte do corpo para adicionar uma marcação</li>
          <li>• Passe o mouse sobre as áreas para ver o nome da parte anatômica</li>
          <li>• Escolha o tipo de marcação: dor, lesão ou observação</li>
          <li>• Adicione uma descrição detalhada para cada marcação</li>
        </ul>
      </div>

      {/* Diagrama Anatômico */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 relative">
            <h4 className="font-medium text-gray-800 mb-4 text-center">
              Modelo Anatômico Interativo
              {hoveredBodyPart && (
                <span className="block text-sm text-blue-600 mt-1">
                  {BODY_PARTS[hoveredBodyPart as keyof typeof BODY_PARTS]?.name}
                </span>
              )}
            </h4>
            
            <div className="flex justify-center">
              <svg
                ref={svgRef}
                viewBox="0 0 400 450"
                className="w-full max-w-md h-auto cursor-crosshair border border-gray-200 rounded-lg"
                onClick={handleSvgClick}
              >
                {/* Fundo */}
                <rect width="400" height="450" fill="#f8fafc" />
                
                {/* Áreas invisíveis para detecção de hover/click */}
                {Object.entries(BODY_PARTS).map(([partKey, part]) => (
                  <rect
                    key={`area-${partKey}`}
                    x={part.bounds.x}
                    y={part.bounds.y}
                    width={part.bounds.width}
                    height={part.bounds.height}
                    fill={
                      selectedBodyPart === partKey
                        ? 'rgba(59, 130, 246, 0.3)'
                        : hoveredBodyPart === partKey
                        ? 'rgba(96, 165, 250, 0.2)'
                        : 'transparent'
                    }
                    stroke={
                      selectedBodyPart === partKey || hoveredBodyPart === partKey
                        ? '#3b82f6'
                        : 'transparent'
                    }
                    strokeWidth="1"
                    className="transition-all duration-200"
                    onMouseEnter={() => handleBodyPartHover(partKey)}
                    onMouseLeave={() => handleBodyPartHover(null)}
                  />
                ))}

                {/* Boneco original - design simples e limpo */}
                <g stroke="#374151" strokeWidth="2" fill="none">
                  {/* Cabeça */}
                  <circle cx="200" cy="45" r="20" fill="#f3f4f6" />
                  
                  {/* Pescoço */}
                  <line x1="200" y1="65" x2="200" y2="90" />
                  
                  {/* Tronco */}
                  <line x1="200" y1="90" x2="200" y2="240" />
                  
                  {/* Ombros */}
                  <line x1="160" y1="105" x2="240" y2="105" />
                  
                  {/* Braços */}
                  <line x1="160" y1="105" x2="132" y2="200" />
                  <line x1="240" y1="105" x2="267" y2="200" />
                  
                  {/* Antebraços */}
                  <line x1="132" y1="200" x2="122" y2="280" />
                  <line x1="267" y1="200" x2="277" y2="280" />
                  
                  {/* Mãos */}
                  <circle cx="122" cy="292" r="8" fill="#f3f4f6" />
                  <circle cx="277" cy="292" r="8" fill="#f3f4f6" />
                  
                  {/* Quadril */}
                  <line x1="182" y1="240" x2="217" y2="240" />
                  
                  {/* Coxas */}
                  <line x1="182" y1="240" x2="182" y2="320" />
                  <line x1="217" y1="240" x2="217" y2="320" />
                  
                  {/* Joelhos */}
                  <circle cx="182" cy="330" r="5" fill="#f3f4f6" />
                  <circle cx="217" cy="330" r="5" fill="#f3f4f6" />
                  
                  {/* Panturrilhas */}
                  <line x1="182" y1="340" x2="182" y2="420" />
                  <line x1="217" y1="340" x2="217" y2="420" />
                  
                  {/* Pés */}
                  <ellipse cx="180" cy="430" rx="15" ry="8" fill="#f3f4f6" />
                  <ellipse cx="220" cy="430" rx="15" ry="8" fill="#f3f4f6" />
                </g>

                {/* Marcadores existentes */}
                {markers.map((marker) => (
                  <g key={marker.id}>
                    <circle
                      cx={marker.x}
                      cy={marker.y}
                      r="8"
                      className={`${getMarkerColor(marker.type)} cursor-pointer transition-all duration-200 hover:scale-110`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMarker(selectedMarker === marker.id ? null : marker.id);
                      }}
                    />
                    <foreignObject
                      x={marker.x - 6}
                      y={marker.y - 6}
                      width="12"
                      height="12"
                      className="pointer-events-none"
                    >
                      <div className="flex items-center justify-center w-full h-full">
                        {getMarkerIcon(marker.type)}
                      </div>
                    </foreignObject>
                  </g>
                ))}

                {/* Marcador temporário */}
                {markerPosition && (
                  <circle
                    cx={markerPosition.x}
                    cy={markerPosition.y}
                    r="8"
                    className="fill-yellow-200 stroke-yellow-500 stroke-2 animate-pulse"
                  />
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Painel lateral */}
        <div className="w-full lg:w-80 space-y-4">
          {/* Lista de marcadores */}
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-3">
              Marcações ({markers.length})
            </h4>
            
            {markers.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                Nenhuma marcação adicionada
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {markers.map((marker) => (
                  <div
                    key={marker.id}
                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                      selectedMarker === marker.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedMarker(selectedMarker === marker.id ? null : marker.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <span className={`p-1 rounded-full ${getMarkerColor(marker.type)}`}>
                          {getMarkerIcon(marker.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {marker.bodyPart}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {marker.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkerRemove(marker.id);
                        }}
                        className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                        title="Remover marcação"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legenda */}
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-3">Legenda</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-full text-red-600 bg-red-100 border border-red-300">
                  <AlertTriangle className="w-3 h-3" />
                </span>
                <span className="text-sm text-gray-700">Dor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-full text-orange-600 bg-orange-100 border border-orange-300">
                  <X className="w-3 h-3" />
                </span>
                <span className="text-sm text-gray-700">Lesão</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-full text-blue-600 bg-blue-100 border border-blue-300">
                  <Eye className="w-3 h-3" />
                </span>
                <span className="text-sm text-gray-700">Observação</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para adicionar marcador */}
      {showMarkerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Adicionar Marcação
            </h3>
            
            {selectedBodyPart && (
              <p className="text-sm text-gray-600 mb-4">
                Parte selecionada: <strong>
                  {BODY_PARTS[selectedBodyPart as keyof typeof BODY_PARTS]?.name}
                </strong>
              </p>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Marcação
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'pain', label: 'Dor', icon: AlertTriangle, color: 'red' },
                    { value: 'injury', label: 'Lesão', icon: X, color: 'orange' },
                    { value: 'observation', label: 'Observação', icon: Eye, color: 'blue' }
                  ].map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setMarkerType(type.value as any)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          markerType === type.value
                            ? `border-${type.color}-500 bg-${type.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mx-auto mb-1 ${
                          markerType === type.value ? `text-${type.color}-600` : 'text-gray-400'
                        }`} />
                        <span className={`text-xs ${
                          markerType === type.value ? `text-${type.color}-700` : 'text-gray-600'
                        }`}>
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  id="description"
                  value={markerDescription}
                  onChange={(e) => setMarkerDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                  placeholder="Descreva a observação, sintoma ou condição..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancelMarker}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddMarker}
                disabled={!markerDescription.trim()}
                className="px-4 py-2 bg-primary-gradient text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnatomicalDiagram;