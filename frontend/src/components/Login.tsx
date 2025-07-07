import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flower, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular um pequeno delay para mostrar o loading
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-accent-500 to-primary-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-transparent via-white/5 to-transparent -rotate-12 animate-pulse delay-1000"></div>
      </div>

      {/* Container principal */}
      <div className="relative z-10 w-full max-w-md">
        {/* Card de login */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-3d p-8 sm:p-10 transition-all duration-500 hover:shadow-neon hover:-translate-y-2">
          {/* Logo e título */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-primary-gradient rounded-2xl flex items-center justify-center text-white text-2xl mr-4 shadow-lg">
                <Flower className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-primary-gradient bg-clip-text text-transparent">
                  Sarah Pilates
                </h1>
                <p className="text-gray-600 text-sm mt-1">Studio Premium</p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Bem-vindo de volta!</h2>
              <p className="text-gray-600">Entre na sua conta para continuar</p>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-gray-50 transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:bg-white text-base"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Campo de senha */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl bg-gray-50 transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:bg-white text-base"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Lembrar-me e esqueci a senha */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Botão de login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-gradient text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-500 hover:shadow-neon hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-h-[56px]"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Informações adicionais */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <button className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Entre em contato
              </button>
            </p>
          </div>

          {/* Credenciais de demonstração */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-700 text-center font-medium mb-2">
              💡 Demonstração - Use qualquer email e senha
            </p>
            <p className="text-xs text-blue-600 text-center">
              Clique em "Entrar" para acessar o sistema
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm">
            © 2024 Sarah Pilates Studio. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;