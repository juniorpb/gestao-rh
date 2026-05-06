
import React, { useState } from 'react';
import { User, LogIn, ShieldCheck, UserCircle } from 'lucide-react';
import { mockUsers } from '../lib/mockData';

interface LoginProps {
  onLogin: (email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4">
        <div className="bg-blue-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">PRH Polo</h1>
          <p className="text-blue-100 mt-1 text-sm font-medium">Gestão Inteligente de Projetos e RH</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
              E-mail do Usuário
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pl-11 text-sm font-medium"
                placeholder="nome@polo.com"
                required
              />
              <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
          >
            Acessar Sistema
          </button>

          <div className="pt-6 border-t border-slate-100">
            <p className="text-[10px] uppercase font-black text-slate-300 text-center mb-4 tracking-widest">Acesso Rápido para Testes</p>
            <div className="grid grid-cols-2 gap-3">
              {mockUsers.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => onLogin(user.email)}
                  className="flex flex-col items-center p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                >
                  <UserCircle size={20} className="text-slate-400 group-hover:text-blue-500 mb-1 transition-colors" />
                  <span className="text-xs font-bold text-slate-700">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{user.role}</span>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
