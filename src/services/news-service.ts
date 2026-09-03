import { marked } from 'marked';
import DOMPurify from 'dompurify';

export interface NewsPost {
  slug: string;
  title: string;
  date: string;
  formattedDate: string;
  author: string;
  authorUrl?: string;
  authorAvatar?: string;
  tags: string[];
  summary: string;
  coverImage?: string;
  featured: boolean;
  rawContent: string;
  htmlContent: string;
  readingTime: string;
}

export class NewsService {
  private static cachedPosts: NewsPost[] | null = null;

  private static parseFrontmatter(fileContent: string): { meta: Record<string, any>; content: string } {
    const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) return { meta: {}, content: fileContent };

    const rawMeta = match[1];
    const content = match[2];
    const meta: Record<string, any> = {};

    const lines = rawMeta.split(/\r?\n/);
    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;

      const key = line.slice(0, colonIdx).trim();
      let val: any = line.slice(colonIdx + 1).trim();

      // String cleanup
      if (typeof val === 'string' && ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))) {
        val = val.slice(1, -1);
      }
      // Boolean
      else if (typeof val === 'string' && val.toLowerCase() === 'true') {
        val = true;
      } else if (typeof val === 'string' && val.toLowerCase() === 'false') {
        val = false;
      }
      // Array
      else if (typeof val === 'string' && val.startsWith('[') && val.endsWith(']')) {
        try {
          val = JSON.parse(val);
        } catch {
          val = val.slice(1, -1).split(',').map((s: string) => s.trim().replace(/^['"]|['"]$/g, ''));
        }
      }

      meta[key] = val;
    }

    return { meta, content };
  }

  private static calculateReadingTime(text: string): string {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  }

  private static formatDate(dateStr: string): string {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  public static async initializePosts(): Promise<NewsPost[]> {
    if (this.cachedPosts) return this.cachedPosts;

    const rawFiles = (import.meta as any).glob('/content/news/*.md', { query: '?raw', eager: true });
    const posts: NewsPost[] = [];

    // Custom renderer for marked
    const renderer = new marked.Renderer();
    renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
      const plainText = text.replace(/<[^>]*>/g, '').trim();
      const id = plainText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return `<h${depth} id="${id}">${text}</h${depth}>`;
    };

    for (const path in rawFiles) {
      const rawModule: any = rawFiles[path];
      const rawContent: string = typeof rawModule === 'string' ? rawModule : (rawModule.default || '');
      
      const fileName = path.split('/').pop()?.replace(/\.md$/, '') || '';
      const { meta, content } = this.parseFrontmatter(rawContent);

      const parsedHtml = await marked.parse(content, { renderer });
      const sanitizedHtml = DOMPurify.sanitize(parsedHtml, {
        ADD_ATTR: ['target', 'rel', 'id']
      });

      const dateStr = meta.date || '2026-08-25';

      posts.push({
        slug: fileName,
        title: meta.title || fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' '),
        date: dateStr,
        formattedDate: this.formatDate(dateStr),
        author: meta.author || 'Kim Schulz',
        authorUrl: meta.authorUrl || 'https://schulz.dk',
        authorAvatar: meta.authorAvatar || '/images/kim-schulz.webp',
        tags: Array.isArray(meta.tags) ? meta.tags : ['Update'],
        summary: meta.summary || '',
        coverImage: meta.coverImage || '',
        featured: Boolean(meta.featured),
        rawContent: content,
        htmlContent: sanitizedHtml,
        readingTime: this.calculateReadingTime(content)
      });
    }

    // Sort by publication date descending
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    this.cachedPosts = posts;
    return posts;
  }

  public static async getAllPosts(): Promise<NewsPost[]> {
    return this.initializePosts();
  }

  public static async getPostBySlug(slug: string): Promise<NewsPost | null> {
    const posts = await this.getAllPosts();
    const cleanSlug = slug.toLowerCase().trim();
    return posts.find(p => p.slug.toLowerCase() === cleanSlug || p.slug.toLowerCase().endsWith(cleanSlug)) || null;
  }

  public static async getFeaturedPost(): Promise<NewsPost | null> {
    const posts = await this.getAllPosts();
    if (posts.length === 0) return null;
    return posts.find(p => p.featured) || posts[0];
  }

  public static async getLatestPosts(limit = 3): Promise<NewsPost[]> {
    const posts = await this.getAllPosts();
    return posts.slice(0, limit);
  }

  public static async getAllTags(): Promise<string[]> {
    const posts = await this.getAllPosts();
    const tagSet = new Set<string>();
    posts.forEach(p => p.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }

  public static async getAdjacentPosts(slug: string): Promise<{ prev: NewsPost | null; next: NewsPost | null }> {
    const posts = await this.getAllPosts();
    const idx = posts.findIndex(p => p.slug.toLowerCase() === slug.toLowerCase() || p.slug.toLowerCase().endsWith(slug.toLowerCase()));
    
    if (idx === -1) return { prev: null, next: null };

    // Newer post (next) is at idx - 1, older post (prev) is at idx + 1
    return {
      next: idx > 0 ? posts[idx - 1] : null,
      prev: idx < posts.length - 1 ? posts[idx + 1] : null
    };
  }
}
