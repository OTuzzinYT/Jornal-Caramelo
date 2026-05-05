import React, { useState, useEffect } from "react";
import { Search, Menu, Newspaper, Bell, User as UserIcon, Layout, Clock as ClockIcon, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Category, User } from "../types";

interface HeaderProps {
  focusMode: boolean;
  setFocusMode: (val: boolean) => void;
  onCategoryChange: (cat: Category | null) => void;
  selectedCategory: Category | null;
  user: User | null;
  onAuthClick: () => void;
  onAdminTrigger: () => void;
  onSearch: (query: string) => void;
}

export default function Header({ 
  focusMode, 
  setFocusMode, 
  onCategoryChange, 
  selectedCategory, 
  user, 
  onAuthClick,
  onAdminTrigger,
  onSearch
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const categories = Object.values(Category);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-700 ${
      focusMode 
        ? "bg-[#fdfbf6]/80 backdrop-blur-xl border-b border-caramelo-orange/5 py-2" 
        : "bg-white/80 backdrop-blur-md border-b border-caramelo-beige py-0"
    }`}>
      {/* Real-time Panel */}
      {!focusMode && (
        <div className="bg-caramelo-beige/20 border-b border-caramelo-beige/10 py-1 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-3 w-3 text-caramelo-orange" />
                <span>{currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-2 hidden sm:flex">
                <CalendarIcon className="h-3 w-3 text-caramelo-orange" />
                <span>{currentTime.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${focusMode ? 'max-w-4xl' : ''}`}>
        <div className="flex justify-between items-center h-20">
          {/* Logo & Secret Admin Button */}
          <div className="flex items-center gap-4">
             {!focusMode && (
               <button 
                onClick={onAdminTrigger}
                className="text-xl hover:scale-125 transition-transform"
                title="Acesso Restrito"
              >
                🐕
              </button>
             )}
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer group"
              onClick={() => onCategoryChange(null)}
            >
              <span className={`font-display font-bold tracking-tight transition-all duration-700 ${focusMode ? 'text-xl' : 'text-2xl'} group-hover:scale-105`}>
                <span className="text-caramelo-orange">Jornal</span>
                <span className="text-caramelo-dark">Caramelo</span>
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          {!focusMode && (
            <nav className="hidden lg:flex space-x-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`text-sm font-medium transition-colors hover:text-caramelo-orange ${
                    selectedCategory === cat 
                      ? "text-caramelo-orange font-bold border-b-2 border-caramelo-orange" 
                      : "text-caramelo-dark"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {!focusMode && (
              <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Buscar notícias..."
                  className="pl-10 pr-4 py-2 bg-caramelo-beige/30 border-none rounded-full text-sm focus:ring-2 focus:ring-caramelo-orange outline-none transition-all w-48 focus:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </form>
            )}

            <button 
              onClick={onAuthClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border border-caramelo-beige hover:bg-caramelo-beige/20 transition-all group ${focusMode ? 'hidden sm:flex' : ''}`}
            >
              <div className="w-6 h-6 bg-caramelo-orange rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                {user ? user.username[0].toUpperCase() : <UserIcon className="h-3 w-3" />}
              </div>
              <span className="text-xs font-bold text-slate-600 group-hover:text-caramelo-orange">
                {user ? user.username : "Entrar"}
              </span>
            </button>

            <button 
              onClick={() => setFocusMode(!focusMode)}
              className={`p-2.5 rounded-2xl transition-all duration-300 flex items-center gap-2 group ${
                focusMode 
                  ? "bg-caramelo-orange text-white shadow-lg shadow-caramelo-orange/20" 
                  : "text-slate-400 hover:text-caramelo-orange hover:bg-caramelo-beige/20"
              }`}
              title={focusMode ? "Desativar Modo Foco" : "Ativar Modo Foco"}
            >
              {focusMode ? <Layout className="h-5 w-5" /> : <Newspaper className="h-5 w-5" />}
              {!focusMode && <span className="text-[10px] font-black uppercase tracking-tighter hidden xl:block">Modo Foco</span>}
            </button>

            {!focusMode && (
              <button 
                className="lg:hidden p-2 text-slate-500 hover:text-caramelo-orange"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-slate-900 border-t border-caramelo-beige dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onCategoryChange(cat);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-caramelo-orange hover:bg-caramelo-beige/20 rounded-md transition-colors"
                >
                  {cat}
                </button>
              ))}
              <div className="pt-4 px-3">
                 <div className="relative">
                  <input
                    type="text"
                    placeholder="Busca rápida..."
                    className="w-full pl-10 pr-4 py-3 bg-caramelo-beige/30 dark:bg-slate-800 border-none rounded-xl text-sm outline-none"
                  />
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
