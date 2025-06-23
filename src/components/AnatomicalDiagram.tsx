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

// Definição das áreas anatômicas com coordenadas precisas
const BODY_PARTS = {
  head: {
    name: 'Cabeça',
    path: 'M200,50 C220,50 240,70 240,90 C240,110 220,130 200,130 C180,130 160,110 160,90 C160,70 180,50 200,50 Z',
    center: { x: 200, y: 90 }
  },
  neck: {
    name: 'Pescoço',
    path: 'M190,130 L210,130 L210,150 L190,150 Z',
    center: { x: 200, y: 140 }
  },
  leftShoulder: {
    name: 'Ombro Esquerdo',
    path: 'M140,150 C130,150 120,160 120,170 C120,180 130,190 140,190 L170,190 L170,150 Z',
    center: { x: 145, y: 170 }
  },
  rightShoulder: {
    name: 'Ombro Direito',
    path: 'M230,150 L260,150 C270,150 280,160 280,170 C280,180 270,190 260,190 L230,190 Z',
    center: { x: 255, y: 170 }
  },
  leftArm: {
    name: 'Braço Esquerdo',
    path: 'M120,190 L140,190 L140,280 L120,280 C110,280 100,270 100,260 L100,210 C100,200 110,190 120,190 Z',
    center: { x: 120, y: 235 }
  },
  rightArm: {
    name: 'Braço Direito',
    path: 'M260,190 L280,190 C290,190 300,200 300,210 L300,260 C300,270 290,280 280,280 L260,280 L260,190 Z',
    center: { x: 280, y: 235 }
  },
  leftForearm: {
    name: 'Antebraço Esquerdo',
    path: 'M100,280 L140,280 L140,370 L100,370 C90,370 80,360 80,350 L80,300 C80,290 90,280 100,280 Z',
    center: { x: 110, y: 325 }
  },
  rightForearm: {
    name: 'Antebraço Direito',
    path: 'M260,280 L300,280 C310,280 320,290 320,300 L320,350 C320,360 310,370 300,370 L260,370 L260,280 Z',
    center: { x: 290, y: 325 }
  },
  leftHand: {
    name: 'Mão Esquerda',
    path: 'M80,370 L140,370 L140,400 C140,410 130,420 120,420 L100,420 C90,420 80,410 80,400 Z',
    center: { x: 110, y: 395 }
  },
  rightHand: {
    name: 'Mão Direita',
    path: 'M260,370 L320,370 L320,400 C320,410 310,420 300,420 L280,420 C270,420 260,410 260,400 Z',
    center: { x: 290, y: 395 }
  },
  chest: {
    name: 'Tórax',
    path: 'M170,150 L230,150 L240,200 L160,200 Z',
    center: { x: 200, y: 175 }
  },
  abdomen: {
    name: 'Abdômen',
    path: 'M160,200 L240,200 L235,280 L165,280 Z',
    center: { x: 200, y: 240 }
  },
  pelvis: {
    name: 'Pelve',
    path: 'M165,280 L235,280 L230,320 L170,320 Z',
    center: { x: 200, y: 300 }
  },
  leftThigh: {
    name: 'Coxa Esquerda',
    path: 'M170,320 L200,320 L195,420 L165,420 C155,420 145,410 145,400 L145,340 C145,330 155,320 165,320 Z',
    center: { x: 172, y: 370 }
  },
  rightThigh: {
    name: 'Coxa Direita',
    path: 'M200,320 L230,320 C240,320 250,330 250,340 L250,400 C250,410 240,420 230,420 L200,420 Z',
    center: { x: 225, y: 370 }
  },
  leftKnee: {
    name: 'Joelho Esquerdo',
    path: 'M165,420 L195,420 L195,450 L165,450 C155,450 145,440 145,430 C145,430 155,420 165,420 Z',
    center: { x: 170, y: 435 }
  },
  rightKnee: {
    name: 'Joelho Direito',
    path: 'M200,420 L230,420 C240,420 250,430 250,430 C250,440 240,450 230,450 L200,450 Z',
    center: { x: 225, y: 435 }
  },
  leftCalf: {
    name: 'Panturrilha Esquerda',
    path: 'M165,450 L195,450 L190,540 L160,540 C150,540 140,530 140,520 L140,470 C140,460 150,450 160,450 Z',
    center: { x: 167, y: 495 }
  },
  rightCalf: {
    name: 'Panturrilha Direita',
    path: 'M200,450 L230,450 C240,450 250,460 250,470 L250,520 C250,530 240,540 230,540 L200,540 Z',
    center: { x: 225, y: 495 }
  },
  leftFoot: {
    name: 'Pé Esquerdo',
    path: 'M140,540 L190,540 L190,570 C190,580 180,590 170,590 L160,590 C150,590 140,580 140,570 Z',
    center: { x: 165, y: 565 }
  },
  rightFoot: {
    name: 'Pé Direito',
    path: 'M200,540 L250,540 L250,570 C250,580 240,590 230,590 L220,590 C210,590 200,580 200,570 Z',
    center: { x: 225, y: 565 }
  },
  upperBack: {
    name: 'Parte Superior das Costas',
    path: 'M170,150 L230,150 L240,220 L160,220 Z',
    center: { x: 200, y: 185 }
  },
  lowerBack: {
    name: 'Parte Inferior das Costas',
    path: 'M160,220 L240,220 L235,300 L165,300 Z',
    center: { x: 200, y: 260 }
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

  // Função para detectar se um ponto está dentro de um path SVG
  const isPointInPath = useCallback((point: { x: number; y: number }, pathData: string): boolean => {
    if (!svgRef.current) return false;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    
    const svgPoint = svgRef.current.createSVGPoint();
    svgPoint.x = point.x;
    svgPoint.y = point.y;
    
    return path.isPointInFill(svgPoint);
  }, []);

  // Função para encontrar a parte do corpo clicada
  const findBodyPartAtPoint = useCallback((point: { x: number; y: number }): string | null => {
    // Verificar em ordem de prioridade (partes menores primeiro)
    const priorityOrder = [
      'head', 'neck', 'leftHand', 'rightHand', 'leftFoot', 'rightFoot',
      'leftKnee', 'rightKnee', 'leftShoulder', 'rightShoulder',
      'leftForearm', 'rightForearm', 'leftCalf', 'rightCalf',
      'leftArm', 'rightArm', 'leftThigh', 'rightThigh',
      'chest', 'abdomen', 'pelvis', 'upperBack', 'lowerBack'
    ];

    for (const partKey of priorityOrder) {
      const part = BODY_PARTS[partKey as keyof typeof BODY_PARTS];
      if (part && isPointInPath(point, part.path)) {
        return partKey;
      }
    }
    return null;
  }, [isPointInPath]);

  const handleSvgClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 600 / rect.height;
    
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
                viewBox="0 0 400 600"
                className="w-full max-w-md h-auto cursor-crosshair border border-gray-200 rounded-lg"
                onClick={handleSvgClick}
              >
                {/* Fundo */}
                <rect width="400" height="600" fill="#f8fafc" />
                
                {/* Partes do corpo */}
                {Object.entries(BODY_PARTS).map(([partKey, part]) => (
                  <path
                    key={partKey}
                    d={part.path}
                    fill={
                      selectedBodyPart === partKey
                        ? '#3b82f6'
                        : hoveredBodyPart === partKey
                        ? '#60a5fa'
                        : '#e2e8f0'
                    }
                    stroke={
                      selectedBodyPart === partKey || hoveredBodyPart === partKey
                        ? '#1d4ed8'
                        : '#94a3b8'
                    }
                    strokeWidth="1"
                    className="transition-all duration-200"
                    onMouseEnter={() => handleBodyPartHover(partKey)}
                    onMouseLeave={() => handleBodyPartHover(null)}
                  />
                ))}

                {/* Contorno do corpo */}
                <path
                  d="M200,50 C220,50 240,70 240,90 C240,110 220,130 200,130 M190,130 L210,130 L210,150 M170,150 L230,150 M140,150 C130,150 120,160 120,170 C120,180 130,190 140,190 L170,190 M230,190 L260,190 C270,190 280,200 280,210 L280,260 C280,270 270,280 260,280 L260,370 L320,370 L320,400 C320,410 310,420 300,420 L280,420 C270,420 260,410 260,400 L260,370 M140,190 L140,370 L80,370 L80,400 C80,410 90,420 100,420 L120,420 C130,420 140,410 140,400 L140,370 M170,150 L170,320 L200,320 L230,320 L230,150 M200,320 L200,450 M170,320 L170,450 L200,450 L230,450 L230,320 M200,450 L200,540 M170,450 L170,540 L200,540 L230,540 L230,450 M200,540 L200,570 C200,580 210,590 220,590 L230,590 C240,590 250,580 250,570 L250,540 M170,540 L170,570 C170,580 160,590 150,590 L140,590 C130,590 120,580 120,570 L120,540"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2"
                />

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