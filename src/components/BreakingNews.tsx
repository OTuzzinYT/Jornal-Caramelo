import { motion } from "motion/react";
import { NewsItem } from "../types";
import { Activity } from "lucide-react";

interface BreakingNewsProps {
  news: NewsItem | null;
  onClick: (news: NewsItem) => void;
}

export default function BreakingNews({ news, onClick }: BreakingNewsProps) {
  if (!news) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
      onClick={() => onClick(news)}
    >
      <img 
        src={news.imageUrl} 
        alt={news.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-caramelo-dark via-caramelo-dark/40 to-transparent group-hover:via-caramelo-dark/50 transition-all"></div>
      
      <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-3/4 text-white">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-2 mb-4"
        >
          <span className="flex items-center px-4 py-1.5 bg-red-600 rounded-full text-xs font-black uppercase tracking-[0.2em] animate-pulse">
            <Activity className="h-3 w-3 mr-2" />
            Breaking News
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-caramelo-orange/80">
            {news.category}
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-[1.05] tracking-tight"
        >
          {news.title}
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-base md:text-lg text-slate-200/90 line-clamp-2 max-w-3xl font-medium leading-[1.6]"
        >
          {news.summary}
        </motion.p>
      </div>

      <div className="absolute top-6 right-8 hidden md:block">
        <div className="flex flex-col items-end">
           <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Impacto IA</span>
           <div className="flex gap-1">
             {[1,2,3,4,5].map(i => (
               <div key={i} className={`w-2 h-6 rounded-sm ${i <= 4 ? 'bg-caramelo-orange' : 'bg-white/20'}`}></div>
             ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
