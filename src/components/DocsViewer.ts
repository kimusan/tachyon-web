import { icons } from '../assets/icons';
import { GitHubWikiService, ParsedDocResult } from '../services/github-wiki';
import { WIKI_PAGES, PROJECT_CONFIG } from '../config/project-info';

export class DocsViewerComponent {
  private currentSlug: string = 'Home';
  private docData: ParsedDocResult | null = null;
  private isLoading: boolean = false;
  private errorMessage: string | null = null;
  private searchQuery: string = '';

  constructor() {
    //
  }

  public async loadPage(slug: string = 'Home') {
    this.currentSlug = slug || 'Home';
    this.isLoading = true;
    this.errorMessage = null;
    this.updateContent();

    try {
      const data = await GitHubWikiService.getPage(this.currentSlug);
      this.docData = data;
      this.isLoading = false;
      this.updateContent();
      this.bindDocEvents();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      this.isLoading = false;
      this.errorMessage = err.message || 'Failed to load documentation page.';
      this.updateContent();
    }
  }

  public render(): string {
    return `
      <div id="docs-viewer-container" class="min-h-screen pt-4 pb-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Left Sidebar Navigation (3 cols) -->
            <aside class="lg:col-span-3 sticky top-20 z-20 space-y-6">
              
              <!-- Search Box -->
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  ${icons.search('w-4 h-4')}
                </div>
                <input 
                  type="text" 
                  id="docs-search-input"
                  placeholder="Search documentation..."
                  value="${this.searchQuery}"
                  class="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>

              <!-- Topics Navigation -->
              <div id="docs-sidebar-links" class="space-y-6 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
                ${this.renderSidebarCategories()}
              </div>

            </aside>

            <!-- Main Content Area (6-7 cols) -->
            <main class="lg:col-span-6 xl:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[600px]">
              <div id="docs-main-content">
                ${this.renderContentBody()}
              </div>
            </main>

            <!-- Right Sidebar: In-Page Table of Contents (2-3 cols) -->
            <aside class="hidden xl:block xl:col-span-2 sticky top-20 z-10 space-y-4">
              <div id="docs-toc-container" class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
                <div class="font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  ${icons.layers('w-3.5 h-3.5 text-brand-500')}
                  <span>On This Page</span>
                </div>
                <div id="docs-toc-list">
                  ${this.renderToc()}
                </div>
              </div>

              <!-- Quick Links Box -->
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div class="font-semibold text-slate-900 dark:text-white">Community & Help</div>
                <a href="${PROJECT_CONFIG.githubNewIssueUrl}" target="_blank" class="block text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-cyan-400 flex items-center gap-1">
                  ${icons.bug('w-3.5 h-3.5')}
                  <span>Report an Issue</span>
                </a>
                <a href="${PROJECT_CONFIG.githubDiscussionsUrl}" target="_blank" class="block text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-cyan-400 flex items-center gap-1">
                  ${icons.messageSquare('w-3.5 h-3.5')}
                  <span>Ask in Discussions</span>
                </a>
              </div>
            </aside>

          </div>

        </div>
      </div>
    `;
  }

