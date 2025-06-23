import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Flower, 
  PieChart, 
  Users, 
  Calendar, 
  FileText,
  Settings,
  LogOut,
  GraduationCap,
  ClipboardList
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: PieChart, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Alunos', path: '/students' },
    { icon: GraduationCap, label: 'Instrutores', path: '/instructors' },
    { icon: Calendar, label: 'Agenda', path: '/schedule' },
    { icon: ClipboardList, label: 'Avaliações', path: '/evaluations' },
    { icon: FileText, label: 'Fichas', path: '/records' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="w-80 bg-dark p-8 relative overflow-hidden shadow-3d z-20">
      {/* Holographic Effect */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent animate-hologram pointer-events-none" />
      </div>

      {/* Logo */}
      <div className="flex items-center mb-10 relative z-10">
        <div className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center text-white text-xl mr-4">
          <Flower className="w-6 h-6" />
        </div>
        <h2 className="text-white text-xl font-semibold">Sarah Pilates</h2>
      </div>

      {/* Navigation */}
      <nav className="space-y-3 relative z-10">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <div
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-500 cursor-pointer ${
                isActive
                  ? 'bg-primary-gradient shadow-neon text-white'
                  : 'bg-white/5 text-white/80 hover:bg-primary-500/20 hover:translate-x-2'
              }`}
            >
              <Icon className="w-5 h-5 mr-4" />
              <span className="font-medium">{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-8 left-8 right-8">
        <div 
          onClick={() => navigate('/login')}
          className="flex items-center px-5 py-4 rounded-2xl bg-white/5 text-white/80 cursor-pointer transition-all duration-500 hover:bg-red-500/20 hover:translate-x-2"
        >
          <LogOut className="w-5 h-5 mr-4" />
          <span className="font-medium">Sair</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;