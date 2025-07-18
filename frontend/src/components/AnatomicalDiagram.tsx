import React, { useState, useRef, useCallback, useEffect } from 'react';
// Certifique-se de ter 'lucide-react' instalado em seu projeto: npm install lucide-react
import { Plus, X, MapPin, AlertTriangle, Eye, Trash2 } from 'lucide-react';

// STYLES & ANIMATIONS
// Adicionando estilos e animações diretamente no componente para uma experiência completa.
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }

    @keyframes modalShow {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    .animate-modal-show {
      animation: modalShow 0.2s ease-out forwards;
    }

    @keyframes pulse-glow {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
      50% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
    }
    
    .animate-pulse-glow {
       animation: pulse-glow 1.5s infinite;
    }

    .marker-pin {
      transition: transform 0.2s ease-in-out;
    }
    
    .marker-pin-selected {
      transform: scale(1.25);
      filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.7));
    }
  `}</style>
);


// INTERFACES
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
  selectedMarker: string | null;
  setSelectedMarker: (id: string | null) => void;
}

// CONSTANTES
const BODY_PARTS = {
  head: { name: 'Cabeça', bounds: { x: 215, y: 30, width: 70, height: 90 } },
  neck: { name: 'Pescoço', bounds: { x: 235, y: 115, width: 30, height: 35 } },
  leftShoulder: { name: 'Ombro Esquerdo', bounds: { x: 165, y: 140, width: 50, height: 45 } },
  rightShoulder: { name: 'Ombro Direito', bounds: { x: 285, y: 140, width: 50, height: 45 } },
  leftUpperArm: { name: 'Braço Esquerdo', bounds: { x: 155, y: 185, width: 40, height: 90 } },
  rightUpperArm: { name: 'Braço Direito', bounds: { x: 305, y: 185, width: 40, height: 90 } },
  leftElbow: { name: 'Cotovelo Esquerdo', bounds: { x: 160, y: 270, width: 30, height: 25 } },
  rightElbow: { name: 'Cotovelo Direito', bounds: { x: 310, y: 270, width: 30, height: 25 } },
  leftForearm: { name: 'Antebraço Esquerdo', bounds: { x: 150, y: 295, width: 35, height: 85 } },
  rightForearm: { name: 'Antebraço Direito', bounds: { x: 315, y: 295, width: 35, height: 85 } },
  leftWrist: { name: 'Punho Esquerdo', bounds: { x: 155, y: 375, width: 25, height: 20 } },
  rightWrist: { name: 'Punho Direito', bounds: { x: 320, y: 375, width: 25, height: 20 } },
  leftHand: { name: 'Mão Esquerda', bounds: { x: 145, y: 395, width: 35, height: 55 } },
  rightHand: { name: 'Mão Direita', bounds: { x: 320, y: 395, width: 35, height: 55 } },
  upperChest: { name: 'Tórax Superior', bounds: { x: 215, y: 150, width: 70, height: 40 } },
  lowerChest: { name: 'Tórax Inferior', bounds: { x: 220, y: 190, width: 60, height: 35 } },
  upperAbdomen: { name: 'Abdômen Superior', bounds: { x: 225, y: 225, width: 50, height: 35 } },
  lowerAbdomen: { name: 'Abdômen Inferior', bounds: { x: 230, y: 260, width: 40, height: 40 } },
  pelvis: { name: 'Pelve/Quadril', bounds: { x: 215, y: 300, width: 70, height: 50 } },
  leftThigh: { name: 'Coxa Esquerda', bounds: { x: 200, y: 350, width: 45, height: 120 } },
  rightThigh: { name: 'Coxa Direita', bounds: { x: 255, y: 350, width: 45, height: 120 } },
  leftKnee: { name: 'Joelho Esquerdo', bounds: { x: 205, y: 470, width: 35, height: 35 } },
  rightKnee: { name: 'Joelho Direito', bounds: { x: 260, y: 470, width: 35, height: 35 } },
  leftCalf: { name: 'Panturrilha Esquerda', bounds: { x: 205, y: 505, width: 35, height: 100 } },
  rightCalf: { name: 'Panturrilha Direita', bounds: { x: 260, y: 505, width: 35, height: 100 } },
  leftAnkle: { name: 'Tornozelo Esquerdo', bounds: { x: 210, y: 605, width: 25, height: 20 } },
  rightAnkle: { name: 'Tornozelo Direito', bounds: { x: 265, y: 605, width: 25, height: 20 } },
  leftFoot: { name: 'Pé Esquerdo', bounds: { x: 195, y: 625, width: 40, height: 35 } },
  rightFoot: { name: 'Pé Direito', bounds: { x: 265, y: 625, width: 40, height: 35 } }
};

// COMPONENTE DO DIAGRAMA ANATÔMICO
const AnatomicalDiagram: React.FC<AnatomicalDiagramProps> = ({
  markers,
  onMarkerAdd,
  onMarkerRemove,
  selectedMarker,
  setSelectedMarker
}) => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [hoveredBodyPart, setHoveredBodyPart] = useState<string | null>(null);
  const [showMarkerForm, setShowMarkerForm] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{ x: number; y: number } | null>(null);
  const [markerType, setMarkerType] = useState<'pain' | 'injury' | 'observation'>('observation');
  const [markerDescription, setMarkerDescription] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);

  const isPointInBounds = useCallback((point: { x: number; y: number }, bounds: { x: number; y: number; width: number; height: number }): boolean => {
    return point.x >= bounds.x &&
           point.x <= bounds.x + bounds.width &&
           point.y >= bounds.y &&
           point.y <= bounds.y + bounds.height;
  }, []);

  const findBodyPartAtPoint = useCallback((point: { x: number; y: number }): string | null => {
    const priorityOrder = [
      'leftWrist', 'rightWrist', 'leftAnkle', 'rightAnkle',
      'leftElbow', 'rightElbow', 'leftKnee', 'rightKnee',
      'leftHand', 'rightHand', 'leftFoot', 'rightFoot',
      'head', 'neck',
      'leftForearm', 'rightForearm', 'leftCalf', 'rightCalf',
      'leftUpperArm', 'rightUpperArm', 'leftThigh', 'rightThigh',
      'leftShoulder', 'rightShoulder',
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
    const target = event.target as SVGElement;
    if (target.closest('.marker-pin-group')) return;

    event.preventDefault();
    event.stopPropagation();
    
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 500 / rect.width;
    const scaleY = 700 / rect.height;
    
    const point = { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
    const bodyPart = findBodyPartAtPoint(point);
    
    setSelectedBodyPart(bodyPart || 'geral');
    setMarkerPosition(point);
    setShowMarkerForm(true);
    setMarkerDescription('');
  }, [findBodyPartAtPoint]);
  
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 500 / rect.width;
    const scaleY = 700 / rect.height;
    const point = { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
    const bodyPart = findBodyPartAtPoint(point);
    setHoveredBodyPart(bodyPart);
  };

  const handleAddMarker = useCallback(() => {
    if (!markerPosition || !markerDescription.trim()) return;
    const bodyPartName = (selectedBodyPart && selectedBodyPart !== 'geral') 
      ? BODY_PARTS[selectedBodyPart as keyof typeof BODY_PARTS]?.name || selectedBodyPart
      : 'Área Geral';
    
    onMarkerAdd({
      x: markerPosition.x,
      y: markerPosition.y,
      type: markerType,
      description: markerDescription.trim(),
      bodyPart: bodyPartName
    });
    handleCancelMarker();
  }, [markerPosition, selectedBodyPart, markerType, markerDescription, onMarkerAdd]);

  const handleCancelMarker = useCallback(() => {
    setShowMarkerForm(false);
    setMarkerPosition(null);
    setSelectedBodyPart(null);
    setMarkerDescription('');
  }, []);

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'pain': return <AlertTriangle className="w-4 h-4" />;
      case 'injury': return <X className="w-4 h-4" />;
      case 'observation': return <Eye className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getMarkerStyling = (type: string) => {
    switch (type) {
      case 'pain': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', iconBg: 'bg-red-200' };
      case 'injury': return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', iconBg: 'bg-orange-200' };
      case 'observation': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', iconBg: 'bg-blue-200' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', iconBg: 'bg-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200/80 animate-fade-in">
        <h4 className="font-semibold text-blue-900 mb-2">Como usar:</h4>
        <ul className="text-sm text-blue-800 space-y-1.5 list-disc list-inside">
          <li>Clique em qualquer parte do corpo para adicionar uma marcação.</li>
          <li>Passe o mouse sobre as áreas para visualizar o nome da parte anatômica.</li>
          <li>Selecione um marcador na lista para destacá-lo no diagrama.</li>
        </ul>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm relative animate-fade-in" style={{animationDelay: '100ms'}}>
            <h4 className="font-semibold text-slate-800 mb-4 text-center">
              Modelo Anatômico Interativo
              <span className="block text-sm text-blue-600 font-medium mt-1 h-5">
                {hoveredBodyPart && BODY_PARTS[hoveredBodyPart as keyof typeof BODY_PARTS]?.name}
              </span>
            </h4>
            
            <div className="flex justify-center">
              <svg
                ref={svgRef}
                viewBox="0 0 500 700"
                className="w-full max-w-md h-auto cursor-crosshair border border-slate-200 rounded-lg bg-slate-50/50"
                onClick={handleSvgClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredBodyPart(null)}
                style={{ userSelect: 'none' }}
              >
                <defs>
                  <radialGradient id="skinGradient" cx="0.3" cy="0.3" r="0.8"><stop offset="0%" stopColor="#fde8d7" /><stop offset="50%" stopColor="#f4d1ae" /><stop offset="100%" stopColor="#e8b892" /></radialGradient>
                  <radialGradient id="muscleGradient" cx="0.3" cy="0.3" r="0.8"><stop offset="0%" stopColor="#f0c5a0" /><stop offset="50%" stopColor="#e8b892" /><stop offset="100%" stopColor="#d4a574" /></radialGradient>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2"/></filter>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {hoveredBodyPart && BODY_PARTS[hoveredBodyPart as keyof typeof BODY_PARTS] && (
                  <rect
                    {...BODY_PARTS[hoveredBodyPart as keyof typeof BODY_PARTS].bounds}
                    fill="rgba(59, 130, 246, 0.15)"
                    stroke="rgba(59, 130, 246, 0.4)"
                    strokeWidth="1.5"
                    rx="8"
                    className="pointer-events-none transition-opacity duration-200"
                  />
                )}
                
                <g filter="url(#shadow)">
                    <ellipse cx="250" cy="75" rx="32" ry="40" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/><circle cx="240" cy="65" r="2" fill="#8b7355" opacity="0.7"/><circle cx="260" cy="65" r="2" fill="#8b7355" opacity="0.7"/><ellipse cx="250" cy="80" rx="8" ry="3" fill="#d4a574" opacity="0.5"/><ellipse cx="250" cy="132" rx="18" ry="25" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1"/><line x1="242" y1="120" x2="242" y2="145" stroke="#d4a574" strokeWidth="0.5" opacity="0.6"/><line x1="258" y1="120" x2="258" y2="145" stroke="#d4a574" strokeWidth="0.5" opacity="0.6"/><ellipse cx="250" cy="185" rx="60" ry="35" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="250" cy="245" rx="50" ry="25" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1"/><path d="M 210 170 Q 230 160 250 170 Q 270 160 290 170 Q 280 190 250 185 Q 220 190 210 170" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1" opacity="0.8"/><ellipse cx="250" cy="292" rx="40" ry="22" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1"/><ellipse cx="250" cy="340" rx="35" ry="25" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1"/><line x1="235" y1="280" x2="235" y2="355" stroke="#d4a574" strokeWidth="0.8" opacity="0.6"/><line x1="265" y1="280" x2="265" y2="355" stroke="#d4a574" strokeWidth="0.8" opacity="0.6"/><line x1="220" y1="305" x2="280" y2="305" stroke="#d4a574" strokeWidth="0.8" opacity="0.6"/><line x1="225" y1="330" x2="275" y2="330" stroke="#d4a574" strokeWidth="0.8" opacity="0.6"/><ellipse cx="250" cy="375" rx="50" ry="35" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="192" cy="162" rx="27" ry="22" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="308" cy="162" rx="27" ry="22" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="175" cy="230" rx="20" ry="45" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="325" cy="230" rx="20" ry="45" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="175" cy="215" rx="15" ry="25" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="0.8" opacity="0.7"/><ellipse cx="325" cy="215" rx="15" ry="25" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="0.8" opacity="0.7"/><circle cx="175" cy="282" r="12" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/><circle cx="325" cy="282" r="12" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="167" cy="337" rx="17" ry="42" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="332" cy="337" rx="17" ry="42" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="167" cy="385" rx="12" ry="10" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1"/><ellipse cx="332" cy="385" rx="12" ry="10" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1"/><ellipse cx="162" cy="420" rx="17" ry="25" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="337" cy="420" rx="17" ry="25" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/><rect x="155" y="440" width="3" height="12" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><rect x="159" y="445" width="3" height="15" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><rect x="163" y="444" width="3" height="14" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><rect x="167" y="442" width="3" height="12" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><rect x="342" y="440" width="3" height="12" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><rect x="338" y="445" width="3" height="15" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><rect x="334" y="444" width="3" height="14" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><rect x="330" y="442" width="3" height="12" rx="1.5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><ellipse cx="222" cy="470" rx="22" ry="60" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="277" cy="470" rx="22" ry="60" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="222" cy="450" rx="18" ry="40" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="0.8" opacity="0.7"/><ellipse cx="277" cy="450" rx="18" ry="40" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="0.8" opacity="0.7"/><circle cx="222" cy="540" r="17" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/><circle cx="277" cy="540" r="17" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="222" cy="540" rx="8" ry="12" fill="#e8b892" stroke="#d4a574" strokeWidth="0.8" opacity="0.8"/><ellipse cx="277" cy="540" rx="8" ry="12" fill="#e8b892" stroke="#d4a574" strokeWidth="0.8" opacity="0.8"/><ellipse cx="222" cy="605" rx="17" ry="50" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="277" cy="605" rx="17" ry="50" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="222" cy="590" rx="13" ry="30" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="0.8" opacity="0.7"/><ellipse cx="277" cy="590" rx="13" ry="30" fill="url(#muscleGradient)" stroke="#d4a574" strokeWidth="0.8" opacity="0.7"/><ellipse cx="222" cy="660" rx="12" ry="10" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1"/><ellipse cx="277" cy="660" rx="12" ry="10" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1"/><ellipse cx="215" cy="685" rx="20" ry="15" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="285" cy="685" rx="20" ry="15" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="1.5"/><ellipse cx="200" cy="685" rx="3" ry="6" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><ellipse cx="205" cy="683" rx="3" ry="7" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><ellipse cx="210" cy="682" rx="3" ry="6" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><ellipse cx="215" cy="683" rx="3" ry="5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><ellipse cx="220" cy="684" rx="3" ry="4" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><ellipse cx="300" cy="685" rx="3" ry="6" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><ellipse cx="295" cy="683" rx="3" ry="7" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><ellipse cx="290" cy="682" rx="3" ry="6" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><ellipse cx="285" cy="683" rx="3" ry="5" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/><ellipse cx="280" cy="684" rx="3" ry="4" fill="url(#skinGradient)" stroke="#d4a574" strokeWidth="0.5"/>
                </g>

                {markers.map((marker) => {
                  const { bg, text } = getMarkerStyling(marker.type);
                  const isSelected = selectedMarker === marker.id;
                  return (
                    <g key={marker.id} className="cursor-pointer marker-pin-group" onClick={(e) => { e.stopPropagation(); setSelectedMarker(isSelected ? null : marker.id); }}>
                      <circle
                        cx={marker.x} cy={marker.y} r="12" fill="white" 
                        className={`transition-all duration-300 ${isSelected ? 'opacity-30' : 'opacity-0'}`}
                      />
                      <circle cx={marker.x} cy={marker.y} r="10" className={`marker-pin ${bg} ${text} stroke-2 stroke-white/80 ${isSelected ? 'marker-pin-selected' : ''}`}/>
                      <foreignObject x={marker.x - 8} y={marker.y - 8} width="16" height="16" className="pointer-events-none">
                        <div className={`flex items-center justify-center w-full h-full ${text}`}>
                          {getMarkerIcon(marker.type)}
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}

                {markerPosition && (
                  <circle cx={markerPosition.x} cy={markerPosition.y} r="10" className="fill-yellow-300/80 stroke-white/80 stroke-2 animate-pulse" />
                )}
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 space-y-6 animate-fade-in" style={{animationDelay: '200ms'}}>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <h4 className="font-semibold text-slate-800 mb-4">Marcações ({markers.length})</h4>
            {markers.length === 0 ? (
              <p className="text-sm text-center py-8 text-slate-500 italic">Nenhuma marcação adicionada</p>
            ) : (
              <div className="space-y-3 max-h-[22rem] overflow-y-auto pr-2">
                {markers.map((marker) => {
                   const { bg, text, border } = getMarkerStyling(marker.type);
                   const isSelected = selectedMarker === marker.id;
                  return (
                  <div
                    key={marker.id}
                    className={`p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${isSelected ? `bg-blue-50 border-blue-500 shadow-md` : `${bg} ${border} hover:border-slate-400/50 hover:bg-slate-50`}`}
                    onClick={() => setSelectedMarker(isSelected ? null : marker.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span className={`p-2 rounded-full ${bg} ${text}`}>
                          {getMarkerIcon(marker.type)}
                        </span>
                        <div className="flex-1 min-w-0 mt-0.5">
                          <p className={`font-semibold text-sm ${text}`}>{marker.bodyPart}</p>
                          <p className="text-xs text-slate-600 line-clamp-2">{marker.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onMarkerRemove(marker.id); }}
                        className="p-1.5 text-slate-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
                        title="Remover marcação"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )})}
              </div>
            )}
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
             <h4 className="font-semibold text-slate-800 mb-3">Legenda</h4>
             <div className="space-y-2.5">
                 {['pain', 'injury', 'observation'].map(type => {
                     const { bg, text } = getMarkerStyling(type);
                     const label = type.charAt(0).toUpperCase() + type.slice(1);
                     return (
                         <div key={type} className="flex items-center gap-3">
                             <span className={`flex items-center justify-center w-8 h-8 rounded-full ${bg} ${text}`}>
                               {getMarkerIcon(type)}
                             </span>
                             <span className="text-sm font-medium text-slate-700">{type === 'pain' ? 'Dor' : (type === 'injury' ? 'Lesão' : 'Observação')}</span>
                         </div>
                     )
                 })}
             </div>
          </div>
        </div>
      </div>

      {showMarkerForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-modal-show">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Adicionar Marcação</h3>
            <p className="text-sm text-slate-500 mb-5">
              Parte selecionada: <strong className="text-blue-600">
                {(selectedBodyPart && selectedBodyPart !== 'geral') ? BODY_PARTS[selectedBodyPart as keyof typeof BODY_PARTS]?.name : 'Área Geral'}
              </strong>
            </p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Marcação</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'pain', label: 'Dor', icon: AlertTriangle, color: 'red' },
                    { value: 'injury', label: 'Lesão', icon: X, color: 'orange' },
                    { value: 'observation', label: 'Observação', icon: Eye, color: 'blue' }
                  ].map((type) => {
                    const Icon = type.icon;
                    const isSelected = markerType === type.value;
                    return (
                      <button key={type.value} type="button" onClick={() => setMarkerType(type.value as any)}
                        className={`p-3 flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                          isSelected ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700 shadow-sm` : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? `text-${type.color}-600` : 'text-slate-400'}`} />
                        <span className="text-xs font-semibold">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">Descrição *</label>
                <textarea
                  id="description"
                  value={markerDescription}
                  onChange={(e) => setMarkerDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                  placeholder="Descreva a observação, sintoma ou condição..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={handleCancelMarker} className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors">Cancelar</button>
              <button onClick={handleAddMarker} disabled={!markerDescription.trim()} className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600">Adicionar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// COMPONENTE PRINCIPAL DA APLICAÇÃO
export default function App() {
  const [markers, setMarkers] = useState<AnatomicalMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const handleAddMarker = (markerToAdd: Omit<AnatomicalMarker, 'id'>) => {
    const newMarker: AnatomicalMarker = {
      ...markerToAdd,
      id: new Date().toISOString() + Math.random(),
    };
    setMarkers(prevMarkers => [...prevMarkers, newMarker]);
  };

  const handleRemoveMarker = (markerId: string) => {
    setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== markerId));
    if(selectedMarker === markerId) {
        setSelectedMarker(null);
    }
  };
  
  // Adiciona marcadores iniciais
  useEffect(() => {
     setMarkers([
       { id: '1', x: 222, y: 540, type: 'pain', description: 'Dor aguda no joelho esquerdo ao subir escadas.', bodyPart: 'Joelho Esquerdo' },
       { id: '2', x: 308, y: 162, type: 'injury', description: 'Lesão antiga no manguito rotador direito.', bodyPart: 'Ombro Direito' }
     ]);
  }, []);

  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Ficha de Avaliação Fisioterapêutica</h1>
              <p className="text-slate-600 mt-2 text-lg">Utilize o diagrama interativo para registrar observações clínicas de forma precisa.</p>
          </header>
          <main>
            <AnatomicalDiagram
              markers={markers}
              onMarkerAdd={handleAddMarker}
              onMarkerRemove={handleRemoveMarker}
              selectedMarker={selectedMarker}
              setSelectedMarker={setSelectedMarker}
            />
          </main>
        </div>
      </div>
    </>
  );
}