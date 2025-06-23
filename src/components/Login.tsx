import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flower, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation - in a real app, you'd authenticate with a backend
    if (email && password) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-animated-gradient bg-[length:200%_200%] animate-gradient">
      <div className="bg-white/95 backdrop-blur-sm p-12 rounded-3xl shadow-3d w-full max-w-md text-center transition-all duration-500 hover:scale-105 relative z-10">
        {/* Logo Container */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center text-white text-xl mr-4 flex-shrink-0">
            <Flower className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold bg-primary-gradient bg-clip-text text-transparent">
            Sarah Pilates
          </h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors duration-300" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail"
              required
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-slate-50 text-base transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:bg-white"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors duration-300" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-slate-50 text-base transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-gradient text-white py-4 px-8 rounded-xl font-medium text-lg flex items-center justify-center gap-3 transition-all duration-500 hover:shadow-neon hover:-translate-y-1 mt-6"
          >
            <LogIn className="w-5 h-5" />
            Entrar
          </button>

          <a
            href="#"
            className="block mt-5 text-primary-500 text-sm hover:text-accent-500 transition-colors duration-300 hover:underline"
          >
            Esqueceu sua senha?
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login;