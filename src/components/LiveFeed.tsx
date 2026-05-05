import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { NewsItem } from "../types";
import { Radio } from "lucide-react";

interface LiveFeedProps {
  news: NewsItem[];
}

export default function LiveFeed({ news }: LiveFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= news.length && news.length > 0) {
      setCurrentIndex(0);
    }
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (news.length > 0 ? (prev + 1) % news.length : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, [news, currentIndex]);

  if (!news.length || !news[currentIndex]) return null;

  const currentItem = news[currentIndex];

  return (
    <div className="bg-caramelo-orange/5 dark:bg-slate-900/40 py-3 border-y border-caramelo-orange/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        <div className="flex items-center shrink-0 mr-4">
          <div className="relative mr-2">
            <Radio className="h-4 w-4 text-caramelo-orange" />
            <span className="absolute inset-0 bg-caramelo-orange rounded-full animate-ping opacity-25"></span>
          </div>
          <span className="text-xs font-black uppercase text-caramelo-orange tracking-widest">Ao Vivo</span>
        </div>
        
        <div className="relative h-6 flex-grow overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-4 whitespace-nowrap"
            >
              <span className="text-[10px] font-bold text-slate-400">
                {new Date(currentItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="truncate">{currentItem.title}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden sm:flex ml-4 gap-1">
          {news.map((_, i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${currentIndex === i ? 'bg-caramelo-orange w-4' : 'bg-slate-300 dark:bg-slate-700'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
