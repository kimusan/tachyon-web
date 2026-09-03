import { icons } from '../assets/icons';
import { NewsService, NewsPost } from '../services/news-service';
import { GiscusWidget } from './GiscusWidget';

export class NewsArticleComponent {
  private post: NewsPost | null = null;
  private prevPost: NewsPost | null = null;
  private nextPost: NewsPost | null = null;
  private isLoading: boolean = true;
  private giscusWidget: GiscusWidget | null = null;

  public async loadArticle(slug: string) {
    if (this.giscusWidget) {
      this.giscusWidget.destroy();
      this.giscusWidget = null;
    }

    this.isLoading = true;

    this.post = await NewsService.getPostBySlug(slug);
    if (this.post) {
      const adjacent = await NewsService.getAdjacentPosts(slug);
      this.prevPost = adjacent.prev;
      this.nextPost = adjacent.next;

      this.giscusWidget = new GiscusWidget({
        containerId: 'news-giscus-container',
        mapping: 'specific',
        term: `News: ${this.post.title}`,
        category: 'General',
        inputPosition: 'top'
      });
    }

    this.isLoading = false;
    this.updateView();
  }

  public render(): string {
    if (this.isLoading) {
      return `
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
          <div class="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
          <div class="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl w-3/4"></div>
          <div class="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div class="space-y-4 pt-8">
            <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
          </div>
        </div>
      `;
    }

    if (!this.post) {
      return `
        <div class="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
          <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            ${icons.alertCircle('w-8 h-8')}
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Article Not Found</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400">The requested news article does not exist or may have been moved.</p>
          <a 
            href="#/news" 
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-colors shadow-sm"
          >
            <span>← Back to All News</span>
          </a>
        </div>
      `;
    }

    return `
      <div id="news-article-container" class="min-h-screen py-10 bg-slate-50/40 dark:bg-slate-950/40">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <!-- Top Breadcrumb & Back Link -->
          <div class="flex items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <a 
              href="#/news" 
              class="inline-flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-cyan-300 transition-colors"
            >
              <span>← All News & Announcements</span>
            </a>

            <div class="flex items-center gap-2">
              <button 
                id="news-copy-link-btn"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
              >
                <span id="news-copy-icon">${icons.share('w-3.5 h-3.5')}</span>
                <span id="news-copied-icon" class="hidden text-emerald-500">${icons.check('w-3.5 h-3.5')}</span>
                <span id="news-copy-text">Share</span>
              </button>
            </div>
          </div>

          <!-- Main Article Container -->
          <article class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 lg:p-12 space-y-8">
            
            <!-- Article Header -->
            <header class="space-y-6 pb-8 border-b border-slate-200 dark:border-slate-800">
              
              <!-- Tag Pills & Reading Time -->
              <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div class="flex flex-wrap gap-2">
                  ${this.post.tags.map(t => `
                    <span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-cyan-300 border border-brand-200/60 dark:border-brand-800/60">
                      ${t}
                    </span>
                  `).join('')}
                </div>

                <span class="text-slate-400 font-mono text-xs">${this.post.readingTime}</span>
              </div>

              <!-- Title -->
              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                ${this.post.title}
              </h1>

              <!-- Author / Meta Bar -->
              <div class="flex items-center justify-between gap-4 pt-2">
                <div class="flex items-center gap-3">
                  <a href="${this.post.authorUrl || 'https://schulz.dk'}" target="_blank" rel="noopener noreferrer">
                    <img 
                      src="${this.post.authorAvatar || '/images/kim-schulz.webp'}" 
                      alt="${this.post.author}" 
                      class="w-10 h-10 rounded-full object-cover border-2 border-brand-500/30 hover:opacity-90 transition-opacity"
                    />
                  </a>
                  <div class="text-xs">
                    <a 
                      href="${this.post.authorUrl || 'https://schulz.dk'}" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      class="font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-cyan-300"
                    >
                      ${this.post.author}
                    </a>
                    <div class="text-slate-400 font-mono text-[11px]">${this.post.formattedDate}</div>
                  </div>
                </div>

                <div class="text-xs font-mono text-slate-400 hidden sm:block">
                  tachyonmail.app
                </div>
              </div>

            </header>

            <!-- Markdown Body -->
            <div class="prose-custom max-w-none">
              ${this.post.htmlContent}
            </div>

            <!-- Author Bio Card -->
            <div class="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800">
              <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <img 
                  src="${this.post.authorAvatar || '/images/kim-schulz.webp'}" 
                  alt="${this.post.author}" 
                  class="w-16 h-16 rounded-full object-cover border-2 border-brand-500/40 shadow-sm flex-shrink-0"
                />
                <div class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Written by ${this.post.author}</span>
                    <span class="text-[11px] px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-cyan-300 font-normal">Maintainer</span>
                  </div>
                  <p class="leading-relaxed">
                    Danish open source engineer, author, and creator of Tachyon Webmail. Dedicated to building private, zero-database email tools.
                  </p>
                  <div class="flex items-center gap-3 pt-1">
                    <a href="https://schulz.dk" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1">
                      <span>schulz.dk</span>
                      ${icons.externalLink('w-3 h-3')}
                    </a>
                    <a href="https://github.com/kimusan" target="_blank" rel="noopener noreferrer" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
                      ${icons.github('w-3.5 h-3.5')}
                      <span>kimusan</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Prev / Next Pagination -->
            <div class="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${this.prevPost ? `
                <a 
                  href="#/news/${this.prevPost.slug}" 
                  class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-cyan-400 group transition-all"
                >
                  <div class="text-[11px] text-slate-400 flex items-center gap-1">
                    <span>← Older Article</span>
                  </div>
                  <div class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-300 mt-1 line-clamp-2">
                    ${this.prevPost.title}
                  </div>
                </a>
              ` : `<div></div>`}

              ${this.nextPost ? `
                <a 
                  href="#/news/${this.nextPost.slug}" 
                  class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-cyan-400 group transition-all text-left sm:text-right sm:col-start-2"
                >
                  <div class="text-[11px] text-slate-400 flex items-center sm:justify-end gap-1">
                    <span>Newer Article →</span>
                  </div>
                  <div class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-300 mt-1 line-clamp-2">
                    ${this.nextPost.title}
                  </div>
                </a>
              ` : ''}
            </div>

          </article>

          <!-- Giscus Discussion Comments Section -->
          ${this.giscusWidget ? `
            <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-4">
              <div class="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div class="flex items-center gap-2">
                  ${icons.messageSquare('w-5 h-5 text-brand-500')}
                  <h3 class="font-bold text-base text-slate-900 dark:text-white">Article Discussion</h3>
                </div>
                <span class="text-xs text-slate-400">Powered by GitHub Discussions</span>
              </div>
              <div class="pt-2">
                ${this.giscusWidget.render()}
              </div>
            </div>
          ` : ''}

        </div>
      </div>
    `;
  }

  public bindEvents() {
    const copyBtn = document.getElementById('news-copy-link-btn');
    const copyIcon = document.getElementById('news-copy-icon');
    const copiedIcon = document.getElementById('news-copied-icon');
    const copyText = document.getElementById('news-copy-text');

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          if (copyIcon && copiedIcon && copyText) {
            copyIcon.classList.add('hidden');
            copiedIcon.classList.remove('hidden');
            copyText.textContent = 'Link Copied!';
            setTimeout(() => {
              copyIcon.classList.remove('hidden');
              copiedIcon.classList.add('hidden');
              copyText.textContent = 'Share';
            }, 2000);
          }
        } catch {
          // ignore
        }
      });
    }

    if (this.giscusWidget) {
      this.giscusWidget.mount();
    }
  }

  private updateView() {
    const container = document.getElementById('main-view-container');
    if (container && window.location.hash.startsWith('#/news/')) {
      container.innerHTML = this.render();
      this.bindEvents();
    }
  }

  public destroy() {
    if (this.giscusWidget) {
      this.giscusWidget.destroy();
      this.giscusWidget = null;
    }
  }
}
