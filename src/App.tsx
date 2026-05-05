/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Header from "./components/Header";
import BreakingNews from "./components/BreakingNews";
import LiveFeed from "./components/LiveFeed";
import NewsCard from "./components/NewsCard";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import NewsModal from "./components/NewsModal";
import AdminPanel from "./components/AdminPanel";
import AuthModal from "./components/AuthModal";
import AdminAuthModal from "./components/AdminAuthModal";
import { Category, NewsItem, User } from "./types";
import { generateCategoryNews, generateNewsFeed, getTrendingTopics, searchNews } from "./services/geminiService";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RefreshCw, ArrowLeft } from "lucide-react";

export default function App() {
  const [focusMode, setFocusMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Admin Data Tracking
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [newsViews, setNewsViews] = useState<Record<string, number>>({});
  
  // Auth & Admin State
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);

  useEffect(() => {
    // Load local data
    const savedUser = localStorage.getItem("caramelo_user");
    const savedUsers = localStorage.getItem("caramelo_all_users");
    const savedViews = localStorage.getItem("caramelo_news_views");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers));
    }
    if (savedViews) {
      setNewsViews(JSON.parse(savedViews));
    }

    async function init() {
      setLoading(true);
      const [newsData, trendingData] = await Promise.all([
        generateNewsFeed(),
        getTrendingTopics()
      ]);
      setNews(newsData);
      setTrending(trendingData);
      setLoading(false);
    }
    init();

    // Auto-refresh news every 10 minutes (600,000 ms)
    const refreshInterval = setInterval(() => {
      console.log("IA sincronizando novos fatos...");
      handleRefresh();
    }, 600000);

    return () => clearInterval(refreshInterval);
  }, []);

  const handleLogin = (userData: User) => {
    const isNew = !registeredUsers.some(u => u.email === userData.email);
    let updatedUsers = registeredUsers;
    
    // Check if it's the admin email
    if (userData.email === "admin@caramelo.com") {
      userData.isAdmin = true;
    }

    if (isNew) {
      updatedUsers = [...registeredUsers, userData];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem("caramelo_all_users", JSON.stringify(updatedUsers));
    }

    setUser(userData);
    localStorage.setItem("caramelo_user", JSON.stringify(userData));
  };

  const handleAdminTrigger = () => {
    if (user?.isAdmin) {
      setShowAdminPanel(true);
    } else {
      setShowAdminAuth(true);
    }
  };

  const handleAdminSuccess = () => {
    if (user) {
      const updatedUser = { ...user, isAdmin: true };
      setUser(updatedUser);
      localStorage.setItem("caramelo_user", JSON.stringify(updatedUser));
      
      // Also update in all users
      const updatedAll = registeredUsers.map(u => u.email === user.email ? updatedUser : u);
      setRegisteredUsers(updatedAll);
      localStorage.setItem("caramelo_all_users", JSON.stringify(updatedAll));
    }
    setShowAdminPanel(true);
  };

  const incrementView = (newsItem: NewsItem) => {
    const newViews = { ...newsViews, [newsItem.id]: (newsViews[newsItem.id] || 0) + 1 };
    setNewsViews(newViews);
    localStorage.setItem("caramelo_news_views", JSON.stringify(newViews));
    setSelectedNews(newsItem);
  };

  const handleCategoryChange = async (cat: Category | null) => {
    setSelectedCategory(cat);
    setLoading(true);
    setNews([]); // Show loading state
    
    try {
      if (cat) {
        if (isSearching) {
          const results = await searchNews(`${cat}: ${searchQuery}`);
          setNews(results.length > 0 ? results : []); 
        } else {
          const categoryNews = await generateCategoryNews(cat);
          setNews(categoryNews);
        }
      } else {
        if (isSearching) {
          const results = await searchNews(searchQuery);
          setNews(results);
        } else {
          const newsData = await generateNewsFeed();
          setNews(newsData);
        }
      }
    } catch (err) {
      console.error("Navigation error:", err);
      // Final fallback to prevent empty screen
      handleRefresh();
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setLoading(true);
    setIsSearching(false);
    setSearchQuery("");
    const [newsData, trendingData] = await Promise.all([
      generateNewsFeed(),
      getTrendingTopics()
    ]);
    
    setNews(prev => {
      const existingIds = new Set(prev.map(n => n.id));
      const uniqueNewNews = newsData.filter(n => !existingIds.has(n.id));
      return [...uniqueNewNews, ...prev].slice(0, 100);
    });
    setTrending(trendingData);
    setLoading(false);
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    setIsSearching(true);
    setSearchQuery(query);
    const searchResults = await searchNews(query);
    setNews(searchResults);
    setLoading(false);
  };

  const handleUpdateNews = (updated: NewsItem) => {
    setNews(prev => prev.map(n => n.id === updated.id ? updated : n));
    // Persist edited news if needed, but for now we're just updating the UI
    // If it's a real backend, we'd call an API here.
  };

  const handleBack = () => {
    setIsSearching(false);
    setSearchQuery("");
    handleRefresh();
  };

  const filteredNews = selectedCategory 
    ? news.filter(n => n.category === selectedCategory)
    : news;

  const breakingNews = !isSearching ? (news.find(n => n.isBreaking) || news[0]) : null;
  const regularNews = breakingNews ? filteredNews.filter(n => n.id !== breakingNews.id) : filteredNews;

  return (
    <div className={focusMode ? "focus-mode" : ""}>
      <div className={`min-h-screen transition-colors duration-700 ${focusMode ? 'bg-[#fdfbf6]' : 'bg-slate-50'}`}>
        <Header 
          focusMode={focusMode} 
          setFocusMode={setFocusMode} 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          user={user}
          onAuthClick={() => setShowAuthModal(true)}
          onAdminTrigger={handleAdminTrigger}
          onSearch={handleSearch}
        />

        <main className={`transition-all duration-700 mx-auto px-4 sm:px-6 lg:px-8 py-8 ${focusMode ? 'max-w-3xl' : 'max-w-7xl'}`}>
          
          {focusMode && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-3 bg-caramelo-beige/20 border border-caramelo-orange/10 rounded-2xl flex items-center justify-center gap-2"
            >
              <div className="w-2 h-2 bg-caramelo-orange rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-caramelo-orange">Modo Foco Ativado</span>
            </motion.div>
          )}

          {/* Breaking News Area */}
          {!selectedCategory && !isSearching && !focusMode && (
            <section className="mb-12">
               <BreakingNews news={breakingNews!} onClick={setSelectedNews} />
            </section>
          )}

          {/* Live Feed / Ticker */}
          {!isSearching && !focusMode && (
            <section className="mb-12 rounded-2xl overflow-hidden shadow-sm">
               <LiveFeed news={news.slice(0, 5)} />
            </section>
          )}

          {/* Main Content Layout */}
          <div className={focusMode ? 'flex flex-col gap-12' : 'grid grid-cols-1 lg:grid-cols-12 gap-12'}>
            
            {/* News Grid Area */}
            <div className={focusMode ? 'w-full' : 'lg:col-span-8'}>
              <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col gap-6 mb-10">
                    <header className="flex items-center gap-4">
                      {isSearching && (
                        <button 
                          onClick={handleBack}
                          className="p-2 hover:bg-caramelo-beige/30 rounded-full transition-colors text-caramelo-orange"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </button>
                      )}
                      <h2 className={`font-display font-bold text-caramelo-dark transition-all duration-500 ${focusMode ? 'text-4xl text-center w-full' : 'text-2xl'}`}>
                        {isSearching ? `Resultados: "${searchQuery}"` : (selectedCategory ? `Destaques em ${selectedCategory}` : "Últimas Notícias")}
                      </h2>
                      {!focusMode && <div className="h-1 flex-grow bg-caramelo-beige rounded-full min-w-[50px]"></div>}
                    </header>

                    {isSearching && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 self-center">Filtrar por:</span>
                        {Object.values(Category).map(cat => (
                          <button
                            key={cat}
                            onClick={() => handleCategoryChange(selectedCategory === cat ? null : cat)}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                              selectedCategory === cat 
                                ? "bg-caramelo-orange text-white border-caramelo-orange shadow-lg" 
                                : "bg-white text-slate-500 border-caramelo-beige hover:border-caramelo-orange"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                
                {!focusMode && (
                  <button 
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-caramelo-beige rounded-full text-xs font-bold text-caramelo-orange hover:bg-caramelo-beige/20 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} title="Atualizar Feed" />
                    <span className="hidden sm:inline">{loading ? 'Sincronizando IA...' : 'Sincronizar IA'}</span>
                  </button>
                )}
              </div>

              {loading && news.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                   <div className="relative mb-6">
                      <Sparkles className="h-12 w-12 text-caramelo-orange animate-bounce" />
                      <div className="absolute inset-0 bg-caramelo-orange rounded-full blur-2xl opacity-20"></div>
                   </div>
                   <p className="text-sm font-bold uppercase tracking-widest text-caramelo-orange animate-pulse">A IA está gerando sua redação...</p>
                </div>
              ) : (
                <>
                  {news.length === 0 && !loading && isSearching && (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
                      <p className="text-slate-500 font-medium">Nenhum resultado encontrado para essa busca.</p>
                      <button onClick={handleBack} className="mt-4 text-caramelo-orange font-bold text-sm underline">Voltar para notícias principais</button>
                    </div>
                  )}
                  <div className={`grid gap-8 ${focusMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    <AnimatePresence>
                      {regularNews.map((n, i) => (
                        <motion.div
                          key={n.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <NewsCard news={n} onClick={incrementView} focusMode={focusMode} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </>
              )}

              {!loading && regularNews.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-slate-500">Nenhuma notícia encontrada nesta categoria.</p>
                </div>
              )}
            </div>

            {/* Sidebar Area */}
            {!focusMode && (
              <div className="lg:col-span-4">
                <Sidebar trendingTopics={trending} />
              </div>
            )}

          </div>
        </main>

        {!focusMode && <Footer />}

        <NewsModal 
          news={selectedNews} 
          onClose={() => setSelectedNews(null)} 
          user={user}
          focusMode={focusMode}
        />
        
        <AnimatePresence>
          {showAuthModal && (
            <AuthModal 
              onClose={() => setShowAuthModal(false)} 
              onLogin={handleLogin} 
            />
          )}
          {showAdminAuth && (
            <AdminAuthModal 
              onClose={() => setShowAdminAuth(false)} 
              onSuccess={handleAdminSuccess} 
            />
          )}
          {showAdminPanel && (
            <AdminPanel 
              onClose={() => setShowAdminPanel(false)} 
              users={registeredUsers}
              news={news}
              views={newsViews}
              onUpdateNews={handleUpdateNews}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


