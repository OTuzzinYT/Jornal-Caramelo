import { motion } from "motion/react";
import { NewsItem } from "../types";
import { Clock, TrendingUp } from "lucide-react";

interface NewsCardProps {
  news: NewsItem;
  onClick: (news: NewsItem) => void;
  focusMode?: boolean;
}

export default function NewsCard({ news, onClick, focusMode }: NewsCardProps) {
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " anos atrás";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses atrás";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dias atrás";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas atrás";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " min atrás";
    return "agora";
  };

  if (focusMode) {
    return (
      <motion.div
        whileHover={{ x: 10 }}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="group cursor-pointer py-12 border-b border-caramelo-orange/10 flex flex-col md:flex-row gap-10 items-center md:items-start transition-all"
        onClick={() => onClick(news)}
      >
        <div className="w-full md:w-1/3 aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl shrink-0">
          <img 
            src={news.imageUrl} 
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-grow">
          <span className="text-[11px] font-black uppercase text-caramelo-orange tracking-[0.3em] mb-3 block">
            {news.category}
          </span>
          <h3 className="text-3xl font-display font-bold mb-4 leading-[1.1] text-caramelo-dark group-hover:text-caramelo-orange transition-colors duration-300 tracking-tight">
            {news.title}
          </h3>
          <p className="text-lg text-slate-600 line-clamp-3 leading-relaxed font-serif antialiased opacity-90">
            {news.summary}
          </p>
          <div className="flex items-center gap-4 mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            <Clock className="h-3.5 w-3.5 text-caramelo-orange" />
            <span>{timeAgo(news.timestamp)}</span>
            <span className="w-12 h-[1px] bg-caramelo-beige/40"></span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer bg-white rounded-[32px] overflow-hidden border border-caramelo-beige shadow-sm hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
      onClick={() => onClick(news)}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
        <img 
          src={news.imageUrl} 
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://loremflickr.com/800/600/news?sig=${news.id}`;
          }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-caramelo-dark/40 via-transparent to-transparent"></div>
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-4 py-1.5 bg-caramelo-orange text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg self-start">
            {news.category}
          </span>
          {(news.isRecent || news.isBreaking) && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-3 py-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-tighter rounded-md shadow-md self-start flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              {news.isBreaking ? "URGENTE" : "RECENTE"}
            </motion.span>
          )}
        </div>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <div className="flex items-center text-[10px] text-slate-400 dark:text-slate-500 mb-5 uppercase font-bold tracking-[0.2em] gap-2.5">
          <Clock className="h-3.5 w-3.5 text-caramelo-orange/60" />
          <span>{timeAgo(news.timestamp)}</span>
        </div>
        
        <h3 className="text-xl font-display font-bold mb-4 leading-[1.3] text-caramelo-dark dark:text-slate-100 group-hover:text-caramelo-orange transition-colors duration-300">
          {news.title}
        </h3>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-8 font-medium">
          {news.summary}
        </p>

        <div className="flex items-center justify-between mt-auto pt-5 border-t border-caramelo-beige/30 dark:border-slate-800">
           <div className="flex items-center gap-2.5 group/link">
             <div className="w-6 h-[2px] bg-caramelo-orange/30 rounded-full group-hover:w-10 group-hover:bg-caramelo-orange transition-all"></div>
             <span className="text-[10px] font-black text-caramelo-orange uppercase tracking-[0.1em]">Explorar Fatos</span>
           </div>
           {news.popularity > 80 && (
             <TrendingUp className="h-4 w-4 text-caramelo-orange/50 group-hover:text-caramelo-orange transition-colors" />
           )}
        </div>
      </div>
    </motion.div>
  );
}
