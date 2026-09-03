import { icons } from '../assets/icons';
import { NewsService, NewsPost } from '../services/news-service';

export class NewsHubComponent {
  private posts: NewsPost[] = [];
  private filteredPosts: NewsPost[] = [];
  private tags: string[] = [];
  private selectedTag: string = 'All';
  private searchQuery: string = '';
  private isLoading: boolean = true;

  public async loadData() {
    this.isLoading = true;
    this.posts = await NewsService.getAllPosts();
    this.tags = ['All', ...(await NewsService.getAllTags())];
    this.applyFilters();
    this.isLoading = false;
    this.updateView();
  }

  public render(): string {
    if (this.isLoading) {
      return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-pulse">
          <div class="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div class="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div class="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          </div>
        </div>
      `;
    }

    const featuredPost = this.posts.find(p => p.featured) || this.posts[0];
    const regularPosts = this.selectedTag === 'All' && !this.searchQuery 
      ? this.filteredPosts.filter(p => p.slug !== featuredPost?.slug)
      : this.filteredPosts;

    return `
      <div id="news-hub-container" class="min-h-screen py-10 bg-slate-50/50 dark:bg-slate-950/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <!-- Page Header & RSS link -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-cyan-300 border border-brand-200 dark:border-brand-800">
                  <span>Tachyon Newsroom</span>
                </span>
              </div>
              <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Latest News & Announcements
              </h1>
              <p class="text-base text-slate-600 dark:text-slate-300 max-w-2xl">
                Stay updated on releases, security advisories, architectural deep-dives, and community progress.
              </p>
            </div>

            <div class="flex items-center gap-3">
              <a 
                href="/feed.xml" 
                target="_blank" 
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-colors shadow-sm"
                title="Subscribe via RSS feed"
              >
                ${icons.rss('w-4 h-4 text-amber-500')}
                <span>RSS Feed</span>
              </a>
            </div>
          </div>

          <!-- Featured Hero Article Banner (Shown when no search/tag filter is active) -->
          ${featuredPost && this.selectedTag === 'All' && !this.searchQuery ? `
            <div class="relative rounded-3xl bg-gradient-to-br from-brand-900 via-slate-900 to-slate-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-brand-800/40 overflow-hidden">
              <!-- Glow background accent -->
              <div class="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div class="relative z-10 max-w-3xl space-y-5">
                <div class="flex flex-wrap items-center gap-2.5">
                  <span class="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-brand-500 text-white shadow-sm">
                    Featured Update
                  </span>
                  <span class="text-xs font-mono text-slate-300">${featuredPost.formattedDate}</span>
                  <span class="text-xs text-slate-400">•</span>
                  <span class="text-xs text-slate-300">${featuredPost.readingTime}</span>
                </div>

                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight hover:text-cyan-300 transition-colors">
                  <a href="#/news/${featuredPost.slug}">${featuredPost.title}</a>
                </h2>

                <p class="text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-3">
                  ${featuredPost.summary}
                </p>

                <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div class="flex items-center gap-3">
                    <img 
                      src="${featuredPost.authorAvatar || '/images/kim-schulz.webp'}" 
                      alt="${featuredPost.author}" 
                      class="w-9 h-9 rounded-full object-cover border-2 border-brand-400/40"
                    />
                    <div class="text-xs">
                      <div class="font-bold text-white">${featuredPost.author}</div>
                      <div class="text-slate-400">Maintainer</div>
                    </div>
                  </div>

                  <a 
                    href="#/news/${featuredPost.slug}" 
                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-slate-950 hover:bg-slate-100 dark:bg-cyan-400 dark:hover:bg-cyan-300 dark:text-slate-950 transition-all shadow-md"
                  >
                    <span>Read Article</span>
                    ${icons.arrowRight('w-4 h-4')}
                  </a>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Filter & Search Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            
            <!-- Tag Filter Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              ${this.tags.map(tag => `
                <button 
                  data-news-tag="${tag}"
                  class="news-tag-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    this.selectedTag === tag 
                      ? 'bg-brand-600 text-white shadow-sm' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }"
                >
                  ${tag}
                </button>
              `).join('')}
            </div>

            <!-- Search Box -->
            <div class="relative max-w-xs w-full">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                ${icons.search('w-4 h-4')}
              </div>
              <input 
                type="text" 
                id="news-search-input"
                placeholder="Search articles..."
                value="${this.searchQuery}"
                class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
              />
            </div>

          </div>

          <!-- Articles Grid -->
          ${regularPosts.length > 0 ? `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              ${regularPosts.map(post => this.renderArticleCard(post)).join('')}
            </div>
          ` : `
            <div class="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                ${icons.search('w-6 h-6')}
              </div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">No articles found</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search query or tag filter.</p>
            </div>
          `}

        </div>
      </div>
    `;
  }

  private renderArticleCard(post: NewsPost): string {
    return `
      <article class="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-brand-500 dark:hover:border-cyan-400 transition-all group">
        <div class="space-y-4">
          
          <!-- Tags & Date -->
          <div class="flex items-center justify-between gap-2 text-xs">
            <div class="flex flex-wrap gap-1.5">
              ${post.tags.map(t => `
                <span class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  ${t}
                </span>
              `).join('')}
            </div>
            <span class="text-slate-400 text-[11px] font-mono">${post.readingTime}</span>
          </div>

          <!-- Title -->
          <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-300 transition-colors leading-snug">
            <a href="#/news/${post.slug}">
              ${post.title}
            </a>
          </h3>

          <!-- Summary -->
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
            ${post.summary}
          </p>

        </div>

        <!-- Card Footer -->
        <div class="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <img 
              src="${post.authorAvatar || '/images/kim-schulz.webp'}" 
              alt="${post.author}" 
              class="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div class="text-[11px]">
              <div class="font-bold text-slate-900 dark:text-white">${post.author}</div>
              <div class="text-slate-400 font-mono text-[10px]">${post.formattedDate}</div>
            </div>
          </div>

          <a 
            href="#/news/${post.slug}" 
            class="text-xs font-semibold text-brand-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
          >
            <span>Read</span>
            ${icons.arrowRight('w-3.5 h-3.5')}
          </a>
        </div>
      </article>
    `;
  }

  private applyFilters() {
    let list = [...this.posts];

    if (this.selectedTag !== 'All') {
      list = list.filter(p => p.tags.includes(this.selectedTag));
    }

    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.summary.toLowerCase().includes(q) || 
        p.rawContent.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    this.filteredPosts = list;
  }

  public bindEvents() {
    const searchInput = document.getElementById('news-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = (e.target as HTMLInputElement).value;
        this.applyFilters();
        this.updateView();
      });
    }

    document.querySelectorAll('[data-news-tag]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-news-tag');
        if (tag) {
          this.selectedTag = tag;
          this.applyFilters();
          this.updateView();
        }
      });
    });
  }

  private updateView() {
    const container = document.getElementById('main-view-container');
    if (container && window.location.hash.startsWith('#/news') && !window.location.hash.match(/^#\/news\/[a-zA-Z0-9_-]+/)) {
      container.innerHTML = this.render();
      this.bindEvents();
    }
  }
}
