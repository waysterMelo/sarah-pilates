import React, { useState } from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  Eye, 
  Plus, 
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Target
} from 'lucide-react';

interface AnatomicalMarker {
  id: string;
  x: number;
  y: number;
  type: 'pain' | 'injury' | 'observation';
  description: string;
}

interface AnatomicalDiagramProps {
  markers: AnatomicalMarker[];
  onMarkerAdd: (marker: Omit<AnatomicalMarker, 'id'>) => void;
  onMarkerRemove: (markerId: string) => void;
}

const AnatomicalDiagram: React.FC<AnatomicalDiagramProps> = ({
  markers,
  onMarkerAdd,
  onMarkerRemove
}) => {
  const [selectedView, setSelectedView] = useState<'front' | 'back' | 'side'>('front');
  const [zoom, setZoom] = useState(1);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [newMarkerType, setNewMarkerType] = useState<'pain' | 'injury' | 'observation'>('pain');
  const [showMarkerForm, setShowMarkerForm] = useState(false);
  const [pendingMarker, setPendingMarker] = useState<{ x: number; y: number } | null>(null);
  const [markerDescription, setMarkerDescription] = useState('');

  const handleDiagramClick = (event: React.MouseEvent<SVGElement>) => {
    if (!isAddingMarker) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setPendingMarker({ x, y });
    setShowMarkerForm(true);
  };

  const handleMarkerSave = () => {
    if (pendingMarker && markerDescription.trim()) {
      onMarkerAdd({
        x: pendingMarker.x,
        y: pendingMarker.y,
        type: newMarkerType,
        description: markerDescription.trim()
      });
      
      setShowMarkerForm(false);
      setPendingMarker(null);
      setMarkerDescription('');
      setIsAddingMarker(false);
    }
  };

  const handleMarkerCancel = () => {
    setShowMarkerForm(false);
    setPendingMarker(null);
    setMarkerDescription('');
    setIsAddingMarker(false);
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'pain': return '⚡';
      case 'injury': return '🩹';
      case 'observation': return '👁️';
      default: return '📍';
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'pain': return 'bg-red-500 border-red-600 text-white';
      case 'injury': return 'bg-orange-500 border-orange-600 text-white';
      case 'observation': return 'bg-blue-500 border-blue-600 text-white';
      default: return 'bg-gray-500 border-gray-600 text-white';
    }
  };

  // SVG do corpo humano mais realista e detalhado
  const HumanBodySVG = () => (
    <svg
      viewBox="0 0 300 600"
      className="w-full h-full cursor-crosshair select-none"
      onClick={handleDiagramClick}
      style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
    >
      {/* Definições de gradientes para dar volume */}
      <defs>
        <radialGradient id="skinGradient" cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#f5deb3" />
          <stop offset="100%" stopColor="#deb887" />
        </radialGradient>
        <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d2b48c" />
          <stop offset="100%" stopColor="#bc9a6a" />
        </linearGradient>
      </defs>

      {/* Cabeça mais detalhada */}
      <g id="head">
        <ellipse cx="150" cy="60" rx="35" ry="40" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        {/* Rosto */}
        <ellipse cx="150" cy="65" rx="30" ry="35" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        {/* Olhos */}
        <circle cx="140" cy="55" r="2" fill="#333"/>
        <circle cx="160" cy="55" r="2" fill="#333"/>
        {/* Nariz */}
        <path d="M 150 60 L 148 65 L 152 65 Z" fill="#d2b48c"/>
        {/* Boca */}
        <path d="M 145 70 Q 150 73 155 70" stroke="#d2b48c" strokeWidth="1" fill="none"/>
      </g>

      {/* Pescoço com músculos */}
      <g id="neck">
        <rect x="135" y="95" width="30" height="25" rx="5" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        {/* Músculos do pescoço */}
        <line x1="140" y1="100" x2="140" y2="115" stroke="#d2b48c" strokeWidth="1"/>
        <line x1="160" y1="100" x2="160" y2="115" stroke="#d2b48c" strokeWidth="1"/>
      </g>

      {/* Tronco mais anatômico */}
      <g id="torso">
        {/* Tórax */}
        <ellipse cx="150" cy="180" rx="55" ry="70" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        {/* Músculos peitorais */}
        <ellipse cx="130" cy="160" rx="20" ry="25" fill="none" stroke="#d2b48c" strokeWidth="1" opacity="0.7"/>
        <ellipse cx="170" cy="160" rx="20" ry="25" fill="none" stroke="#d2b48c" strokeWidth="1" opacity="0.7"/>
        {/* Abdômen */}
        <rect x="125" y="230" width="50" height="60" rx="10" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        {/* Músculos abdominais */}
        <line x1="140" y1="235" x2="140" y2="285" stroke="#d2b48c" strokeWidth="1"/>
        <line x1="150" y1="235" x2="150" y2="285" stroke="#d2b48c" strokeWidth="1"/>
        <line x1="160" y1="235" x2="160" y2="285" stroke="#d2b48c" strokeWidth="1"/>
        <line x1="130" y1="250" x2="170" y2="250" stroke="#d2b48c" strokeWidth="1"/>
        <line x1="130" y1="265" x2="170" y2="265" stroke="#d2b48c" strokeWidth="1"/>
      </g>

      {/* Ombros mais definidos */}
      <g id="shoulders">
        <circle cx="95" cy="140" r="25" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <circle cx="205" cy="140" r="25" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
      </g>

      {/* Braços com músculos */}
      <g id="arms">
        {/* Braço esquerdo */}
        <ellipse cx="80" cy="200" rx="18" ry="50" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <line x1="75" y1="170" x2="75" y2="230" stroke="#d2b48c" strokeWidth="1"/>
        <line x1="85" y1="170" x2="85" y2="230" stroke="#d2b48c" strokeWidth="1"/>
        
        {/* Braço direito */}
        <ellipse cx="220" cy="200" rx="18" ry="50" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <line x1="215" y1="170" x2="215" y2="230" stroke="#d2b48c" strokeWidth="1"/>
        <line x1="225" y1="170" x2="225" y2="230" stroke="#d2b48c" strokeWidth="1"/>
      </g>

      {/* Cotovelos */}
      <g id="elbows">
        <circle cx="80" cy="250" r="12" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <circle cx="220" cy="250" r="12" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
      </g>

      {/* Antebraços */}
      <g id="forearms">
        {/* Antebraço esquerdo */}
        <ellipse cx="75" cy="310" rx="15" ry="45" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <line x1="70" y1="270" x2="70" y2="350" stroke="#d2b48c" strokeWidth="1"/>
        
        {/* Antebraço direito */}
        <ellipse cx="225" cy="310" rx="15" ry="45" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <line x1="230" y1="270" x2="230" y2="350" stroke="#d2b48c" strokeWidth="1"/>
      </g>

      {/* Punhos */}
      <g id="wrists">
        <circle cx="75" cy="355" r="8" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <circle cx="225" cy="355" r="8" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
      </g>

      {/* Mãos mais detalhadas */}
      <g id="hands">
        {/* Mão esquerda */}
        <ellipse cx="70" cy="380" rx="12" ry="18" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <rect x="65" y="370" width="3" height="12" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        <rect x="68" y="365" width="3" height="15" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        <rect x="71" y="365" width="3" height="15" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        <rect x="74" y="370" width="3" height="12" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        
        {/* Mão direita */}
        <ellipse cx="230" cy="380" rx="12" ry="18" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <rect x="225" y="370" width="3" height="12" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        <rect x="228" y="365" width="3" height="15" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        <rect x="231" y="365" width="3" height="15" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        <rect x="234" y="370" width="3" height="12" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
      </g>

      {/* Quadril e pelve */}
      <g id="pelvis">
        <ellipse cx="150" cy="320" rx="45" ry="35" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        {/* Ossos do quadril */}
        <ellipse cx="130" cy="315" rx="15" ry="20" fill="none" stroke="#d2b48c" strokeWidth="1" opacity="0.7"/>
        <ellipse cx="170" cy="315" rx="15" ry="20" fill="none" stroke="#d2b48c" strokeWidth="1" opacity="0.7"/>
      </g>

      {/* Coxas com músculos */}
      <g id="thighs">
        {/* Coxa esquerda */}
        <ellipse cx="125" cy="420" rx="22" ry="65" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <line x1="115" y1="370" x2="115" y2="470" stroke="#d2b48c" strokeWidth="1"/>
        <line x1="135" y1="370" x2="135" y2="470" stroke="#d2b48c" strokeWidth="1"/>
        
        {/* Coxa direita */}
        <ellipse cx="175" cy="420" rx="22" ry="65" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <line x1="165" y1="370" x2="165" y2="470" stroke="#d2b48c" strokeWidth="1"/>
        <line x1="185" y1="370" x2="185" y2="470" stroke="#d2b48c" strokeWidth="1"/>
      </g>

      {/* Joelhos */}
      <g id="knees">
        <circle cx="125" cy="485" r="15" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <circle cx="175" cy="485" r="15" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        {/* Patela */}
        <ellipse cx="125" cy="485" rx="8" ry="10" fill="none" stroke="#d2b48c" strokeWidth="1"/>
        <ellipse cx="175" cy="485" rx="8" ry="10" fill="none" stroke="#d2b48c" strokeWidth="1"/>
      </g>

      {/* Pernas com músculos */}
      <g id="legs">
        {/* Perna esquerda */}
        <ellipse cx="120" cy="540" rx="18" ry="45" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <line x1="110" y1="505" x2="110" y2="575" stroke="#d2b48c" strokeWidth="1"/>
        <line x1="130" y1="505" x2="130" y2="575" stroke="#d2b48c" strokeWidth="1"/>
        
        {/* Perna direita */}
        <ellipse cx="180" cy="540" rx="18" ry="45" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <line x1="170" y1="505" x2="170" y2="575" stroke="#d2b48c" strokeWidth="1"/>
        <line x1="190" y1="505" x2="190" y2="575" stroke="#d2b48c" strokeWidth="1"/>
      </g>

      {/* Tornozelos */}
      <g id="ankles">
        <circle cx="120" cy="585" r="10" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <circle cx="180" cy="585" r="10" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
      </g>

      {/* Pés mais detalhados */}
      <g id="feet">
        {/* Pé esquerdo */}
        <ellipse cx="115" cy="595" rx="18" ry="12" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <rect x="110" y="590" width="3" height="8" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        <rect x="113" y="588" width="3" height="10" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        <rect x="116" y="588" width="3" height="10" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        <rect x="119" y="590" width="3" height="8" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        <rect x="122" y="592" width="3" height="6" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        
        {/* Pé direito */}
        <ellipse cx="185" cy="595" rx="18" ry="12" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="2"/>
        <rect x="180" y="590" width="3" height="8" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        <rect x="183" y="588" width="3" height="10" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        <rect x="186" y="588" width="3" height="10" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        <rect x="189" y="590" width="3" height="8" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
        <rect x="192" y="592" width="3" height="6" rx="1" fill="url(#skinGradient)" stroke="#d2b48c" strokeWidth="1"/>
      </g>

      {/* Marcadores existentes */}
      {markers.map((marker) => (
        <g key={marker.id}>
          <circle
            cx={(marker.x / 100) * 300}
            cy={(marker.y / 100) * 600}
            r="12"
            className={`${getMarkerColor(marker.type)} cursor-pointer shadow-lg`}
            onClick={(e) => {
              e.stopPropagation();
              onMarkerRemove(marker.id);
            }}
            style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}
          />
          <text
            x={(marker.x / 100) * 300}
            y={(marker.y / 100) * 600 + 5}
            textAnchor="middle"
            className="text-sm font-bold text-white pointer-events-none"
            style={{ fontSize: '14px' }}
          >
            {getMarkerIcon(marker.type)}
          </text>
        </g>
      ))}
      
      {/* Marcador pendente */}
      {pendingMarker && (
        <g>
          <circle
            cx={(pendingMarker.x / 100) * 300}
            cy={(pendingMarker.y / 100) * 600}
            r="12"
            className={`${getMarkerColor(newMarkerType)} opacity-70 animate-pulse`}
            style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}
          />
          <text
            x={(pendingMarker.x / 100) * 300}
            y={(pendingMarker.y / 100) * 600 + 5}
            textAnchor="middle"
            className="text-sm font-bold text-white pointer-events-none"
            style={{ fontSize: '14px' }}
          >
            {getMarkerIcon(newMarkerType)}
          </text>
        </g>
      )}

      {/* Pontos de referência anatômica */}
      <g id="anatomical-points" opacity="0.3">
        {/* Pontos principais para referência */}
        <circle cx="150" cy="60" r="2" fill="#666" /> {/* Cabeça */}
        <circle cx="150" cy="110" r="2" fill="#666" /> {/* Pescoço */}
        <circle cx="95" cy="140" r="2" fill="#666" />  {/* Ombro esquerdo */}
        <circle cx="205" cy="140" r="2" fill="#666" /> {/* Ombro direito */}
        <circle cx="150" cy="180" r="2" fill="#666" /> {/* Centro do peito */}
        <circle cx="150" cy="250" r="2" fill="#666" /> {/* Abdômen */}
        <circle cx="150" cy="320" r="2" fill="#666" /> {/* Quadril */}
        <circle cx="125" cy="485" r="2" fill="#666" /> {/* Joelho esquerdo */}
        <circle cx="175" cy="485" r="2" fill="#666" /> {/* Joelho direito */}
        <circle cx="120" cy="585" r="2" fill="#666" /> {/* Tornozelo esquerdo */}
        <circle cx="180" cy="585" r="2" fill="#666" /> {/* Tornozelo direito */}
      </g>
    </svg>
  );

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedView('front')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'front'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vista Frontal
          </button>
          <button
            onClick={() => setSelectedView('back')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'back'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vista Posterior
          </button>
          <button
            onClick={() => setSelectedView('side')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'side'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vista Lateral
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Diminuir zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Aumentar zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Resetar zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ferramentas de Marcação */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setNewMarkerType('pain');
                setIsAddingMarker(!isAddingMarker);
              }}
              className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 min-h-[44px] ${
                isAddingMarker && newMarkerType === 'pain'
                  ? 'bg-red-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-red-600 border-2 border-red-200 hover:bg-red-50 hover:border-red-300'
              }`}
            >
              <span className="text-lg">⚡</span>
              Marcar Dor
            </button>
            <button
              onClick={() => {
                setNewMarkerType('injury');
                setIsAddingMarker(!isAddingMarker);
              }}
              className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 min-h-[44px] ${
                isAddingMarker && newMarkerType === 'injury'
                  ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-orange-600 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300'
              }`}
            >
              <span className="text-lg">🩹</span>
              Marcar Lesão
            </button>
            <button
              onClick={() => {
                setNewMarkerType('observation');
                setIsAddingMarker(!isAddingMarker);
              }}
              className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 min-h-[44px] ${
                isAddingMarker && newMarkerType === 'observation'
                  ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300'
              }`}
            >
              <span className="text-lg">👁️</span>
              Observação
            </button>
          </div>

          {isAddingMarker && (
            <div className="flex items-center gap-2 text-sm text-gray-700 bg-white px-4 py-2 rounded-lg border-2 border-dashed border-gray-300">
              <Target className="w-4 h-4 text-primary-500" />
              <span className="font-medium">Clique no diagrama para adicionar marcador</span>
            </div>
          )}
        </div>
      </div>

      {/* Diagrama Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 overflow-hidden shadow-inner">
            <div className="w-full h-[500px] flex items-center justify-center bg-white rounded-lg shadow-sm">
              <HumanBodySVG />
            </div>
          </div>
        </div>

        {/* Lista de Marcadores */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Marcadores</h3>
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {markers.length}
            </span>
          </div>
          
          {markers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium">Nenhum marcador adicionado</p>
              <p className="text-xs text-gray-400 mt-1">
                Use as ferramentas acima para marcar pontos no diagrama
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {markers.map((marker, index) => (
                <div
                  key={marker.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 hover:border-gray-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getMarkerColor(marker.type)} shadow-sm`}>
                          {getMarkerIcon(marker.type)}
                        </span>
                        <div>
                          <span className="text-sm font-semibold text-gray-800 capitalize">
                            {marker.type === 'pain' ? 'Dor' : marker.type === 'injury' ? 'Lesão' : 'Observação'} #{index + 1}
                          </span>
                          <p className="text-xs text-gray-500">
                            Posição: {marker.x.toFixed(1)}%, {marker.y.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{marker.description}</p>
                    </div>
                    <button
                      onClick={() => onMarkerRemove(marker.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Remover marcador"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Adição de Marcador */}
      {showMarkerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${getMarkerColor(newMarkerType)}`}>
                {getMarkerIcon(newMarkerType)}
              </span>
              <h3 className="text-lg font-semibold text-gray-800">
                Adicionar {newMarkerType === 'pain' ? 'Dor' : newMarkerType === 'injury' ? 'Lesão' : 'Observação'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="markerDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição detalhada *
                </label>
                <textarea
                  id="markerDescription"
                  value={markerDescription}
                  onChange={(e) => setMarkerDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 resize-none text-sm"
                  placeholder={`Descreva a ${newMarkerType === 'pain' ? 'dor ou desconforto' : newMarkerType === 'injury' ? 'lesão ou trauma' : 'observação'} em detalhes...`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Seja específico sobre intensidade, frequência e características
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleMarkerCancel}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleMarkerSave}
                  disabled={!markerDescription.trim()}
                  className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legenda Melhorada */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Legenda dos Marcadores
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
            <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm text-white font-bold">⚡</span>
            <div>
              <p className="font-medium text-red-700">Dor / Desconforto</p>
              <p className="text-xs text-red-600">Sensações dolorosas ou incômodas</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200">
            <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm text-white font-bold">🩹</span>
            <div>
              <p className="font-medium text-orange-700">Lesão / Trauma</p>
              <p className="text-xs text-orange-600">Ferimentos ou traumas físicos</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm text-white font-bold">👁️</span>
            <div>
              <p className="font-medium text-blue-700">Observação Geral</p>
              <p className="text-xs text-blue-600">Pontos de atenção ou observação</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Dica:</strong> Clique nos marcadores para removê-los. Use o zoom para maior precisão na marcação.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnatomicalDiagram;