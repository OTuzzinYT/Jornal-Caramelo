import { motion } from "motion/react";
import { X, Shield, Users, FileText, Settings, AlertCircle, TrendingUp, User as UserIcon } from "lucide-react";
import { User, NewsItem } from "../types";
import { useState } from "react";

interface AdminPanelProps {
  onClose: () => void;
  users: User[];
  news: NewsItem[];
  views: Record<string, number>;
  onUpdateNews: (updatedItem: NewsItem) => void;
}

type Tab = "noticias" | "usuarios" | "logs" | "settings";

export default function AdminPanel({ onClose, users, news, views, onUpdateNews }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("noticias");
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<NewsItem>>({});

  const totalViews = Object.values(views).reduce((a, b) => a + b, 0);
  const sortedNews = [...news].sort((a, b) => (views[b.id] || 0) - (views[a.id] || 0));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4 bg-slate-950/90 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full h-full md:h-[85vh] max-w-6xl bg-white dark:bg-slate-900 md:rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Sidebar */}
        <div className="w-full md:w-72 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col shrink-0">
          <div className="flex items-center justify-between md:mb-12">
            <div className="flex items-center gap-3 text-caramelo-orange">
              <Shield className="h-6 w-6" />
              <span className="font-display font-black uppercase tracking-widest text-[10px]">Portal Admin</span>
            </div>
            <button onClick={onClose} className="md:hidden p-2 text-slate-400"><X /></button>
          </div>

          <nav className="hidden md:flex flex-col gap-2 flex-grow">
            {[
              { id: "noticias", icon: FileText, label: "Conteúdo" },
              { id: "usuarios", icon: Users, label: "Audiência" },
              { id: "logs", icon: AlertCircle, label: "Auditoria" },
              { id: "settings", icon: Settings, label: "Sistema" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === item.id 
                    ? "bg-caramelo-orange text-white shadow-xl shadow-caramelo-orange/30 translate-x-2" 
                    : "text-slate-500 hover:bg-caramelo-beige/20"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <button 
            onClick={onClose}
            className="mt-auto px-4 py-3 text-slate-400 hover:text-red-500 text-sm font-bold flex items-center gap-2"
          >
            <X className="h-4 w-4" /> Sair
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow p-10 overflow-y-auto">
          <header className="mb-10 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-display font-bold text-caramelo-dark dark:text-white mb-2">Painel de Controle</h2>
              <p className="text-sm text-slate-500">Gerencie o conteúdo e a auditoria do Jornal Caramelo.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10">
            <div className="bg-caramelo-beige/20 dark:bg-slate-800 p-6 rounded-3xl border border-caramelo-orange/10">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 block mb-2">Total Visualizações</span>
              <span className="text-3xl font-display font-bold text-caramelo-dark dark:text-white">{totalViews}</span>
            </div>
            <div className="bg-caramelo-beige/20 dark:bg-slate-800 p-6 rounded-3xl border border-caramelo-orange/10">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 block mb-2">Usuários Registrados</span>
              <span className="text-3xl font-display font-bold text-caramelo-dark dark:text-white">{users.length}</span>
            </div>
            <div className="bg-caramelo-beige/20 dark:bg-slate-800 p-6 rounded-3xl border border-caramelo-orange/10">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 block mb-2">Notícias Ativas</span>
              <span className="text-3xl font-display font-bold text-caramelo-dark dark:text-white">{news.length}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
             {editingNews && (
                <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-caramelo-dark dark:text-white">Editando Matéria</h3>
                    <button onClick={() => setEditingNews(null)} className="text-slate-400 hover:text-slate-600"><X /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Título</label>
                        <input 
                          type="text" 
                          value={editForm.title || ""} 
                          onChange={e => setEditForm({...editForm, title: e.target.value})}
                          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-caramelo-orange outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Resumo</label>
                        <textarea 
                          value={editForm.summary || ""} 
                          onChange={e => setEditForm({...editForm, summary: e.target.value})}
                          className="w-full h-24 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-caramelo-orange outline-none resize-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Conteúdo Completo</label>
                        <textarea 
                          value={editForm.fullContent || ""} 
                          onChange={e => setEditForm({...editForm, fullContent: e.target.value})}
                          className="w-full h-44 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-caramelo-orange outline-none resize-none"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <button 
                          onClick={() => setEditingNews(null)}
                          className="px-6 py-3 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={() => {
                            if (editingNews && editForm.title) {
                              onUpdateNews({...editingNews, ...editForm} as NewsItem);
                              setEditingNews(null);
                            }
                          }}
                          className="px-6 py-3 bg-caramelo-orange text-white text-xs font-bold rounded-xl hover:bg-caramelo-orange/90 transition-colors shadow-lg shadow-caramelo-orange/20"
                        >
                          Salvar Alterações
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
             )}

             {activeTab === "noticias" && (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-700/30">
                    <tr>
                       <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Matéria</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Visualizações</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {sortedNews.map(n => (
                      <tr key={n.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1 group-hover:text-caramelo-orange transition-colors">{n.title}</span>
                            <span className="text-[9px] font-black uppercase text-slate-400">{n.category}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col items-center gap-2">
                             <div className="flex items-center gap-1.5 text-caramelo-orange font-bold text-sm">
                               <TrendingUp className="h-3 w-3" />
                               {views[n.id] || 0}
                             </div>
                             <div className="w-20 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                               <div className="h-full bg-caramelo-orange" style={{ width: `${Math.min(100, (views[n.id] || 0) * 10)}%` }}></div>
                             </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => {
                                setEditingNews(n);
                                setEditForm(n);
                              }}
                              className="px-3 py-1 bg-caramelo-beige/50 text-caramelo-orange text-[10px] font-black rounded-full uppercase tracking-tighter hover:bg-caramelo-orange hover:text-white transition-all"
                            >
                              Editar
                            </button>
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 text-[10px] font-black rounded-full uppercase tracking-tighter">Ativa</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             )}

             {activeTab === "usuarios" && (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-700/30">
                    <tr>
                       <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Leitor</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Registrado em</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {users.map(u => (
                      <tr key={u.email} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-caramelo-beige dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-caramelo-dark dark:text-white">
                              {u.username[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{u.username} {u.isAdmin && <span className="text-[9px] text-caramelo-orange ml-1">(ADM)</span>}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm text-slate-500">{u.email}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <span className="text-xs text-slate-400">{new Date(u.joinedAt).toLocaleDateString()}</span>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-8 py-20 text-center text-slate-400">Nenhum leitor registrado ainda.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
             )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
