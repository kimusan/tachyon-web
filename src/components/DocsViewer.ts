import { icons } from '../assets/icons';
import { GitHubWikiService, ParsedDocResult } from '../services/github-wiki';
import { WIKI_PAGES, PROJECT_CONFIG } from '../config/project-info';
import { GiscusWidget } from './GiscusWidget';
import { TranslationsViewComponent } from './TranslationsView';

export class DocsViewerComponent {
  private currentSlug: string = 'Home';
  private docData: ParsedDocResult | null = null;
  private isLoading: boolean = false;
  private errorMessage: string | null = null;
  private searchQuery: string = '';
  private docGiscus: GiscusWidget | null = null;
  private translationsView: TranslationsViewComponent = new TranslationsViewComponent();

  constructor() {
    //
  }

  public async loadPage(slug: string = 'Home') {
    if (this.docGiscus) {
      this.docGiscus.destroy();
      this.docGiscus = null;
    }

    this.currentSlug = slug || 'Home';
    this.closeMobileMenus();

    // Check if loading the specialized Translations dashboard
    if (this.currentSlug.toLowerCase() === 'translations') {
      this.isLoading = false;
      this.errorMessage = null;
      this.docData = null;
      this.updateContent();
      await this.translationsView.loadData();
      this.bindDocEvents();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

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
    const meta = WIKI_PAGES.find(p => p.slug.toLowerCase() === this.currentSlug.toLowerCase()) || {
      slug: this.currentSlug,
      title: this.currentSlug.replace(/-/g, ' '),
      category: 'Getting Started',
      description: ''
    };

    return `
      <div id="docs-viewer-container" class="min-h-screen pb-20">
        
        <!-- Mobile Sticky Sub-Header / Action Bar (< lg screens) -->
        <div class="lg:hidden sticky top-16 z-30 w-full glass-panel border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 transition-colors">
          <div class="max-w-7xl mx-auto flex items-center justify-between gap-2">
            
            <!-- Mobile Topics Drawer Trigger -->
            <button 
              id="docs-mobile-topics-btn"
              class="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors"
            >
              ${icons.bookOpen('w-4 h-4 text-brand-600 dark:text-brand-400')}
              <span class="truncate max-w-[130px] sm:max-w-[200px]">${meta.title}</span>
              ${icons.chevronDown('w-3.5 h-3.5')}
            </button>

            <!-- Mobile In-Page TOC Trigger -->
            <button 
              id="docs-mobile-toc-btn"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              ${icons.layers('w-3.5 h-3.5 text-slate-500 dark:text-slate-400')}
              <span>On This Page</span>
              ${icons.chevronDown('w-3 h-3')}
            </button>

          </div>

          <!-- Mobile Collapsible TOC Dropdown -->
          <div id="docs-mobile-toc-dropdown" class="hidden mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 max-h-60 overflow-y-auto">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Sections on this page</div>
            <div id="docs-mobile-toc-list" class="space-y-1">
              ${this.renderToc(true)}
            </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Desktop Left Sidebar Navigation (3 cols) -->
            <aside class="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 z-10 space-y-6">
              
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
              <div id="docs-sidebar-links" class="space-y-6 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
                ${this.renderSidebarCategories()}
              </div>

            </aside>

            <!-- Main Content Area (6-7 cols on desktop, full width on mobile) -->
            <main class="w-full lg:col-span-9 xl:col-span-7 bg-white dark:bg-slate-900 p-5 sm:p-8 lg:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[600px] overflow-hidden">
              <div id="docs-main-content">
                ${this.renderContentBody()}
              </div>
            </main>

            <!-- Desktop Right Sidebar: In-Page Table of Contents (2-3 cols) -->
            <aside class="hidden xl:block xl:col-span-2 xl:sticky xl:top-24 z-10 space-y-4">
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
                <a href="#/community" class="block text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-cyan-400 flex items-center gap-1.5 transition-colors">
                  ${icons.messageSquare('w-3.5 h-3.5')}
                  <span>Community Board</span>
                </a>
                <a href="${PROJECT_CONFIG.githubNewIssueUrl}" target="_blank" class="block text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-cyan-400 flex items-center gap-1.5 transition-colors">
                  ${icons.bug('w-3.5 h-3.5')}
                  <span>Report an Issue</span>
                </a>
              </div>
            </aside>

          </div>
        </div>

        <!-- Mobile Slide-over Drawer for Topics -->
        <div 
          id="docs-mobile-drawer-overlay"
          class="fixed inset-0 z-50 hidden bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"
        >
          <div 
            id="docs-mobile-drawer-panel"
            class="fixed inset-y-0 left-0 w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-900 p-5 shadow-2xl z-50 flex flex-col space-y-4 border-r border-slate-200 dark:border-slate-800"
          >
            <!-- Drawer Header -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div class="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                ${icons.bookOpen('w-5 h-5 text-brand-600 dark:text-brand-400')}
                <span>Documentation Topics</span>
              </div>
              <button 
                id="docs-mobile-drawer-close"
                class="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                ${icons.close('w-5 h-5')}
              </button>
            </div>

            <!-- Mobile Search Box -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                ${icons.search('w-4 h-4')}
              </div>
              <input 
                type="text" 
                id="docs-mobile-search-input"
                placeholder="Search topics..."
                value="${this.searchQuery}"
                class="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <!-- Scrollable Topics List -->
            <div id="docs-mobile-sidebar-links" class="flex-1 overflow-y-auto space-y-6 pr-1">
              ${this.renderSidebarCategories(true)}
            </div>

          </div>
        </div>

      </div>
    `;
  }

  private renderSidebarCategories(isMobile = false): string {
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
                  class="${isMobile ? 'mobile-doc-link' : 'docs-nav-item'} flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
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

  private renderToc(isMobile = false): string {
    if (this.currentSlug.toLowerCase() === 'translations') {
      return `<p class="text-slate-400 italic text-xs py-1">Interactive Overview Table</p>`;
    }

    if (!this.docData || !this.docData.toc || this.docData.toc.length === 0) {
      return `<p class="text-slate-400 italic text-xs py-1">No section headers on this page</p>`;
    }

    return `
      <nav class="space-y-1">
        ${this.docData.toc.map(item => `
          <button 
            type="button"
            data-toc-target="${item.id}"
            class="${isMobile ? 'mobile-toc-anchor' : 'docs-toc-anchor'} block w-full text-left text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-cyan-300 transition-colors truncate py-1 text-xs ${
              item.level === 3 ? 'pl-3 text-[11px] text-slate-500' : ''
            }"
          >
            ${item.text}
          </button>
        `).join('')}
      </nav>
    `;
  }

  private renderContentBody(): string {
    if (this.currentSlug.toLowerCase() === 'translations') {
      return this.translationsView.render();
    }

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

    // Create Giscus widget for this document page
    this.docGiscus = new GiscusWidget({
      containerId: 'doc-giscus-container',
      mapping: 'specific',
      term: `Docs: ${this.docData.title}`,
      category: 'General',
      inputPosition: 'top'
    });

    return `
      <article class="space-y-6 max-w-full">
        
        <!-- Header Metadata & Live GitHub Wiki Badge -->
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Live from GitHub Wiki</span>
            </span>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
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
        <div class="prose-custom max-w-none overflow-hidden">
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
              class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-cyan-400 group transition-all text-left sm:text-right sm:col-start-2"
            >
              <div class="text-xs text-slate-400 flex items-center sm:justify-end gap-1">
                <span>Next →</span>
              </div>
              <div class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-300 mt-1">
                ${nextPage.title}
              </div>
            </a>
          ` : ''}
        </div>

        <!-- Embedded Page Discussions Section -->
        <div class="pt-10 mt-10 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                ${icons.messageSquare('w-4 h-4 text-brand-500')}
                <span>Questions & Discussion</span>
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Discuss this documentation page or ask questions via GitHub Discussions.
              </p>
            </div>

            <a 
              href="${PROJECT_CONFIG.githubDiscussionsUrl}/categories/q-a" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-xs font-semibold text-brand-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Ask on GitHub</span>
              ${icons.externalLink('w-3 h-3')}
            </a>
          </div>

          <div class="p-4 sm:p-6 rounded-2xl bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 shadow-inner">
            ${this.docGiscus.render()}
          </div>
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
    const mobileTocEl = document.getElementById('docs-mobile-toc-list');
    if (mobileTocEl) {
      mobileTocEl.innerHTML = this.renderToc(true);
    }
    const sidebarEl = document.getElementById('docs-sidebar-links');
    if (sidebarEl) {
      sidebarEl.innerHTML = this.renderSidebarCategories();
    }
    const mobileSidebarEl = document.getElementById('docs-mobile-sidebar-links');
    if (mobileSidebarEl) {
      mobileSidebarEl.innerHTML = this.renderSidebarCategories(true);
    }

    // Update mobile subheader topic title
    const meta = WIKI_PAGES.find(p => p.slug.toLowerCase() === this.currentSlug.toLowerCase());
    const mobileTopicTitle = document.querySelector('#docs-mobile-topics-btn span');
    if (mobileTopicTitle && meta) {
      mobileTopicTitle.textContent = meta.title;
    }
  }

