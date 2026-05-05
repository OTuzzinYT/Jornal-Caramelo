import { motion } from "motion/react";
import { X, Lock, ShieldCheck } from "lucide-react";
import React, { useState } from "react";

interface AdminAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminAuthModal({ onClose, onSuccess }: AdminAuthModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "AMAM") {
      onSuccess();
      onClose();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl p-8"
      >
        <div className="flex flex-col items-center text-center mb-8">
           <div className="w-16 h-16 bg-caramelo-orange/10 rounded-full flex items-center justify-center text-caramelo-orange mb-4">
             <ShieldCheck className="h-8 w-8" />
           </div>
           <h2 className="text-2xl font-display font-bold text-caramelo-dark dark:text-white">Acesso Restrito</h2>
           <p className="text-slate-500 text-sm">Insira a credencial administrativa para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
            <input 
              type="password" 
              placeholder="Senha de acesso" 
              autoFocus
              className={`w-full pl-12 pr-4 py-4 bg-caramelo-beige/20 dark:bg-slate-800 rounded-2xl text-sm outline-none transition-all ${error ? 'ring-2 ring-red-500 animate-shake' : 'focus:ring-2 focus:ring-caramelo-orange'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
             <button 
              type="button"
              onClick={onClose}
              className="flex-grow py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-sm"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-grow py-4 bg-caramelo-orange text-white rounded-2xl font-bold text-sm shadow-xl shadow-caramelo-orange/20"
            >
              Entrar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
