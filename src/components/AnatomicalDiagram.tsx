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

// Marcadores anatômicos pré-cadastrados para cada vista
const ANATOMICAL_REFERENCE_POINTS = {
  front: [
    // Cabeça e Pescoço
    { id: 'front_head_top', x: 50, y: 8, name: 'Topo da Cabeça', function: 'Referência craniana superior' },
    { id: 'front_forehead', x: 50, y: 12, name: 'Testa', function: 'Região frontal do crânio' },
    { id: 'front_eyes', x: 50, y: 15, name: 'Olhos', function: 'Órgãos da visão' },
    { id: 'front_nose', x: 50, y: 17, name: 'Nariz', function: 'Órgão olfativo e respiratório' },
    { id: 'front_mouth', x: 50, y: 19, name: 'Boca', function: 'Cavidade oral' },
    { id: 'front_chin', x: 50, y: 22, name: 'Queixo', function: 'Região mentoniana' },
    { id: 'front_neck_front', x: 50, y: 25, name: 'Pescoço Anterior', function: 'Região cervical anterior' },
    
    // Tronco Superior
    { id: 'front_throat', x: 50, y: 27, name: 'Garganta', function: 'Região da faringe/laringe' },
    { id: 'front_suprasternal', x: 50, y: 30, name: 'Fúrcula Esternal', function: 'Depressão supraesternal' },
    { id: 'front_right_clavicle', x: 35, y: 32, name: 'Clavícula Direita', function: 'Osso da cintura escapular' },
    { id: 'front_left_clavicle', x: 65, y: 32, name: 'Clavícula Esquerda', function: 'Osso da cintura escapular' },
    { id: 'front_sternum_top', x: 50, y: 35, name: 'Manúbrio do Esterno', function: 'Parte superior do esterno' },
    
    // Ombros
    { id: 'front_right_shoulder', x: 32, y: 35, name: 'Ombro Direito', function: 'Articulação glenoumeral' },
    { id: 'front_left_shoulder', x: 68, y: 35, name: 'Ombro Esquerdo', function: 'Articulação glenoumeral' },
    { id: 'front_right_acromion', x: 30, y: 33, name: 'Acrômio Direito', function: 'Processo do ombro' },
    { id: 'front_left_acromion', x: 70, y: 33, name: 'Acrômio Esquerdo', function: 'Processo do ombro' },
    
    // Tórax
    { id: 'front_sternum_body', x: 50, y: 40, name: 'Corpo do Esterno', function: 'Parte central do esterno' },
    { id: 'front_right_pectoral', x: 43, y: 38, name: 'Peitoral Direito', function: 'Músculo peitoral maior' },
    { id: 'front_left_pectoral', x: 57, y: 38, name: 'Peitoral Esquerdo', function: 'Músculo peitoral maior' },
    { id: 'front_xiphoid', x: 50, y: 45, name: 'Processo Xifoide', function: 'Extremidade inferior do esterno' },
    
    // Braços
    { id: 'front_right_arm_upper', x: 27, y: 42, name: 'Braço Direito Superior', function: 'Região do úmero' },
    { id: 'front_left_arm_upper', x: 73, y: 42, name: 'Braço Esquerdo Superior', function: 'Região do úmero' },
    { id: 'front_right_bicep', x: 25, y: 40, name: 'Bíceps Direito', function: 'Músculo flexor do braço' },
    { id: 'front_left_bicep', x: 75, y: 40, name: 'Bíceps Esquerdo', function: 'Músculo flexor do braço' },
    
    // Cotovelos
    { id: 'front_right_elbow', x: 27, y: 50, name: 'Cotovelo Direito', function: 'Articulação úmero-radial' },
    { id: 'front_left_elbow', x: 73, y: 50, name: 'Cotovelo Esquerdo', function: 'Articulação úmero-radial' },
    
    // Antebraços
    { id: 'front_right_forearm', x: 25, y: 55, name: 'Antebraço Direito', function: 'Região rádio-ulnar' },
    { id: 'front_left_forearm', x: 75, y: 55, name: 'Antebraço Esquerdo', function: 'Região rádio-ulnar' },
    
    // Punhos
    { id: 'front_right_wrist', x: 25, y: 62, name: 'Punho Direito', function: 'Articulação radiocárpica' },
    { id: 'front_left_wrist', x: 75, y: 62, name: 'Punho Esquerdo', function: 'Articulação radiocárpica' },
    
    // Mãos
    { id: 'front_right_hand', x: 23, y: 67, name: 'Mão Direita', function: 'Extremidade superior' },
    { id: 'front_left_hand', x: 77, y: 67, name: 'Mão Esquerda', function: 'Extremidade superior' },
    
    // Abdômen
    { id: 'front_epigastrium', x: 50, y: 48, name: 'Epigástrio', function: 'Região abdominal superior' },
    { id: 'front_umbilicus', x: 50, y: 52, name: 'Umbigo', function: 'Cicatriz umbilical' },
    { id: 'front_hypogastrium', x: 50, y: 56, name: 'Hipogástrio', function: 'Região abdominal inferior' },
    
    // Quadril e Pelve
    { id: 'front_right_iliac_crest', x: 43, y: 58, name: 'Crista Ilíaca Direita', function: 'Borda superior do ílio' },
    { id: 'front_left_iliac_crest', x: 57, y: 58, name: 'Crista Ilíaca Esquerda', function: 'Borda superior do ílio' },
    { id: 'front_pubic_symphysis', x: 50, y: 62, name: 'Sínfise Púbica', function: 'Articulação púbica' },
    
    // Coxas
    { id: 'front_right_thigh_upper', x: 42, y: 68, name: 'Coxa Direita Superior', function: 'Região femoral superior' },
    { id: 'front_left_thigh_upper', x: 58, y: 68, name: 'Coxa Esquerda Superior', function: 'Região femoral superior' },
    { id: 'front_right_quadriceps', x: 42, y: 72, name: 'Quadríceps Direito', function: 'Músculo extensor da coxa' },
    { id: 'front_left_quadriceps', x: 58, y: 72, name: 'Quadríceps Esquerdo', function: 'Músculo extensor da coxa' },
    
    // Joelhos
    { id: 'front_right_patella', x: 42, y: 80, name: 'Patela Direita', function: 'Osso sesamoide do joelho' },
    { id: 'front_left_patella', x: 58, y: 80, name: 'Patela Esquerda', function: 'Osso sesamoide do joelho' },
    { id: 'front_right_knee', x: 42, y: 82, name: 'Joelho Direito', function: 'Articulação femorotibial' },
    { id: 'front_left_knee', x: 58, y: 82, name: 'Joelho Esquerdo', function: 'Articulação femorotibial' },
    
    // Pernas
    { id: 'front_right_shin', x: 40, y: 88, name: 'Canela Direita', function: 'Região da tíbia' },
    { id: 'front_left_shin', x: 60, y: 88, name: 'Canela Esquerda', function: 'Região da tíbia' },
    
    // Tornozelos
    { id: 'front_right_ankle', x: 40, y: 95, name: 'Tornozelo Direito', function: 'Articulação talocrural' },
    { id: 'front_left_ankle', x: 60, y: 95, name: 'Tornozelo Esquerdo', function: 'Articulação talocrural' },
    
    // Pés
    { id: 'front_right_foot', x: 38, y: 98, name: 'Pé Direito', function: 'Extremidade inferior' },
    { id: 'front_left_foot', x: 62, y: 98, name: 'Pé Esquerdo', function: 'Extremidade inferior' }
  ],
  
  back: [
    // Cabeça e Pescoço
    { id: 'back_occiput', x: 50, y: 8, name: 'Occipital', function: 'Região posterior do crânio' },
    { id: 'back_neck_posterior', x: 50, y: 25, name: 'Pescoço Posterior', function: 'Região cervical posterior' },
    { id: 'back_c7', x: 50, y: 28, name: 'C7 (Vértebra Proeminente)', function: '7ª vértebra cervical' },
    
    // Ombros e Escápulas
    { id: 'back_right_scapula', x: 35, y: 38, name: 'Escápula Direita', function: 'Omoplata direita' },
    { id: 'back_left_scapula', x: 65, y: 38, name: 'Escápula Esquerda', function: 'Omoplata esquerda' },
    { id: 'back_right_shoulder_blade', x: 32, y: 35, name: 'Ombro Direito Posterior', function: 'Região deltoidea posterior' },
    { id: 'back_left_shoulder_blade', x: 68, y: 35, name: 'Ombro Esquerdo Posterior', function: 'Região deltoidea posterior' },
    
    // Coluna Vertebral
    { id: 'back_t1', x: 50, y: 32, name: 'T1', function: '1ª vértebra torácica' },
    { id: 'back_t6', x: 50, y: 42, name: 'T6', function: '6ª vértebra torácica' },
    { id: 'back_t12', x: 50, y: 52, name: 'T12', function: '12ª vértebra torácica' },
    { id: 'back_l1', x: 50, y: 55, name: 'L1', function: '1ª vértebra lombar' },
    { id: 'back_l3', x: 50, y: 60, name: 'L3', function: '3ª vértebra lombar' },
    { id: 'back_l5', x: 50, y: 65, name: 'L5', function: '5ª vértebra lombar' },
    { id: 'back_sacrum', x: 50, y: 68, name: 'Sacro', function: 'Osso sacral' },
    { id: 'back_coccyx', x: 50, y: 72, name: 'Cóccix', function: 'Osso do cóccix' },
    
    // Braços Posteriores
    { id: 'back_right_tricep', x: 27, y: 42, name: 'Tríceps Direito', function: 'Músculo extensor do braço' },
    { id: 'back_left_tricep', x: 73, y: 42, name: 'Tríceps Esquerdo', function: 'Músculo extensor do braço' },
    { id: 'back_right_elbow_post', x: 27, y: 50, name: 'Cotovelo Direito Posterior', function: 'Olécrano direito' },
    { id: 'back_left_elbow_post', x: 73, y: 50, name: 'Cotovelo Esquerdo Posterior', function: 'Olécrano esquerdo' },
    
    // Região Lombar
    { id: 'back_right_erector', x: 45, y: 58, name: 'Eretor da Espinha Direito', function: 'Músculo paravertebral' },
    { id: 'back_left_erector', x: 55, y: 58, name: 'Eretor da Espinha Esquerdo', function: 'Músculo paravertebral' },
    
    // Glúteos
    { id: 'back_right_glute_max', x: 43, y: 72, name: 'Glúteo Máximo Direito', function: 'Músculo glúteo maior' },
    { id: 'back_left_glute_max', x: 57, y: 72, name: 'Glúteo Máximo Esquerdo', function: 'Músculo glúteo maior' },
    { id: 'back_right_glute_med', x: 40, y: 68, name: 'Glúteo Médio Direito', function: 'Músculo glúteo médio' },
    { id: 'back_left_glute_med', x: 60, y: 68, name: 'Glúteo Médio Esquerdo', function: 'Músculo glúteo médio' },
    
    // Coxas Posteriores
    { id: 'back_right_hamstring', x: 42, y: 78, name: 'Isquiotibiais Direitos', function: 'Músculos posteriores da coxa' },
    { id: 'back_left_hamstring', x: 58, y: 78, name: 'Isquiotibiais Esquerdos', function: 'Músculos posteriores da coxa' },
    
    // Joelhos Posteriores
    { id: 'back_right_popliteal', x: 42, y: 82, name: 'Fossa Poplítea Direita', function: 'Região posterior do joelho' },
    { id: 'back_left_popliteal', x: 58, y: 82, name: 'Fossa Poplítea Esquerda', function: 'Região posterior do joelho' },
    
    // Panturrilhas
    { id: 'back_right_calf', x: 40, y: 88, name: 'Panturrilha Direita', function: 'Músculo gastrocnêmio' },
    { id: 'back_left_calf', x: 60, y: 88, name: 'Panturrilha Esquerda', function: 'Músculo gastrocnêmio' },
    
    // Tendão de Aquiles
    { id: 'back_right_achilles', x: 40, y: 94, name: 'Tendão de Aquiles Direito', function: 'Tendão calcâneo' },
    { id: 'back_left_achilles', x: 60, y: 94, name: 'Tendão de Aquiles Esquerdo', function: 'Tendão calcâneo' },
    
    // Calcanhares
    { id: 'back_right_heel', x: 38, y: 98, name: 'Calcanhar Direito', function: 'Osso calcâneo' },
    { id: 'back_left_heel', x: 62, y: 98, name: 'Calcanhar Esquerdo', function: 'Osso calcâneo' }
  ],
  
  side: [
    // Cabeça e Pescoço Lateral
    { id: 'side_temporal', x: 50, y: 12, name: 'Região Temporal', function: 'Lateral do crânio' },
    { id: 'side_ear', x: 52, y: 15, name: 'Orelha', function: 'Órgão da audição' },
    { id: 'side_mandible', x: 48, y: 20, name: 'Mandíbula', function: 'Osso da mandíbula' },
    { id: 'side_neck_lateral', x: 48, y: 25, name: 'Pescoço Lateral', function: 'Região cervical lateral' },
    
    // Tronco Lateral
    { id: 'side_shoulder_lateral', x: 45, y: 35, name: 'Ombro Lateral', function: 'Articulação do ombro' },
    { id: 'side_axilla', x: 48, y: 38, name: 'Axila', function: 'Região axilar' },
    { id: 'side_ribs', x: 52, y: 42, name: 'Costelas', function: 'Arco costal' },
    { id: 'side_waist', x: 55, y: 52, name: 'Cintura', function: 'Região da cintura' },
    
    // Braço Lateral
    { id: 'side_arm_lateral', x: 35, y: 42, name: 'Braço Lateral', function: 'Lateral do úmero' },
    { id: 'side_elbow_lateral', x: 32, y: 50, name: 'Cotovelo Lateral', function: 'Epicôndilo lateral' },
    { id: 'side_forearm_lateral', x: 30, y: 55, name: 'Antebraço Lateral', function: 'Lateral do rádio' },
    
    // Quadril Lateral
    { id: 'side_hip_lateral', x: 52, y: 62, name: 'Quadril Lateral', function: 'Trocânter maior' },
    { id: 'side_iliac_crest_lat', x: 55, y: 58, name: 'Crista Ilíaca Lateral', function: 'Borda lateral do ílio' },
    
    // Coxa Lateral
    { id: 'side_thigh_lateral', x: 48, y: 72, name: 'Coxa Lateral', function: 'Lateral do fêmur' },
    { id: 'side_it_band', x: 50, y: 75, name: 'Banda Iliotibial', function: 'Trato iliotibial' },
    
    // Joelho Lateral
    { id: 'side_knee_lateral', x: 48, y: 82, name: 'Joelho Lateral', function: 'Côndilo lateral' },
    
    // Perna Lateral
    { id: 'side_fibula', x: 46, y: 88, name: 'Fíbula', function: 'Osso lateral da perna' },
    { id: 'side_ankle_lateral', x: 45, y: 95, name: 'Tornozelo Lateral', function: 'Maléolo lateral' },
    
    // Pé Lateral
    { id: 'side_foot_lateral', x: 42, y: 98, name: 'Pé Lateral', function: 'Borda lateral do pé' }
  ]
};

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
  const [showReferencePoints, setShowReferencePoints] = useState(false);

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

  // Vista Frontal
  const FrontViewSVG = () => (
    <svg
      viewBox="0 0 300 600"
      className="w-full h-full cursor-crosshair select-none"
      onClick={handleDiagramClick}
      style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
    >
      <defs>
        <radialGradient id="skinGradientFront" cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#f5deb3" />
          <stop offset="100%" stopColor="#deb887" />
        </radialGradient>
        <linearGradient id="shadowGradientFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d2b48c" />
          <stop offset="100%" stopColor="#bc9a6a" />
        </linearGradient>
      </defs>

      {/* Cabeça */}
      <ellipse cx="150" cy="60" rx="35" ry="40" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <ellipse cx="150" cy="65" rx="30" ry="35" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      <circle cx="140" cy="55" r="2" fill="#333"/>
      <circle cx="160" cy="55" r="2" fill="#333"/>
      <path d="M 150 60 L 148 65 L 152 65 Z" fill="#d2b48c"/>
      <path d="M 145 70 Q 150 73 155 70" stroke="#d2b48c" strokeWidth="1" fill="none"/>

      {/* Pescoço */}
      <rect x="135" y="95" width="30" height="25" rx="5" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="140" y1="100" x2="140" y2="115" stroke="#d2b48c" strokeWidth="1"/>
      <line x1="160" y1="100" x2="160" y2="115" stroke="#d2b48c" strokeWidth="1"/>

      {/* Tronco */}
      <ellipse cx="150" cy="180" rx="55" ry="70" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <ellipse cx="130" cy="160" rx="20" ry="25" fill="none" stroke="#d2b48c" strokeWidth="1" opacity="0.7"/>
      <ellipse cx="170" cy="160" rx="20" ry="25" fill="none" stroke="#d2b48c" strokeWidth="1" opacity="0.7"/>
      <rect x="125" y="230" width="50" height="60" rx="10" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="140" y1="235" x2="140" y2="285" stroke="#d2b48c" strokeWidth="1"/>
      <line x1="150" y1="235" x2="150" y2="285" stroke="#d2b48c" strokeWidth="1"/>
      <line x1="160" y1="235" x2="160" y2="285" stroke="#d2b48c" strokeWidth="1"/>
      <line x1="130" y1="250" x2="170" y2="250" stroke="#d2b48c" strokeWidth="1"/>
      <line x1="130" y1="265" x2="170" y2="265" stroke="#d2b48c" strokeWidth="1"/>

      {/* Ombros */}
      <circle cx="95" cy="140" r="25" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <circle cx="205" cy="140" r="25" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>

      {/* Braços */}
      <ellipse cx="80" cy="200" rx="18" ry="50" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="75" y1="170" x2="75" y2="230" stroke="#d2b48c" strokeWidth="1"/>
      <line x1="85" y1="170" x2="85" y2="230" stroke="#d2b48c" strokeWidth="1"/>
      <ellipse cx="220" cy="200" rx="18" ry="50" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="215" y1="170" x2="215" y2="230" stroke="#d2b48c" strokeWidth="1"/>
      <line x1="225" y1="170" x2="225" y2="230" stroke="#d2b48c" strokeWidth="1"/>

      {/* Cotovelos */}
      <circle cx="80" cy="250" r="12" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <circle cx="220" cy="250" r="12" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>

      {/* Antebraços */}
      <ellipse cx="75" cy="310" rx="15" ry="45" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="70" y1="270" x2="70" y2="350" stroke="#d2b48c" strokeWidth="1"/>
      <ellipse cx="225" cy="310" rx="15" ry="45" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="230" y1="270" x2="230" y2="350" stroke="#d2b48c" strokeWidth="1"/>

      {/* Punhos */}
      <circle cx="75" cy="355" r="8" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <circle cx="225" cy="355" r="8" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>

      {/* Mãos */}
      <ellipse cx="70" cy="380" rx="12" ry="18" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <rect x="65" y="370" width="3" height="12" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      <rect x="68" y="365" width="3" height="15" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      <rect x="71" y="365" width="3" height="15" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      <rect x="74" y="370" width="3" height="12" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      
      <ellipse cx="230" cy="380" rx="12" ry="18" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <rect x="225" y="370" width="3" height="12" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      <rect x="228" y="365" width="3" height="15" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      <rect x="231" y="365" width="3" height="15" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      <rect x="234" y="370" width="3" height="12" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>

      {/* Quadril */}
      <ellipse cx="150" cy="320" rx="45" ry="35" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <ellipse cx="130" cy="315" rx="15" ry="20" fill="none" stroke="#d2b48c" strokeWidth="1" opacity="0.7"/>
      <ellipse cx="170" cy="315" rx="15" ry="20" fill="none" stroke="#d2b48c" strokeWidth="1" opacity="0.7"/>

      {/* Coxas */}
      <ellipse cx="125" cy="420" rx="22" ry="65" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="115" y1="370" x2="115" y2="470" stroke="#d2b48c" strokeWidth="1"/>
      <line x1="135" y1="370" x2="135" y2="470" stroke="#d2b48c" strokeWidth="1"/>
      <ellipse cx="175" cy="420" rx="22" ry="65" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="165" y1="370" x2="165" y2="470" stroke="#d2b48c" strokeWidth="1"/>
      <line x1="185" y1="370" x2="185" y2="470" stroke="#d2b48c" strokeWidth="1"/>

      {/* Joelhos */}
      <circle cx="125" cy="485" r="15" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <circle cx="175" cy="485" r="15" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <ellipse cx="125" cy="485" rx="8" ry="10" fill="none" stroke="#d2b48c" strokeWidth="1"/>
      <ellipse cx="175" cy="485" rx="8" ry="10" fill="none" stroke="#d2b48c" strokeWidth="1"/>

      {/* Pernas */}
      <ellipse cx="120" cy="540" rx="18" ry="45" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="110" y1="505" x2="110" y2="575" stroke="#d2b48c" strokeWidth="1"/>
      <line x1="130" y1="505" x2="130" y2="575" stroke="#d2b48c" strokeWidth="1"/>
      <ellipse cx="180" cy="540" rx="18" ry="45" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="170" y1="505" x2="170" y2="575" stroke="#d2b48c" strokeWidth="1"/>
      <line x1="190" y1="505" x2="190" y2="575" stroke="#d2b48c" strokeWidth="1"/>

      {/* Tornozelos */}
      <circle cx="120" cy="585" r="10" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <circle cx="180" cy="585" r="10" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>

      {/* Pés */}
      <ellipse cx="115" cy="595" rx="18" ry="12" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <rect x="110" y="590" width="3" height="8" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      <rect x="113" y="588" width="3" height="10" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      <rect x="116" y="588" width="3" height="10" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      <rect x="119" y="590" width="3" height="8" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      <rect x="122" y="592" width="3" height="6" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      
      <ellipse cx="185" cy="595" rx="18" ry="12" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="2"/>
      <rect x="180" y="590" width="3" height="8" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      <rect x="183" y="588" width="3" height="10" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      <rect x="186" y="588" width="3" height="10" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      <rect x="189" y="590" width="3" height="8" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>
      <rect x="192" y="592" width="3" height="6" rx="1" fill="url(#skinGradientFront)" stroke="#d2b48c" strokeWidth="1"/>

      {/* Pontos de referência anatômica */}
      {showReferencePoints && (
        <g id="reference-points" opacity="0.6">
          {ANATOMICAL_REFERENCE_POINTS.front.map((point) => (
            <g key={point.id}>
              <circle 
                cx={(point.x / 100) * 300} 
                cy={(point.y / 100) * 600} 
                r="3" 
                fill="#4f46e5" 
                stroke="#fff" 
                strokeWidth="1"
              />
              <text
                x={(point.x / 100) * 300}
                y={(point.y / 100) * 600 - 8}
                textAnchor="middle"
                className="text-xs font-medium fill-blue-700"
                style={{ fontSize: '8px' }}
              >
                {point.name}
              </text>
            </g>
          ))}
        </g>
      )}

      {/* Marcadores do usuário */}
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
    </svg>
  );

  // Vista Posterior
  const BackViewSVG = () => (
    <svg
      viewBox="0 0 300 600"
      className="w-full h-full cursor-crosshair select-none"
      onClick={handleDiagramClick}
      style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
    >
      <defs>
        <radialGradient id="skinGradientBack" cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#f5deb3" />
          <stop offset="100%" stopColor="#deb887" />
        </radialGradient>
      </defs>

      {/* Cabeça posterior */}
      <ellipse cx="150" cy="60" rx="35" ry="40" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      
      {/* Pescoço posterior */}
      <rect x="135" y="95" width="30" height="25" rx="5" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      
      {/* Tronco posterior */}
      <ellipse cx="150" cy="180" rx="55" ry="70" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      
      {/* Escápulas */}
      <ellipse cx="125" cy="160" rx="18" ry="25" fill="none" stroke="#d2b48c" strokeWidth="2" opacity="0.8"/>
      <ellipse cx="175" cy="160" rx="18" ry="25" fill="none" stroke="#d2b48c" strokeWidth="2" opacity="0.8"/>
      
      {/* Coluna vertebral */}
      <line x1="150" y1="120" x2="150" y2="290" stroke="#d2b48c" strokeWidth="3"/>
      <circle cx="150" cy="130" r="2" fill="#d2b48c"/> {/* C7 */}
      <circle cx="150" cy="150" r="2" fill="#d2b48c"/> {/* T6 */}
      <circle cx="150" cy="200" r="2" fill="#d2b48c"/> {/* T12 */}
      <circle cx="150" cy="230" r="2" fill="#d2b48c"/> {/* L3 */}
      <circle cx="150" cy="260" r="2" fill="#d2b48c"/> {/* L5 */}
      
      {/* Músculos eretores da espinha */}
      <line x1="140" y1="140" x2="140" y2="270" stroke="#d2b48c" strokeWidth="2" opacity="0.7"/>
      <line x1="160" y1="140" x2="160" y2="270" stroke="#d2b48c" strokeWidth="2" opacity="0.7"/>

      {/* Ombros posteriores */}
      <circle cx="95" cy="140" r="25" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      <circle cx="205" cy="140" r="25" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>

      {/* Braços posteriores (tríceps) */}
      <ellipse cx="80" cy="200" rx="18" ry="50" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="75" y1="170" x2="75" y2="230" stroke="#d2b48c" strokeWidth="2"/>
      <ellipse cx="220" cy="200" rx="18" ry="50" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="225" y1="170" x2="225" y2="230" stroke="#d2b48c" strokeWidth="2"/>

      {/* Cotovelos posteriores */}
      <circle cx="80" cy="250" r="12" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      <circle cx="220" cy="250" r="12" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>

      {/* Antebraços posteriores */}
      <ellipse cx="75" cy="310" rx="15" ry="45" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      <ellipse cx="225" cy="310" rx="15" ry="45" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>

      {/* Região lombar */}
      <rect x="125" y="230" width="50" height="60" rx="10" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>

      {/* Quadril e glúteos */}
      <ellipse cx="150" cy="320" rx="45" ry="35" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      <ellipse cx="130" cy="330" rx="20" ry="25" fill="none" stroke="#d2b48c" strokeWidth="2" opacity="0.8"/>
      <ellipse cx="170" cy="330" rx="20" ry="25" fill="none" stroke="#d2b48c" strokeWidth="2" opacity="0.8"/>

      {/* Coxas posteriores (isquiotibiais) */}
      <ellipse cx="125" cy="420" rx="22" ry="65" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="115" y1="370" x2="115" y2="470" stroke="#d2b48c" strokeWidth="2"/>
      <ellipse cx="175" cy="420" rx="22" ry="65" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="185" y1="370" x2="185" y2="470" stroke="#d2b48c" strokeWidth="2"/>

      {/* Joelhos posteriores (fossa poplítea) */}
      <circle cx="125" cy="485" r="15" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      <circle cx="175" cy="485" r="15" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>

      {/* Panturrilhas */}
      <ellipse cx="120" cy="540" rx="18" ry="45" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="115" y1="505" x2="115" y2="575" stroke="#d2b48c" strokeWidth="2"/>
      <ellipse cx="180" cy="540" rx="18" ry="45" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="185" y1="505" x2="185" y2="575" stroke="#d2b48c" strokeWidth="2"/>

      {/* Tendões de Aquiles */}
      <line x1="120" y1="575" x2="120" y2="585" stroke="#d2b48c" strokeWidth="4"/>
      <line x1="180" y1="575" x2="180" y2="585" stroke="#d2b48c" strokeWidth="4"/>

      {/* Tornozelos posteriores */}
      <circle cx="120" cy="585" r="10" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      <circle cx="180" cy="585" r="10" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>

      {/* Calcanhares */}
      <ellipse cx="115" cy="595" rx="18" ry="12" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>
      <ellipse cx="185" cy="595" rx="18" ry="12" fill="url(#skinGradientBack)" stroke="#d2b48c" strokeWidth="2"/>

      {/* Pontos de referência anatômica */}
      {showReferencePoints && (
        <g id="reference-points-back" opacity="0.6">
          {ANATOMICAL_REFERENCE_POINTS.back.map((point) => (
            <g key={point.id}>
              <circle 
                cx={(point.x / 100) * 300} 
                cy={(point.y / 100) * 600} 
                r="3" 
                fill="#4f46e5" 
                stroke="#fff" 
                strokeWidth="1"
              />
              <text
                x={(point.x / 100) * 300}
                y={(point.y / 100) * 600 - 8}
                textAnchor="middle"
                className="text-xs font-medium fill-blue-700"
                style={{ fontSize: '8px' }}
              >
                {point.name}
              </text>
            </g>
          ))}
        </g>
      )}

      {/* Marcadores do usuário */}
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
    </svg>
  );

  // Vista Lateral
  const SideViewSVG = () => (
    <svg
      viewBox="0 0 300 600"
      className="w-full h-full cursor-crosshair select-none"
      onClick={handleDiagramClick}
      style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
    >
      <defs>
        <radialGradient id="skinGradientSide" cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#f5deb3" />
          <stop offset="100%" stopColor="#deb887" />
        </radialGradient>
      </defs>

      {/* Cabeça lateral */}
      <ellipse cx="150" cy="60" rx="40" ry="35" fill="url(#skinGradientSide)" stroke="#d2b48c" strokeWidth="2"/>
      <circle cx="155" cy="55" r="2" fill="#333"/> {/* Olho */}
      <ellipse cx="165" cy="58" rx="8" ry="12" fill="none" stroke="#d2b48c" strokeWidth="1"/> {/* Orelha */}
      <path d="M 140 75 Q 145 78 150 75" stroke="#d2b48c" strokeWidth="1" fill="none"/> {/* Boca */}
      
      {/* Pescoço lateral */}
      <path d="M 135 95 Q 140 100 145 120" fill="url(#skinGradientSide)" stroke="#d2b48c" strokeWidth="2"/>
      
      {/* Tronco lateral */}
      <ellipse cx="150" cy="180" rx="40" ry="70" fill="url(#skinGradientSide)" stroke="#d2b48c" strokeWidth="2"/>
      
      {/* Peito lateral */}
      <ellipse cx="140" cy="160" rx="25" ry="20" fill="none" stroke="#d2b48c" strokeWidth="1" opacity="0.7"/>
      
      {/* Costelas */}
      <path d="M 120 150 Q 160 155 180 160" stroke="#d2b48c" strokeWidth="1" opacity="0.6" fill="none"/>
      <path d="M 120 165 Q 160 170 180 175" stroke="#d2b48c" strokeWidth="1" opacity="0.6" fill="none"/>
      <path d="M 120 180 Q 160 185 180 190" stroke="#d2b48c" strokeWidth="1" opacity="0.6" fill="none"/>
      
      {/* Coluna lateral */}
      <path d="M 155 120 Q 160 180 165 250 Q 160 300 155 350" stroke="#d2b48c" strokeWidth="3" fill="none"/>
      
      {/* Abdômen lateral */}
      <rect x="130" y="230" width="40" height="60" rx="15" fill="url(#skinGradientSide)" stroke="#d2b48c" strokeWidth="2"/>
      
      {/* Ombro lateral */}
      <circle cx="120" cy="140" r="25" fill="url(#skinGradientSide)" stroke="#d2b48c" strokeWidth="2"/>
      
      {/* Braço lateral */}
      <ellipse cx="100" cy="200" rx="20" ry="50" fill="url(#skinGradientSide)" stroke="#d2b48c" strokeWidth="2"/>
      
      {/* Cotovelo lateral */}
      <circle cx="95" cy="250" r="12" fill="url(#skinGradientSide)" stroke="#d2b48c" strokeWidth="2"/>
      
      {/* Antebraço lateral */}
      <ellipse cx="90" cy="310" rx="15" ry="45" fill="url(#skinGradientSide)" stroke="#d2b48c" strokeWidth="2"/>
      
      {/* Mão lateral */}
      <ellipse cx="85" cy="380" rx="12" ry="18" fill="url(#skinGradientSide)" stroke="#d2b48c" strokeWidth="2"/>
      
      {/* Quadril lateral */}
      <ellipse cx="155" cy="320" rx="35" ry="40" fill="url(#skinGradientSide)" stroke="#d2b48c" strokeWidth="2"/>
      <circle cx="170" cy="310" r="8" fill="none" stroke="#d2b48c" strokeWidth="2"/> {/* Trocânter maior */}
      
      {/* Coxa lateral */}
      <ellipse cx="145" cy="420" rx="25" ry="65" fill="url(#skinGradientSide)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="160" y1="370" x2="160" y2="470" stroke="#d2b48c" strokeWidth="2"/> {/* Banda iliotibial */}
      
      {/* Joelho lateral */}
      <circle cx="145" cy="485" r="15" fill="url(#skinGradientSide)" stroke="#d2b48c" strokeWidth="2"/>
      
      {/* Perna lateral */}
      <ellipse cx="140" cy="540" rx="20" ry="45" fill="url(#skinGradientSide)" stroke="#d2b48c" strokeWidth="2"/>
      <line x1="130" y1="505" x2="130" y2="575" stroke="#d2b48c" strokeWidth="2"/> {/* Fíbula */}
      
      {/* Tornozelo lateral */}
      <circle cx="135" cy="585" r="10" fill="url(#skinGradientSide)" stroke="#d2b48c" strokeWidth="2"/>
      
      {/* Pé lateral */}
      <ellipse cx="125" cy="595" rx="25" ry="12" fill="url(#skinGradientSide)" stroke="#d2b48c" strokeWidth="2"/>
      <path d="M 105 595 L 145 595" stroke="#d2b48c" strokeWidth="2"/> {/* Arco do pé */}

      {/* Pontos de referência anatômica */}
      {showReferencePoints && (
        <g id="reference-points-side" opacity="0.6">
          {ANATOMICAL_REFERENCE_POINTS.side.map((point) => (
            <g key={point.id}>
              <circle 
                cx={(point.x / 100) * 300} 
                cy={(point.y / 100) * 600} 
                r="3" 
                fill="#4f46e5" 
                stroke="#fff" 
                strokeWidth="1"
              />
              <text
                x={(point.x / 100) * 300}
                y={(point.y / 100) * 600 - 8}
                textAnchor="middle"
                className="text-xs font-medium fill-blue-700"
                style={{ fontSize: '8px' }}
              >
                {point.name}
              </text>
            </g>
          ))}
        </g>
      )}

      {/* Marcadores do usuário */}
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
    </svg>
  );

  const renderCurrentView = () => {
    switch (selectedView) {
      case 'front': return <FrontViewSVG />;
      case 'back': return <BackViewSVG />;
      case 'side': return <SideViewSVG />;
      default: return <FrontViewSVG />;
    }
  };

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
          <button
            onClick={() => setShowReferencePoints(!showReferencePoints)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showReferencePoints
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pontos de Referência
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
              {renderCurrentView()}
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
            {showReferencePoints && ' Os pontos azuis são referências anatômicas para orientação.'}
          </p>
        </div>

        {/* Informações dos Pontos de Referência */}
        {showReferencePoints && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <h5 className="font-semibold text-indigo-800 mb-2">Pontos de Referência Anatômica</h5>
            <p className="text-sm text-indigo-700 mb-2">
              <strong>Vista Atual ({selectedView === 'front' ? 'Frontal' : selectedView === 'back' ? 'Posterior' : 'Lateral'}):</strong> 
              {' '}{ANATOMICAL_REFERENCE_POINTS[selectedView].length} pontos de referência disponíveis
            </p>
            <div className="text-xs text-indigo-600">
              <p>• <strong>Vista Frontal:</strong> Inclui pontos como testa, peitorais, umbigo, patelas</p>
              <p>• <strong>Vista Posterior:</strong> Inclui coluna vertebral, escápulas, glúteos, panturrilhas</p>
              <p>• <strong>Vista Lateral:</strong> Inclui perfil craniano, costelas, trocânter, banda iliotibial</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnatomicalDiagram;