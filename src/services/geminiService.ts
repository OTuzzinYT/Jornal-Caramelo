/// <reference types="vite/client" />
import { GoogleGenAI, Type } from "@google/genai";
import { Category, NewsItem } from "../types";
import { fetchExternalNews } from "./newsApiService";

let aiInstance: GoogleGenAI | null = null;
function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "undefined") {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

const USE_NEWS_API = import.meta.env.VITE_USE_NEWS_API === "true";

// Cache/State Constants
const CACHE_KEY_FEED = 'caramelo_news_feed';
const CACHE_KEY_TIME = 'caramelo_last_fetch';
const QUOTA_BLOCK_KEY = 'caramelo_api_blocked_until';

const MOCK_NEWS_BASE: Partial<NewsItem>[] = [
  { title: "Governo Federal detalha nova fase da Reforma Tributária para o setor de serviços", category: Category.POLITICA, imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f" },
  { title: "Indústria brasileira registra alta de 3.5% puxada pelo setor automotivo", category: Category.BRASIL, imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
  { title: "Startup de Curitiba desenvolve próteses com impressão 3D de baixo custo", category: Category.TECNOLOGIA, imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837" },
  { title: "Brasil garante vaga na final do Mundial de Vôlei Feminino", category: Category.ESPORTES, imageUrl: "https://images.unsplash.com/photo-1592656094267-764a45160876" },
  { title: "Festival de Arte Digital em São Paulo utiliza realidade aumentada", category: Category.ENTRETENIMENTO, imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f" },
  { title: "Novas leis de privacidade digital entram em vigor na União Europeia", category: Category.MUNDO, imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3" },
  { title: "Bolsa de Valores fecha em alta recorde após anúncio de novo pacote econômico", category: Category.POLITICA, imageUrl: "https://images.unsplash.com/photo-1611974714851-eb6051618822" },
  { title: "Cientistas brasileiros descobrem nova espécie de orquídea na Amazônia", category: Category.BRASIL, imageUrl: "https://images.unsplash.com/photo-1546027658-7aa750153465" },
  { title: "Lançamento de satélite brasileiro para monitoramento agrícola é bem-sucedido", category: Category.TECNOLOGIA, imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa" },
  { title: "Surfista brasileiro conquista Tríplice Coroa em ondas gigantes no Havaí", category: Category.ESPORTES, imageUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f" },
  { title: "Produção de música brasileira cresce 20% no mercado de streaming internacional", category: Category.ENTRETENIMENTO, imageUrl: "https://images.unsplash.com/photo-1514525253344-99a42ac93dfd" },
  { title: "Acordo de paz histórico é assinado entre nações vizinhas no Oriente Médio", category: Category.MUNDO, imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620" },
  { title: "Reforma administrativa: Entenda o que muda para os novos servidores", category: Category.POLITICA, imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85" },
  { title: "Turismo sustentável cresce no Nordeste brasileiro após investimentos recordes", category: Category.BRASIL, imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23" },
  { title: "Novos Chips com tecnologia quântica prometem revolucionar computação móvel", category: Category.TECNOLOGIA, imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475" },
  { title: "Grandes finais do campeonato nacional de xadrez atraem jovens talentos", category: Category.ESPORTES, imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b" },
  { title: "Estreia de série nacional em plataforma global bate recorde de audiência", category: Category.ENTRETENIMENTO, imageUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37" },
  { title: "Avanço na fusão nuclear limpa gera otimismo entre líderes climáticos", category: Category.MUNDO, imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa" },
  { title: "Senado aprova redução de impostos para produtos de cesta básica", category: Category.POLITICA, imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f" },
  { title: "Parques nacionais registram maior número de visitantes em uma década", category: Category.BRASIL, imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" },
  { title: "IA generativa começa a ser aplicada no diagnóstico precoce de doenças raras", category: Category.TECNOLOGIA, imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef" },
  { title: "Maratona Internacional de São Paulo paralisa ruas com 30 mil corredores", category: Category.ESPORTES, imageUrl: "https://images.unsplash.com/photo-1452626038306-9aae0e073b4a" },
  { title: "Show de drones em Brasília celebra o encerramento do Festival de Inverno", category: Category.ENTRETENIMENTO, imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e" },
  { title: "Nova missão tripulada à Lua entra em fase final de testes técnicos", category: Category.MUNDO, imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa" },
  { title: "Exportação de café brasileiro atinge volume histórico no porto de Santos", category: Category.BRASIL, imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085" }
];

function isApiBlocked() {
  const blockUntil = localStorage.getItem(QUOTA_BLOCK_KEY);
  if (!blockUntil) return false;
  return Date.now() < parseInt(blockUntil);
}

function blockApi() {
  const blockUntil = Date.now() + 120000; // Bloqueia por 2 min
  localStorage.setItem(QUOTA_BLOCK_KEY, blockUntil.toString());
}

function getBackupNews(): NewsItem[] {
  return MOCK_NEWS_BASE.map((n, i) => ({
    id: `fb-${i}-${Date.now()}`,
    title: n.title!,
    summary: "Informação urgente atualizada por nossa equipe de jornalismo agora.",
    fullContent: "O Jornal Caramelo continua monitorando este fato importante para trazer os detalhes mais precisos em tempo real.",
    category: n.category!,
    imageUrl: `${n.imageUrl}?sig=fb-${i}`,
    popularity: 70 + Math.random() * 30,
    timestamp: new Date().toISOString(),
    isRecent: true,
    isBreaking: i === 0
  })) as NewsItem[];
}

export async function generateNewsFeed(): Promise<NewsItem[]> {
  // Try cache first (valid for 15 mins)
  const cached = localStorage.getItem(CACHE_KEY_FEED);
  const lastFetch = localStorage.getItem(CACHE_KEY_TIME);
  if (cached && lastFetch && (Date.now() - parseInt(lastFetch) < 900000)) {
    return JSON.parse(cached);
  }

  if (USE_NEWS_API) {
    try {
      const external = await fetchExternalNews();
      if (external.length > 0) return external;
    } catch (e) {
      console.warn("External API failed:", e);
    }
  }

  if (isApiBlocked()) return getBackupNews();

  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  try {
    const prompt = `Você é o redator-chefe do Jornal Caramelo. Hoje é ${today}. 
    Gere 25 notícias REAIS e ATUAIS sobre o que está acontecendo AGORA.
    REGRAS CRÍTICAS DE IMAGEM (PARA O CAMPO imageKeywords):
    - NÃO use termos abstratos (ex: NÃO use "Tax", "Economy", "Politics").
    - USE descrições LITERAIS e VISUAIS em inglês (ex: "bundles of money on office desk", "politicians in formal meeting room", "hospital intensive care unit", "soccer ball hitting the net").
    - A imagem deve ser facilmente compreendida por qualquer pessoa ao ver a notícia.
    
    ESTRUTURA:
    - title: título jornalístico profissional (PT-BR).
    - category: (Política, Tecnologia, Mundo, Brasil, Esportes, Entretenimento).
    - summary: resumo de 2 frases.
    - fullContent: matéria detalhada com 8 parágrafos sérios.
    - imageKeywords: uma frase visual descritiva em inglês (3-5 palavras).
    - popularity: (0-100).
    - isRecent: boolean.
    RETORNE APENAS O ARRAY JSON.`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              summary: { type: Type.STRING },
              fullContent: { type: Type.STRING },
              imageKeywords: { type: Type.STRING },
              popularity: { type: Type.NUMBER },
              isRecent: { type: Type.BOOLEAN },
            },
            required: ["title", "category", "summary", "fullContent", "imageKeywords", "popularity", "isRecent"]
          }
        }
      }
    });

    const generated = JSON.parse(response.text || "[]");
    
    const mapped = generated.map((n: any, i: number) => {
      const visualQuery = n.imageKeywords?.toLowerCase() || n.title.toLowerCase();
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...n,
        imageUrl: `https://images.unsplash.com/featured/?${encodeURIComponent(visualQuery.replace(/ /g, ','))}&sig=${i}${Date.now()}`,
        timestamp: new Date(Date.now() - (i < 5 ? 300000 : i * 3600000)).toISOString(),
        isBreaking: i === 0,
        isRecent: n.isRecent || i < 5
      };
    });

    // Cache results
    localStorage.setItem(CACHE_KEY_FEED, JSON.stringify(mapped));
    localStorage.setItem(CACHE_KEY_TIME, Date.now().toString());

    return mapped;
  } catch (error: any) {
    if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED') {
      blockApi();
    }
    return getBackupNews();
  }
}

export async function generateCategoryNews(category: Category): Promise<NewsItem[]> {
  if (USE_NEWS_API) {
    try {
      const external = await fetchExternalNews(category);
      if (external.length > 0) return external;
    } catch (e) {
      console.warn(`External API category ${category} failed, falling back:`, e);
    }
  }

  if (isApiBlocked()) return getBackupNews().filter(n => n.category === category);

  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  try {
    const prompt = `Gere 25 notícias reais e profissionais da categoria ${category} para hoje (${today}).
    REGRAS DE IMAGEM: O campo 'imageKeywords' DEVE ser uma descrição VISUAL LITERAL em inglês que qualquer pessoa entenda ao ver (ex: "stadium crowd cheering", "circuit board close up", "city street buildings"). 
    NÃO USE termos abstratos como "Politics" ou "Economy".
    Para cada notícia:
    - title: título jornalístico sério.
    - summary: resumo.
    - fullContent: matéria detalhada (8-10 parágrafos).
    - imageKeywords: descrição visual específica em inglês (3-5 palavras).
    - popularity: (0-100).
    - isRecent: boolean.
    RETORNE APENAS JSON ARRAY.`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              fullContent: { type: Type.STRING },
              imageKeywords: { type: Type.STRING },
              popularity: { type: Type.NUMBER },
              isRecent: { type: Type.BOOLEAN },
            },
            required: ["title", "summary", "fullContent", "imageKeywords", "popularity", "isRecent"]
          }
        }
      }
    });

    const generated = JSON.parse(response.text || "[]");
    const results = generated.map((n: any, i: number) => {
      const visualQuery = n.imageKeywords?.toLowerCase() || n.title.toLowerCase();
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...n,
        category,
        imageUrl: `https://images.unsplash.com/featured/?${encodeURIComponent(visualQuery.replace(/ /g, ','))}&sig=${i}${Date.now()}`,
        timestamp: new Date().toISOString(),
        isRecent: n.isRecent,
        isBreaking: i === 0,
      };
    });

    return results;
  } catch (error: any) {
    if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED') {
      blockApi();
    }
    return getBackupNews().filter(n => n.category === category);
  }
}

export async function summarizeNews(title: string, content: string): Promise<string> {
  if (isApiBlocked()) return "Resumo disponível em breve.";
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Resuma esta notícia de forma concisa e elegante em uma frase curta: Título: ${title}. Conteúdo: ${content}`,
    });
    return response.text || "Resumo indisponível.";
  } catch (error) {
    return "Resumo gerado por nossa redação.";
  }
}

export async function searchNews(query: string): Promise<NewsItem[]> {
  if (USE_NEWS_API) {
    try {
      return await fetchExternalNews(undefined, query);
    } catch (e) {
      console.warn("External Search failed, falling back:", e);
    }
  }

  if (isApiBlocked()) return getBackupNews().filter(n => n.title.toLowerCase().includes(query.toLowerCase()));

  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  try {
    const prompt = `Você é o redator chefe do Jornal Caramelo. Hoje é ${today}. 
    O usuário pesquisou por: "${query}". 
    Gere 10 notícias REAIS e ATUAIS sobre este tema.
    REGRA DE IMAGEM: 'imageKeywords' DEVE ser visual e em inglês descrevendo a cena (ex: se o tema for economia, use "finance document" ou "bank vault").
    Para cada notícia, forneça: 
    - title: título jornalístico profissional.
    - category: escolha a mais adequada.
    - summary: resumo curto.
    - fullContent: matéria completa (8 parágrafos).
    - imageKeywords: termos visuais específicos em inglês.
    - popularity: (0-100).
    - isRecent: boolean.
    RETORNE APENAS JSON ARRAY.`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              summary: { type: Type.STRING },
              fullContent: { type: Type.STRING },
              imageKeywords: { type: Type.STRING },
              popularity: { type: Type.NUMBER },
              isRecent: { type: Type.BOOLEAN },
            },
            required: ["title", "category", "summary", "fullContent", "imageKeywords", "popularity", "isRecent"]
          }
        }
      }
    });

    const generated = JSON.parse(response.text || "[]");
    
    return generated.map((n: any, i: number) => {
      const visualQuery = n.imageKeywords?.toLowerCase() || n.title.toLowerCase();
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...n,
        imageUrl: `https://images.unsplash.com/featured/?${encodeURIComponent(visualQuery.replace(/ /g, ','))}&sig=${i}${Date.now()}`,
        timestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isRecent: n.isRecent,
        isBreaking: i === 0 && n.popularity > 80,
      };
    });
  } catch (error: any) {
    if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED') {
      blockApi();
    }
    return getBackupNews().filter(n => n.title.toLowerCase().includes(query.toLowerCase()));
  }
}

export async function getTrendingTopics(): Promise<string[]> {
  if (isApiBlocked()) return ["#JornalCaramelo", "#BrasilHoje", "#NoticiasAgora", "#EconomiaBR"];
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Liste 8 tópicos ou hashtags que seriam tendência agora no Brasil considerando eventos atuais. Apenas os nomes em formato JSON array de strings.",
      config: {
        responseMimeType: "application/json",
      }
    });
    const generated = JSON.parse(response.text || "[]");
    return Array.isArray(generated) ? generated.slice(0, 8) : ["#JornalCaramelo", "#BrasilHoje", "#NoticiasAgora"];
  } catch (error: any) {
    if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED') {
      blockApi();
    }
    return ["#Eleições2026", "#BrasilEmFoco", "#TecnologiaVerde", "#CopaDoMundo2026", "#IAnoBrasil", "#EconomiaCriativa", "#Sustentabilidade", "#CulturaSP"];
  }
}
