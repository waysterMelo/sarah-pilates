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

// Definição das áreas anatômicas com coordenadas precisas para o modelo realista
const BODY_PARTS = {
  head: {
    name: 'Cabeça',
    bounds: { x: 215, y: 30, width: 70, height: 90 },
    center: { x: 250, y: 75 }
  },
  neck: {
    name: 'Pescoço',
    bounds: { x: 235, y: 115, width: 30, height: 35 },
    center: { x: 250, y: 132 }
  },
  leftShoulder: {
    name: 'Ombro Esquerdo',
    bounds: { x: 165, y: 140, width: 55, height: 45 },
    center: { x: 192, y: 162 }
  },
  rightShoulder: {
    name: 'Ombro Direito',
    bounds: { x: 280, y: 140, width: 55, height: 45 },
    center: { x: 308, y: 162 }
  },
  leftUpperArm: {
    name: 'Braço Esquerdo Superior',
    bounds: { x: 155, y: 185, width: 40, height: 90 },
    center: { x: 175, y: 230 }
  },
  rightUpperArm: {
    name: 'Braço Direito Superior',
    bounds: { x: 305, y: 185, width: 40, height: 90 },
    center: { x: 325, y: 230 }
  },
  leftElbow: {
    name: 'Cotovelo Esquerdo',
    bounds: { x: 160, y: 270, width: 30, height: 25 },
    center: { x: 175, y: 282 }
  },
  rightElbow: {
    name: 'Cotovelo Direito',
    bounds: { x: 310, y: 270, width: 30, height: 25 },
    center: { x: 325, y: 282 }
  },
  leftForearm: {
    name: 'Antebraço Esquerdo',
    bounds: { x: 150, y: 295, width: 35, height: 85 },
    center: { x: 167, y: 337 }
  },
  rightForearm: {
    name: 'Antebraço Direito',
    bounds: { x: 315, y: 295, width: 35, height: 85 },
    center: { x: 332, y: 337 }
  },
  leftWrist: {
    name: 'Punho Esquerdo',
    bounds: { x: 155, y: 375, width: 25, height: 20 },
    center: { x: 167, y: 385 }
  },
  rightWrist: {
    name: 'Punho Direito',
    bounds: { x: 320, y: 375, width: 25, height: 20 },
    center: { x: 332, y: 385 }
  },
  leftHand: {
    name: 'Mão Esquerda',
    bounds: { x: 145, y: 395, width: 35, height: 50 },
    center: { x: 162, y: 420 }
  },
  rightHand: {
    name: 'Mão Direita',
    bounds: { x: 320, y: 395, width: 35, height: 50 },
    center: { x: 337, y: 420 }
  },
  upperChest: {
    name: 'Tórax Superior',
    bounds: { x: 190, y: 150, width: 120, height: 70 },
    center: { x: 250, y: 185 }
  },
  lowerChest: {
    name: 'Tórax Inferior',
    bounds: { x: 200, y: 220, width: 100, height: 50 },
    center: { x: 250, y: 245 }
  },
  upperAbdomen: {
    name: 'Abdômen Superior',
    bounds: { x: 210, y: 270, width: 80, height: 45 },
    center: { x: 250, y: 292 }
  },
  lowerAbdomen: {
    name: 'Abdômen Inferior',
    bounds: { x: 215, y: 315, width: 70, height: 50 },
    center: { x: 250, y: 340 }
  },
  pelvis: {
    name: 'Pelve/Quadril',
    bounds: { x: 200, y: 340, width: 100, height: 70 },
    center: { x: 250, y: 375 }
  },
  leftThigh: {
    name: 'Coxa Esquerda',
    bounds: { x: 200, y: 410, width: 45, height: 120 },
    center: { x: 222, y: 470 }
  },
  rightThigh: {
    name: 'Coxa Direita',
    bounds: { x: 255, y: 410, width: 45, height: 120 },
    center: { x: 277, y: 470 }
  },
  leftKnee: {
    name: 'Joelho Esquerdo',
    bounds: { x: 205, y: 525, width: 35, height: 30 },
    center: { x: 222, y: 540 }
  },
  rightKnee: {
    name: 'Joelho Direito',
    bounds: { x: 260, y: 525, width: 35, height: 30 },
    center: { x: 277, y: 540 }
  },
  leftCalf: {
    name: 'Panturrilha Esquerda',
    bounds: { x: 205, y: 555, width: 35, height: 100 },
    center: { x: 222, y: 605 }
  },
  rightCalf: {
    name: 'Panturrilha Direita',
    bounds: { x: 260, y: 555, width: 35, height: 100 },
    center: { x: 277, y: 605 }
  },
  leftAnkle: {
    name: 'Tornozelo Esquerdo',
    bounds: { x: 210, y: 650, width: 25, height: 20 },
    center: { x: 222, y: 660 }
  },
  rightAnkle: {
    name: 'Tornozelo Direito',
    bounds: { x: 265, y: 650, width: 25, height: 20 },
    center: { x: 277, y: 660 }
  },
  leftFoot: {
    name: 'Pé Esquerdo',
    bounds: { x: 195, y: 670, width: 40, height: 30 },
    center: { x: 215, y: 685 }
  },
  rightFoot: {
    name: 'Pé Direito',
    bounds: { x: 265, y: 670, width: 40, height: 30 },
    center: { x: 285, y: 685 }
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

  // Função para encontrar a parte do corpo clicada com priorização melhorada
  const findBodyPartAtPoint = useCallback((point: { x: number; y: number }): string | null => {
    // Verificar em ordem de prioridade (partes menores e mais específicas primeiro)
    const priorityOrder = [
      // Extremidades pequenas primeiro
      'leftWrist', 'rightWrist', 'leftAnkle', 'rightAnkle',
      'leftElbow', 'rightElbow', 'leftKnee', 'rightKnee',
      'leftHand', 'rightHand', 'leftFoot', 'rightFoot',
      'head', 'neck',
      
      // Membros médios
      'leftForearm', 'rightForearm', 'leftCalf', 'rightCalf',
      'leftUpperArm', 'rightUpperArm', 'leftThigh', 'rightThigh',
      'leftShoulder', 'rightShoulder',
      
      // Tronco (áreas maiores por último)
      'upperChest', 'lowerChest', 'upperAbdomen', 'lowerAbdomen', 'pelvis'
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
    const scaleX = 500 / rect.width;
    const scaleY = 700 / rect.height;
    
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
                viewBox="0 0 500 700"
                className="w-full max-w-md h-auto cursor-crosshair border border-gray-200 rounded-lg"
                onClick={handleSvgClick}
              >
                {/* Definições de gradientes e sombras para realismo */}
                <defs>
                  <radialGradient id="skinGradient" cx="0.3" cy="0.3" r="0.8">
                    <stop offset="0%" stopColor="#fde8d7" />
                    <stop offset="50%" stopColor="#f4d1ae" />
                    <stop offset="100%" stopColor="#e8b892" />
                  </radialGradient>
                  
                  <radialGradient id="muscleGradient" cx="0.3" cy="0.3" r="0.8">
                    <stop offset="0%" stopColor="#f0c5a0" />
                    <stop offset="50%" stopColor="#e8b892" />
                    <stop offset="100%" stopColor="#d4a574" />
                  </radialGradient>
                  
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                  </filter>
                  
                  <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feOffset dx="0" dy="0"/>
                    <feGaussianBlur stdDeviation="2" result="offset-blur"/>
                    <feFlood floodColor="#d4a574" floodOpacity="0.4"/>
                    <feComposite in2="offset-blur" operator="in"/>
                  </filter>
                </defs>

                {/* Fundo */}
                <rect width="500" height="700" fill="#f8fafc" />
                
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
                    strokeWidth="2"
                    className="transition-all duration-200"
                    onMouseEnter={() => handleBodyPartHover(partKey)}
                    onMouseLeave={() => handleBodyPartHover(null)}
                  />
                ))}

                {/* Modelo Anatômico Realista */}
                <g filter="url(#shadow)">
                  
                  {/* Cabeça com formato mais realista */}
                  <ellipse cx="250" cy="75" rx="32" ry="40" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  
                  {/* Características faciais básicas */}
                  <circle cx="240" cy="65" r="2" fill="#8b7355" opacity="0.7"/>
                  <circle cx="260" cy="65" r="2" fill="#8b7355" opacity="0.7"/>
                  <ellipse cx="250" cy="80" rx="8" ry="3" fill="#d4a574" opacity="0.5"/>
                  
                  {/* Pescoço com anatomia */}
                  <ellipse cx="250" cy="132" rx="18" ry="25" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1"/>
                  <line x1="242" y1="120" x2="242" y2="145" stroke="#d4a574" strokeWidth="0.5" opacity="0.6"/>
                  <line x1="258" y1="120" x2="258" y2="145" stroke="#d4a574" strokeWidth="0.5" opacity="0.6"/>
                  
                  {/* Tronco com definição muscular */}
                  <ellipse cx="250" cy="185" rx="60" ry="35" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  <ellipse cx="250" cy="245" rx="50" ry="25" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1"/>
                  
                  {/* Definição peitoral */}
                  <path d="M 210 170 Q 230 160 250 170 Q 270 160 290 170 Q 280 190 250 185 Q 220 190 210 170" 
                        fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1" opacity="0.8"/>
                  
                  {/* Abdômen com segmentação */}
                  <ellipse cx="250" cy="292" rx="40" ry="22" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1"/>
                  <ellipse cx="250" cy="340" rx="35" ry="25" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1"/>
                  
                  {/* Linhas abdominais */}
                  <line x1="235" y1="280" x2="235" y2="355" stroke="#d4a574" strokeWidth="0.8" opacity="0.6"/>
                  <line x1="265" y1="280" x2="265" y2="355" stroke="#d4a574" strokeWidth="0.8" opacity="0.6"/>
                  <line x1="220" y1="305" x2="280" y2="305" stroke="#d4a574" strokeWidth="0.8" opacity="0.6"/>
                  <line x1="225" y1="330" x2="275" y2="330" stroke="#d4a574" strokeWidth="0.8" opacity="0.6"/>
                  
                  {/* Pelve/Quadril */}
                  <ellipse cx="250" cy="375" rx="50" ry="35" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  
                  {/* Ombros com volume */}
                  <ellipse cx="192" cy="162" rx="27" ry="22" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  <ellipse cx="308" cy="162" rx="27" ry="22" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  
                  {/* Braços superiores com definição */}
                  <ellipse cx="175" cy="230" rx="20" ry="45" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  <ellipse cx="325" cy="230" rx="20" ry="45" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  
                  {/* Bíceps definição */}
                  <ellipse cx="175" cy="215" rx="15" ry="25" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="0.8" opacity="0.7"/>
                  <ellipse cx="325" cy="215" rx="15" ry="25" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="0.8" opacity="0.7"/>
                  
                  {/* Cotovelos */}
                  <circle cx="175" cy="282" r="12" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  <circle cx="325" cy="282" r="12" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  
                  {/* Antebraços */}
                  <ellipse cx="167" cy="337" rx="17" ry="42" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  <ellipse cx="332" cy="337" rx="17" ry="42" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  
                  {/* Punhos */}
                  <ellipse cx="167" cy="385" rx="12" ry="10" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1"/>
                  <ellipse cx="332" cy="385" rx="12" ry="10" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1"/>
                  
                  {/* Mãos detalhadas */}
                  <ellipse cx="162" cy="420" rx="17" ry="25" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  <ellipse cx="337" cy="420" rx="17" ry="25" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  
                  {/* Dedos simplificados */}
                  <rect x="155" y="440" width="3" height="12" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  <rect x="159" y="445" width="3" height="15" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  <rect x="163" y="444" width="3" height="14" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  <rect x="167" y="442" width="3" height="12" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  
                  <rect x="342" y="440" width="3" height="12" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  <rect x="338" y="445" width="3" height="15" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  <rect x="334" y="444" width="3" height="14" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  <rect x="330" y="442" width="3" height="12" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  
                  {/* Coxas com definição muscular */}
                  <ellipse cx="222" cy="470" rx="22" ry="60" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  <ellipse cx="277" cy="470" rx="22" ry="60" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  
                  {/* Quadríceps definição */}
                  <ellipse cx="222" cy="450" rx="18" ry="40" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="0.8" opacity="0.7"/>
                  <ellipse cx="277" cy="450" rx="18" ry="40" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="0.8" opacity="0.7"/>
                  
                  {/* Joelhos */}
                  <circle cx="222" cy="540" r="17" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  <circle cx="277" cy="540" r="17" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  
                  {/* Patela */}
                  <ellipse cx="222" cy="540" rx="8" ry="12" fill="#e8b892" stroke="#d4a574" strokeWidth="0.8" opacity="0.8"/>
                  <ellipse cx="277" cy="540" rx="8" ry="12" fill="#e8b892" stroke="#d4a574" strokeWidth="0.8" opacity="0.8"/>
                  
                  {/* Panturrilhas */}
                  <ellipse cx="222" cy="605" rx="17" ry="50" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  <ellipse cx="277" cy="605" rx="17" ry="50" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  
                  {/* Definição da panturrilha */}
                  <ellipse cx="222" cy="590" rx="13" ry="30" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="0.8" opacity="0.7"/>
                  <ellipse cx="277" cy="590" rx="13" ry="30" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="0.8" opacity="0.7"/>
                  
                  {/* Tornozelos */}
                  <ellipse cx="222" cy="660" rx="12" ry="10" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1"/>
                  <ellipse cx="277" cy="660" rx="12" ry="10" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1"/>
                  
                  {/* Pés detalhados */}
                  <ellipse cx="215" cy="685" rx="20" ry="15" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  <ellipse cx="285" cy="685" rx="20" ry="15" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/>
                  
                  {/* Dedos dos pés */}
                  <ellipse cx="200" cy="685" rx="3" ry="6" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  <ellipse cx="205" cy="683" rx="3" ry="7" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  <ellipse cx="210" cy="682" rx="3" ry="6" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  <ellipse cx="215" cy="683" rx="3" ry="5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  <ellipse cx="220" cy="684" rx="3" ry="4" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  
                  <ellipse cx="300" cy="685" rx="3" ry="6" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  <ellipse cx="295" cy="683" rx="3" ry="7" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  <ellipse cx="290" cy="682" rx="3" ry="6" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  <ellipse cx="285" cy="683" rx="3" ry="5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  <ellipse cx="280" cy="684" rx="3" ry="4" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                  
                </g>

                {/* Marcadores existentes */}
                {markers.map((marker) => (
                  <g key={marker.id}>
                    <circle
                      cx={marker.x}
                      cy={marker.y}
                      r="10"
                      className={`${getMarkerColor(marker.type)} cursor-pointer transition-all duration-200 hover:scale-110 drop-shadow-lg`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMarker(selectedMarker === marker.id ? null : marker.id);
                      }}
                      filter="url(#shadow)"
                    />
                    <foreignObject
                      x={marker.x - 8}
                      y={marker.y - 8}
                      width="16"
                      height="16"
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
                    r="10"
                    className="fill-yellow-200 stroke-yellow-500 stroke-2 animate-pulse drop-shadow-lg"
                    filter="url(#shadow)"
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