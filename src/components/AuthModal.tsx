import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { User as UserType } from "../types";

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

export default function AuthModal({ onClose, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: UserType = {
      username: username || email.split('@')[0],
      email,
      joinedAt: new Date().toISOString()
    };
    onLogin(mockUser);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl p-8 md:p-12"
      >
        <div className="flex justify-between items-center mb-8">
           <div className="p-3 bg-caramelo-beige dark:bg-slate-800 rounded-2xl text-caramelo-orange shadow-inner">
             <Sparkles className="h-6 w-6" />
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
             <X className="h-6 w-6 text-slate-400" />
           </button>
        </div>

        <h2 className="text-3xl font-display font-bold mb-2 text-caramelo-dark dark:text-white">
          {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
        </h2>
        <p className="text-slate-500 text-sm mb-10">
          {isLogin ? "Acesse sua experiência personalizada." : "Junte-se à revolução do jornalismo com IA."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Nome de usuário" 
                required
                className="w-full pl-12 pr-4 py-4 bg-caramelo-beige/20 dark:bg-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-caramelo-orange outline-none transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
            <input 
              type="email" 
              placeholder="seu@gmail.com" 
              required
              className="w-full pl-12 pr-4 py-4 bg-caramelo-beige/20 dark:bg-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-caramelo-orange outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
            <input 
              type="password" 
              placeholder="Sua senha" 
              required
              className="w-full pl-12 pr-4 py-4 bg-caramelo-beige/20 dark:bg-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-caramelo-orange outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full py-4 bg-caramelo-dark dark:bg-caramelo-orange text-white rounded-2xl font-bold shadow-xl shadow-caramelo-orange/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            {isLogin ? "Entrar" : "Criar Conta"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-caramelo-orange hover:underline"
          >
            {isLogin ? "Não tem uma conta? Cadastre-se" : "Já possui conta? Entre agora"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
