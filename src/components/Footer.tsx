import { Category } from "../types";

export default function Footer() {
  return (
    <footer className="bg-caramelo-dark pt-20 pb-10 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <span className="font-display text-2xl font-bold text-caramelo-orange tracking-tight mb-6 block">
              Jornal<span className="text-white">Caramelo</span>
            </span>
            <p className="text-sm text-slate-400 leading-loose mb-8">
              Redefinindo o jornalismo moderno com o poder da Inteligência Artificial. Elegância, rapidez e precisão para o seu dia a dia.
            </p>
          </div>

          <div>
             <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-8">Categorias</h4>
             <ul className="space-y-4">
               {Object.values(Category).map((cat) => (
                 <li key={cat}>
                   <a href="#" className="text-sm text-slate-400 hover:text-caramelo-orange transition-colors">{cat}</a>
                 </li>
               ))}
             </ul>
          </div>

          <div>
             <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-8">Institucional</h4>
             <ul className="space-y-4 text-sm text-slate-400">
               <li><a href="#" className="hover:text-caramelo-orange transition-colors">Sobre Nós</a></li>
               <li><a href="#" className="hover:text-caramelo-orange transition-colors">Expediente</a></li>
               <li><a href="#" className="hover:text-caramelo-orange transition-colors">Privacidade</a></li>
               <li><a href="#" className="hover:text-caramelo-orange transition-colors">Termos de Uso</a></li>
             </ul>
          </div>

          <div>
             <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-8">Contato</h4>
             <ul className="space-y-4 text-sm text-slate-400">
               <li>otuzzinyt@gmail.com</li>
               <li>+55 (11) 9999-9999</li>
               <li>Av. Paulista, 1000 - São Paulo, SP</li>
             </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
            © 2026 Jornal Caramelo. Desenvolvido com IA em São Paulo.
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest hover:text-white cursor-pointer transition-colors">Anuncie Conosco</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest hover:text-white cursor-pointer transition-colors">Trabalhe Conosco</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
