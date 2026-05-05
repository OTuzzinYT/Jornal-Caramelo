import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Share2, MessageCircle, Send, Sparkles, ChevronLeft } from "lucide-react";
import { NewsItem, Comment, User } from "../types";
import { useState, useEffect } from "react";
import { summarizeNews } from "../services/geminiService";

interface NewsModalProps {
  news: NewsItem | null;
  onClose: () => void;
  user: User | null;
  focusMode: boolean;
}

export default function NewsModal({ news, onClose, user, focusMode }: NewsModalProps) {
  const [commentText, setCommentText] = useState("");
  const [aiSummary, setAiSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    { id: "1", author: "Caramelo Lover", text: "Excelente análise, o portal está cada vez melhor!", timestamp: new Date().toISOString() },
    { id: "2", author: "João Silva", text: "Muito bom ter esses resumos rápidos da IA.", timestamp: new Date().toISOString() }
  ]);

  useEffect(() => {
    if (news) {
      document.body.style.overflow = 'hidden';
      setAiSummary("");
      
      // Fetch AI Summary if missing or just to have a fresh one
      const fetchSummary = async () => {
        setLoadingSummary(true);
        try {
          const summary = await summarizeNews(news.title, news.fullContent || news.summary);
          setAiSummary(summary);
        } catch (e) {
          setAiSummary(news.summary);
        } finally {
          setLoadingSummary(false);
        }
      };
      
      fetchSummary();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [news]);

  if (!news) return null;

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Math.random().toString(),
      author: user ? user.username : "Visitante",
      text: commentText,
      timestamp: new Date().toISOString()
    };
    setComments([newComment, ...comments]);
    setCommentText("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className={`relative w-full h-full bg-white overflow-y-auto z-[101] flex flex-col ${
            focusMode ? 'font-serif' : 'font-sans'
          }`}
        >
          {/* Top Bar / Header */}
          <div className="sticky top-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-caramelo-beige/20 flex justify-between items-center">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-caramelo-dark hover:text-caramelo-orange transition-colors font-bold uppercase text-xs tracking-widest"
            >
              <ChevronLeft className="h-5 w-5" />
              Voltar
            </button>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase text-caramelo-orange tracking-[0.2em] hidden sm:block">
                {news.category}
              </span>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Hero Content */}
          <div className="w-full">
            {/* Main Image */}
            <div className="w-full aspect-[21/9] min-h-[300px] md:min-h-[500px] relative overflow-hidden">
              <motion.img 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                src={news.imageUrl} 
                alt={news.title} 
                className="absolute inset-0 w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
            </div>

            {/* Article Header */}
            <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
              <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-caramelo-beige/10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-caramelo-orange rounded-full text-[9px] font-black uppercase text-white tracking-widest">
                    {news.category}
                  </span>
                  <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest gap-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(news.timestamp).toLocaleDateString("pt-BR", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-caramelo-dark leading-[1.05] tracking-tight mb-8">
                  {news.title}
                </h1>

                {/* AI Summary Box */}
                <div className="bg-caramelo-beige/20 rounded-3xl p-6 mb-10 border border-caramelo-orange/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles className="h-12 w-12 text-caramelo-orange" />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-caramelo-orange text-white rounded-lg">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-caramelo-orange tracking-[0.2em]">Resumo por Inteligência Artificial</span>
                  </div>
                  {loadingSummary ? (
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 border-2 border-caramelo-orange border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-slate-400 font-medium">Processando síntese...</span>
                    </div>
                  ) : (
                    <p className="text-lg md:text-xl font-medium text-caramelo-dark/80 italic leading-relaxed">
                      "{aiSummary || news.summary}"
                    </p>
                  )}
                </div>

                {/* Article Content */}
                <div className="prose max-w-none text-slate-700 leading-[1.8] space-y-8 mb-16 text-lg md:text-xl">
                  {(news.fullContent || "").split('\n').filter(p => p.trim()).map((paragraph, idx) => (
                    <p key={idx} className={idx === 0 ? "first-letter:text-6xl first-letter:font-black first-letter:text-caramelo-orange first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-2" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Engagement */}
                <div className="border-t border-caramelo-beige/30 pt-12">
                  <div className="flex flex-wrap items-center gap-8 mb-12">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-caramelo-orange" />
                      <span className="text-sm font-bold">{comments.length} Reações</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-slate-400" />
                      <span className="text-sm font-bold text-slate-400">Compartilhar</span>
                    </div>
                    <div className="ml-auto hidden sm:flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Impacto</span>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${news.popularity}%` }}
                          className="h-full bg-caramelo-orange"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <section className="max-w-2xl">
                    <h3 className="text-2xl font-display font-bold mb-8">Discussão na Redação</h3>
                    
                    <div className="flex gap-4 mb-10">
                      <div className="w-12 h-12 rounded-2xl bg-caramelo-orange flex items-center justify-center text-white font-bold shrink-0 text-lg shadow-lg">
                        {user ? user.username[0].toUpperCase() : "V"}
                      </div>
                      <div className="flex-grow">
                        <textarea
                          placeholder="Adicione sua perspectiva..."
                          className="w-full h-32 p-4 text-base bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-caramelo-orange outline-none resize-none transition-all"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <div className="flex justify-end mt-4">
                          <button 
                            onClick={handleAddComment}
                            className="px-8 py-3 bg-caramelo-dark text-white text-sm font-bold rounded-2xl flex items-center gap-2 hover:bg-caramelo-orange transition-colors shadow-lg"
                          >
                            Enviar Comentário <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {comments.map(c => (
                        <div key={c.id} className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 shrink-0 text-sm">
                            {c.author[0]}
                          </div>
                          <div className="bg-slate-50/50 rounded-2xl p-6 flex-grow border border-caramelo-beige/10">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-bold text-caramelo-dark">{c.author}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">há 2 min</span>
                            </div>
                            <p className="text-base text-slate-600 leading-relaxed">
                              {c.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
            
            {/* Spacer */}
            <div className="h-32"></div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