  private renderSidebarCategories(): string {
    const categories = GitHubWikiService.getCategories();
    const query = this.searchQuery.toLowerCase().trim();

    return categories.map(cat => {
      const filteredPages = query 
        ? cat.pages.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.slug.toLowerCase().includes(query))
        : cat.pages;

      if (filteredPages.length === 0) return '';

      return `
        <div class="space-y-1.5">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
            ${cat.category}
          </h4>
          <div class="space-y-0.5">
            ${filteredPages.map(page => {
              const isActive = this.currentSlug.toLowerCase() === page.slug.toLowerCase();
              return `
                <a 
                  href="#/docs/${page.slug}"
                  class="docs-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-cyan-300 font-semibold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }"
                >
                  <span class="truncate">${page.title}</span>
                  ${isActive ? `<span class="w-1.5 h-1.5 rounded-full bg-brand-500 dark:bg-cyan-400"></span>` : ''}
                </a>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  private renderToc(): string {
    if (!this.docData || !this.docData.toc || this.docData.toc.length === 0) {
      return `<p class="text-slate-400 italic">No section headers</p>`;
    }

    return `
      <nav class="space-y-1.5">
        ${this.docData.toc.map(item => `
          <a 
            href="#${item.id}"
            class="block text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-cyan-300 transition-colors truncate ${
              item.level === 3 ? 'pl-2 text-[11px] text-slate-500' : ''
            }"
          >
            ${item.text}
          </a>
        `).join('')}
      </nav>
    `;
  }

  private renderContentBody(): string {
    if (this.isLoading) {
      return `
        <div class="space-y-6 animate-pulse py-8">
          <div class="h-8 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
          <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div class="space-y-3 pt-4">
            <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div>
          </div>
          <div class="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      `;
    }

    if (this.errorMessage) {
      return `
        <div class="py-12 text-center space-y-4">
          <div class="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-500 flex items-center justify-center mx-auto">
            ${icons.alertCircle('w-6 h-6')}
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Unable to load documentation</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">${this.errorMessage}</p>
          <button 
            id="docs-retry-btn"
            class="px-4 py-2 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-colors inline-flex items-center gap-1.5"
          >
            ${icons.refreshCw('w-4 h-4')}
            <span>Retry</span>
          </button>
        </div>
      `;
    }

    if (!this.docData) {
      return `<p class="text-slate-400">Select a topic from the sidebar.</p>`;
    }

    const currentIdx = WIKI_PAGES.findIndex(p => p.slug.toLowerCase() === this.currentSlug.toLowerCase());
    const prevPage = currentIdx > 0 ? WIKI_PAGES[currentIdx - 1] : null;
    const nextPage = currentIdx < WIKI_PAGES.length - 1 ? WIKI_PAGES[currentIdx + 1] : null;

    return `
      <article class="space-y-6">
        
        <!-- Header Metadata & Live GitHub Wiki Badge -->
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Live from GitHub Wiki</span>
            </span>
          </div>

          <div class="flex items-center gap-2">
            <a 
              href="${this.docData.editUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              title="Contribute edits directly on GitHub Wiki"
            >
              ${icons.edit('w-3.5 h-3.5')}
              <span>Edit on GitHub</span>
            </a>
            <a 
              href="${this.docData.sourceUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              ${icons.github('w-3.5 h-3.5')}
              <span>View Source</span>
            </a>
          </div>
        </div>

        <!-- Rendered Markdown Body -->
        <div class="prose-custom">
          ${this.docData.html}
        </div>

        <!-- Pagination (Prev / Next) -->
        <div class="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${prevPage ? `
            <a 
              href="#/docs/${prevPage.slug}"
              class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-cyan-400 group transition-all"
            >
              <div class="text-xs text-slate-400 flex items-center gap-1">
                <span>← Previous</span>
              </div>
              <div class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-300 mt-1">
                ${prevPage.title}
              </div>
            </a>
          ` : `<div></div>`}

          ${nextPage ? `
            <a 
              href="#/docs/${nextPage.slug}"
              class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-cyan-400 group transition-all text-right sm:col-start-2"
            >
              <div class="text-xs text-slate-400 flex items-center justify-end gap-1">
                <span>Next →</span>
              </div>
              <div class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-300 mt-1">
                ${nextPage.title}
              </div>
            </a>
          ` : ''}
        </div>

      </article>
    `;
  }

  private updateContent() {
    const mainEl = document.getElementById('docs-main-content');
    if (mainEl) {
      mainEl.innerHTML = this.renderContentBody();
    }
    const tocEl = document.getElementById('docs-toc-list');
    if (tocEl) {
      tocEl.innerHTML = this.renderToc();
    }
    const sidebarEl = document.getElementById('docs-sidebar-links');
    if (sidebarEl) {
      sidebarEl.innerHTML = this.renderSidebarCategories();
    }
  }

  public bindEvents() {
    const searchInput = document.getElementById('docs-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = (e.target as HTMLInputElement).value;
        const sidebarEl = document.getElementById('docs-sidebar-links');
        if (sidebarEl) {
          sidebarEl.innerHTML = this.renderSidebarCategories();
        }
      });
    }

    this.bindDocEvents();
  }

  private bindDocEvents() {
    const retryBtn = document.getElementById('docs-retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.loadPage(this.currentSlug);
      });
    }
  }
}
