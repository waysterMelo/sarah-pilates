import React, { useState } from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  Eye, 
  Plus, 
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw
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
      case 'pain': return 'bg-red-500 border-red-600';
      case 'injury': return 'bg-orange-500 border-orange-600';
      case 'observation': return 'bg-blue-500 border-blue-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  // SVG do corpo humano simplificado
  const HumanBodySVG = () => (
    <svg
      viewBox="0 0 200 400"
      className="w-full h-full cursor-crosshair"
      onClick={handleDiagramClick}
      style={{ transform: `scale(${zoom})` }}
    >
      {/* Cabeça */}
      <ellipse cx="100" cy="40" rx="25" ry="30" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      
      {/* Pescoço */}
      <rect x="90" y="65" width="20" height="15" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      
      {/* Tronco */}
      <rect x="70" y="80" width="60" height="120" rx="15" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      
      {/* Braços */}
      <rect x="40" y="90" width="15" height="80" rx="7" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      <rect x="145" y="90" width="15" height="80" rx="7" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      
      {/* Antebraços */}
      <rect x="35" y="170" width="15" height="60" rx="7" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      <rect x="150" y="170" width="15" height="60" rx="7" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      
      {/* Mãos */}
      <ellipse cx="42" cy="240" rx="8" ry="12" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      <ellipse cx="158" cy="240" rx="8" ry="12" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      
      {/* Quadril */}
      <rect x="75" y="200" width="50" height="40" rx="10" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      
      {/* Coxas */}
      <rect x="80" y="240" width="18" height="80" rx="9" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      <rect x="102" y="240" width="18" height="80" rx="9" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      
      {/* Pernas */}
      <rect x="82" y="320" width="16" height="60" rx="8" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      <rect x="104" y="320" width="16" height="60" rx="8" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      
      {/* Pés */}
      <ellipse cx="90" cy="390" rx="12" ry="8" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      <ellipse cx="112" cy="390" rx="12" ry="8" fill="#f3e8d0" stroke="#d4a574" strokeWidth="2"/>
      
      {/* Marcadores existentes */}
      {markers.map((marker) => (
        <g key={marker.id}>
          <circle
            cx={marker.x * 2}
            cy={marker.y * 4}
            r="8"
            className={`${getMarkerColor(marker.type)} cursor-pointer`}
            onClick={(e) => {
              e.stopPropagation();
              onMarkerRemove(marker.id);
            }}
          />
          <text
            x={marker.x * 2}
            y={marker.y * 4 + 5}
            textAnchor="middle"
            className="text-xs font-bold text-white pointer-events-none"
          >
            {getMarkerIcon(marker.type)}
          </text>
        </g>
      ))}
      
      {/* Marcador pendente */}
      {pendingMarker && (
        <circle
          cx={pendingMarker.x * 2}
          cy={pendingMarker.y * 4}
          r="8"
          className={`${getMarkerColor(newMarkerType)} opacity-70`}
        />
      )}
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
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title="Diminuir zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title="Aumentar zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title="Resetar zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ferramentas de Marcação */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setNewMarkerType('pain');
                setIsAddingMarker(!isAddingMarker);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                isAddingMarker && newMarkerType === 'pain'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
              }`}
            >
              ⚡ Dor
            </button>
            <button
              onClick={() => {
                setNewMarkerType('injury');
                setIsAddingMarker(!isAddingMarker);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                isAddingMarker && newMarkerType === 'injury'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-orange-600 border border-orange-200 hover:bg-orange-50'
              }`}
            >
              🩹 Lesão
            </button>
            <button
              onClick={() => {
                setNewMarkerType('observation');
                setIsAddingMarker(!isAddingMarker);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                isAddingMarker && newMarkerType === 'observation'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
              }`}
            >
              👁️ Observação
            </button>
          </div>

          {isAddingMarker && (
            <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border">
              Clique no diagrama para adicionar um marcador
            </div>
          )}
        </div>
      </div>

      {/* Diagrama Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 overflow-hidden">
            <div className="w-full h-96 flex items-center justify-center">
              <HumanBodySVG />
            </div>
          </div>
        </div>

        {/* Lista de Marcadores */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Marcadores ({markers.length})</h3>
          
          {markers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Nenhum marcador adicionado</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {markers.map((marker) => (
                <div
                  key={marker.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${getMarkerColor(marker.type)}`}>
                          {getMarkerIcon(marker.type)}
                        </span>
                        <span className="text-sm font-medium text-gray-800 capitalize">
                          {marker.type === 'pain' ? 'Dor' : marker.type === 'injury' ? 'Lesão' : 'Observação'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{marker.description}</p>
                    </div>
                    <button
                      onClick={() => onMarkerRemove(marker.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
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
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Adicionar {newMarkerType === 'pain' ? 'Dor' : newMarkerType === 'injury' ? 'Lesão' : 'Observação'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="markerDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  id="markerDescription"
                  value={markerDescription}
                  onChange={(e) => setMarkerDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                  placeholder="Descreva a observação, sintoma ou condição..."
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleMarkerCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleMarkerSave}
                  disabled={!markerDescription.trim()}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legenda */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Legenda</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">⚡</span>
            <span className="text-sm text-gray-600">Dor / Desconforto</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white">🩹</span>
            <span className="text-sm text-gray-600">Lesão / Trauma</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">👁️</span>
            <span className="text-sm text-gray-600">Observação Geral</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnatomicalDiagram;