import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { PROJECT_CONFIG, WIKI_PAGES, WikiPageMeta } from '../config/project-info';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface ParsedDocResult {
  title: string;
  slug: string;
  html: string;
  toc: TocItem[];
  editUrl: string;
  sourceUrl: string;
}

const WIKI_CACHE_PREFIX = 'tachyon_wiki_';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export class GitHubWikiService {
  private static cleanHeadingText(raw: string): string {
    return raw.replace(/<[^>]*>?/gm, '').trim();
  }

  private static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  public static async fetchPageMarkdown(slug: string): Promise<string> {
    const cacheKey = `${WIKI_CACHE_PREFIX}${slug}`;
    
    // 1. Try local cache
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          return parsed.content;
        }
      }
    } catch {
      // Ignore cache error
    }

    // 2. Fetch live from GitHub raw wiki
    try {
      const liveUrl = `${PROJECT_CONFIG.githubWikiBaseUrl}/${slug}.md`;
      const response = await fetch(liveUrl);
      if (response.ok) {
        const text = await response.text();
        // Save to cache
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            content: text
          }));
        } catch {
          // Ignore
        }
        return text;
      }
    } catch (e) {
      console.warn(`Failed to fetch live wiki for ${slug}, trying local fallback`, e);
    }

    // 3. Fallback to local static copy
    try {
      const fallbackUrl = `/docs-fallback/${slug}.md`;
      const response = await fetch(fallbackUrl);
      if (response.ok) {
        return await response.text();
      }
    } catch (e) {
      console.warn(`Failed to fetch local fallback for ${slug}`, e);
    }

    throw new Error(`Documentation page "${slug}" could not be loaded.`);
  }

  public static async getPage(slug: string): Promise<ParsedDocResult> {
    const rawMarkdown = await this.fetchPageMarkdown(slug);
    const meta = WIKI_PAGES.find(p => p.slug.toLowerCase() === slug.toLowerCase()) || {
      slug,
      title: slug.replace(/-/g, ' '),
      category: 'Getting Started',
      description: ''
    };

    const toc: TocItem[] = [];

    // Custom renderer for marked
    const renderer = new marked.Renderer();

    renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
      const plainText = this.cleanHeadingText(text);
      const id = this.slugify(plainText);

      if (depth >= 2 && depth <= 3) {
        toc.push({
          id,
          text: plainText,
          level: depth
        });
      }

      return `<h${depth} id="${id}">${text}</h${depth}>`;
    };

    // Transform internal wiki links:
    // e.g. https://github.com/kimusan/Tachyon/wiki/Installation-instructions -> #/docs/Installation-instructions
    renderer.link = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
      let targetHref = href;
      let isExternal = true;

      const wikiMatch = href.match(/^https:\/\/github\.com\/kimusan\/Tachyon\/wiki\/([^#?]+)/i);
      if (wikiMatch) {
        targetHref = `#/docs/${wikiMatch[1]}`;
        isExternal = false;
      } else if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('#') && !href.startsWith('mailto:')) {
        // Relative wiki link
        const cleanSlug = href.replace(/\.md$/i, '');
        targetHref = `#/docs/${cleanSlug}`;
        isExternal = false;
      }

      const titleAttr = title ? ` title="${title}"` : '';
      const externalAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${targetHref}"${titleAttr}${externalAttrs}>${text}</a>`;
    };

    const parsedHtml = await marked.parse(rawMarkdown, { renderer });
    const sanitizedHtml = DOMPurify.sanitize(parsedHtml, {
      ADD_ATTR: ['target', 'rel', 'id']
    });

    return {
      title: meta.title,
      slug: meta.slug,
      html: sanitizedHtml,
      toc,
      editUrl: `${PROJECT_CONFIG.githubWikiWebUrl}/${slug}/_edit`,
      sourceUrl: `${PROJECT_CONFIG.githubWikiWebUrl}/${slug}`
    };
  }

  public static getCategories(): { category: WikiPageMeta['category']; pages: WikiPageMeta[] }[] {
    const categories: WikiPageMeta['category'][] = [
      'Getting Started',
      'Administration',
      'Security & Protocols',
      'Developer & Advanced'
    ];

    return categories.map(cat => ({
      category: cat,
      pages: WIKI_PAGES.filter(p => p.category === cat)
    }));
  }
}
