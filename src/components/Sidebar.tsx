import { motion } from "motion/react";
import { TrendingUp, MessageSquare, Mail, Instagram, Twitter } from "lucide-react";

interface SidebarProps {
  trendingTopics: string[];
}

export default function Sidebar({ trendingTopics }: SidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Trending Topics */}
      <section className="bg-caramelo-beige/20 dark:bg-slate-900 rounded-3xl p-6 border border-caramelo-beige/50 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-caramelo-orange" />
          <h2 className="text-lg font-display font-bold text-caramelo-dark dark:text-slate-100">Tendências</h2>
        </div>
        <div className="space-y-4">
          {trendingTopics.map((topic, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">#{i + 1} Trending</div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-caramelo-orange transition-colors">
                {topic}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-caramelo-dark rounded-3xl p-6 text-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-caramelo-orange/20 rounded-full blur-3xl group-hover:bg-caramelo-orange/30 transition-all"></div>
        <div className="relative z-10">
          <Mail className="h-8 w-8 text-caramelo-orange mb-4" />
          <h3 className="text-xl font-display font-bold mb-2">Fique por dentro</h3>
          <p className="text-sm text-slate-400 mb-6 font-light">
            Receba os resumos da IA diretamente no seu e-mail todas as manhãs.
          </p>
          <div className="space-y-3">
             <input 
              type="email" 
              placeholder="seu@email.com" 
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramelo-orange"
            />
            <button className="w-full py-3 bg-caramelo-orange hover:bg-opacity-90 rounded-xl text-sm font-bold transition-all text-white shadow-lg shadow-caramelo-orange/20">
              Inscrever-se
            </button>
          </div>
        </div>
      </section>

      {/* Socials */}
      <div className="flex justify-center gap-6 py-4">
        <Twitter className="h-6 w-6 text-slate-400 hover:text-caramelo-orange cursor-pointer transition-colors" />
        <Instagram className="h-6 w-6 text-slate-400 hover:text-pink-500 cursor-pointer transition-colors" />
        <MessageSquare className="h-6 w-6 text-slate-400 hover:text-caramelo-orange cursor-pointer transition-colors" />
      </div>
    </aside>
  );
}