  private closeMobileMenus() {
    const drawerOverlay = document.getElementById('docs-mobile-drawer-overlay');
    if (drawerOverlay) drawerOverlay.classList.add('hidden');
    const tocDropdown = document.getElementById('docs-mobile-toc-dropdown');
    if (tocDropdown) tocDropdown.classList.add('hidden');
  }

  public bindEvents() {
    // Desktop Search Input
    const searchInput = document.getElementById('docs-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = (e.target as HTMLInputElement).value;
        const sidebarEl = document.getElementById('docs-sidebar-links');
        if (sidebarEl) sidebarEl.innerHTML = this.renderSidebarCategories();
        const mobileSidebarEl = document.getElementById('docs-mobile-sidebar-links');
        if (mobileSidebarEl) mobileSidebarEl.innerHTML = this.renderSidebarCategories(true);
      });
    }

    // Mobile Search Input
    const mobileSearchInput = document.getElementById('docs-mobile-search-input') as HTMLInputElement;
    if (mobileSearchInput) {
      mobileSearchInput.addEventListener('input', (e) => {
        this.searchQuery = (e.target as HTMLInputElement).value;
        const sidebarEl = document.getElementById('docs-sidebar-links');
        if (sidebarEl) sidebarEl.innerHTML = this.renderSidebarCategories();
        const mobileSidebarEl = document.getElementById('docs-mobile-sidebar-links');
        if (mobileSidebarEl) mobileSidebarEl.innerHTML = this.renderSidebarCategories(true);
      });
    }

    // Mobile Drawer Open / Close
    const mobileTopicsBtn = document.getElementById('docs-mobile-topics-btn');
    const mobileDrawerOverlay = document.getElementById('docs-mobile-drawer-overlay');
    const mobileDrawerClose = document.getElementById('docs-mobile-drawer-close');

    if (mobileTopicsBtn && mobileDrawerOverlay) {
      mobileTopicsBtn.addEventListener('click', () => {
        mobileDrawerOverlay.classList.remove('hidden');
      });
    }

    if (mobileDrawerClose && mobileDrawerOverlay) {
      mobileDrawerClose.addEventListener('click', () => {
        mobileDrawerOverlay.classList.add('hidden');
      });
    }

    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.addEventListener('click', (e) => {
        if (e.target === mobileDrawerOverlay) {
          mobileDrawerOverlay.classList.add('hidden');
        }
      });
    }

    // Mobile TOC Dropdown Toggle
    const mobileTocBtn = document.getElementById('docs-mobile-toc-btn');
    const mobileTocDropdown = document.getElementById('docs-mobile-toc-dropdown');

    if (mobileTocBtn && mobileTocDropdown) {
      mobileTocBtn.addEventListener('click', () => {
        mobileTocDropdown.classList.toggle('hidden');
      });
    }

    // Delegate click on mobile doc links to auto-close menus
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.mobile-doc-link')) {
        this.closeMobileMenus();
      }
    });

    this.bindDocEvents();
  }

  private bindDocEvents() {
    if (this.currentSlug.toLowerCase() === 'translations') {
      this.translationsView.bindEvents();
      return;
    }

    const retryBtn = document.getElementById('docs-retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.loadPage(this.currentSlug);
      });
    }

    // In-page smooth scrolling for TOC buttons without breaking SPA routing
    document.querySelectorAll('[data-toc-target]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-toc-target');
        if (targetId) {
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            const headerOffset = 90;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
        this.closeMobileMenus();
      });
    });

    if (this.docGiscus) {
      this.docGiscus.mount();
    }
  }

  public destroy() {
    if (this.docGiscus) {
      this.docGiscus.destroy();
      this.docGiscus = null;
    }
  }
}
