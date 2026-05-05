/// <reference types="vite/client" />
import { NewsItem, Category } from "../types";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const USE_EXTERNAL = import.meta.env.VITE_USE_NEWS_API === "true";

export async function fetchExternalNews(category?: Category, query?: string): Promise<NewsItem[]> {
  if (!API_KEY || !USE_EXTERNAL) {
    throw new Error("External News API not configured or disabled");
  }

  const baseUrl = "https://eventregistry.org/api/v1/article/getArticles";
  
  // Construct search query
  let searchQuery = query || "";
  if (category && !searchQuery) {
    searchQuery = category;
  }
  if (!searchQuery) searchQuery = "Brasil";

  const params = new URLSearchParams({
    action: "getArticles",
    keyword: searchQuery,
    articlesPage: "1",
    articlesCount: "50",
    articlesSortBy: "date",
    articlesSortByAsc: "false",
    articlesArticleBodyLen: "-1",
    resultType: "articles",
    dataType: "news",
    lang: "por",
    apiKey: API_KEY,
  });

  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`);
    if (!response.ok) throw new Error("API request failed");
    
    const data = await response.json();
    const articles = data.articles?.results || [];

    return articles.map((art: any) => {
      // Clean query for image search
      const imageQuery = art.title
        .replace(/[^\w\sÀ-ú]/gi, '')
        .split(' ')
        .slice(0, 3)
        .join(' ');

      return {
        id: art.uri || Math.random().toString(36).substr(2, 9),
        title: art.title,
        summary: art.body.substring(0, 200) + "...",
        fullContent: art.body,
        category: category || Category.MUNDO,
        imageUrl: art.image || `https://images.unsplash.com/featured/?${encodeURIComponent(imageQuery)}`,
        timestamp: art.dateTime || new Date().toISOString(),
        popularity: 70 + Math.random() * 30,
        isRecent: true,
        isBreaking: false
      };
    });
  } catch (error) {
    console.error("NewsAPI.ai failed:", error);
    throw error;
  }
}
