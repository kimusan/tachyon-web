import { icons } from '../assets/icons';
import { NewsService, NewsPost } from '../services/news-service';

export class LatestNewsSectionComponent {
  private posts: NewsPost[] = [];

  constructor() {
    this.init();
  }

  private async init() {
    this.posts = await NewsService.getLatestPosts(3);
    this.updateDom();
  }

  public render(): string {
    return `
      <section id="latest-news" class="py-20 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <!-- Section Header -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div class="space-y-3">
              <h2 class="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-cyan-400">
                News & Updates
              </h2>
              <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Latest Announcements
              </p>
              <p class="text-base text-slate-600 dark:text-slate-300 max-w-2xl">
                Stay updated on releases, security advisories, and development milestones.
              </p>
            </div>

            <a 
              href="#/news" 
              class="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-cyan-400 hover:text-brand-500 transition-colors group self-start md:self-end"
            >
              <span>View All News</span>
              <span class="group-hover:translate-x-0.5 transition-transform">${icons.arrowRight('w-4 h-4')}</span>
            </a>
          </div>

          <!-- Cards Grid -->
          <div id="latest-news-grid" class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            ${this.renderCards()}
          </div>

        </div>
      </section>
    `;
  }

  private renderCards(): string {
    if (this.posts.length === 0) {
      return `
        <div class="col-span-3 h-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse flex items-center justify-center text-slate-400 text-xs">
          Loading latest news...
        </div>
      `;
    }

    return this.posts.map(post => `
      <article class="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-brand-500 dark:hover:border-cyan-400 transition-all group">
        <div class="space-y-3.5">
          
          <div class="flex items-center justify-between gap-2 text-xs">
            <div class="flex flex-wrap gap-1.5">
              ${post.tags.slice(0, 2).map(t => `
                <span class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-cyan-300">
                  ${t}
                </span>
              `).join('')}
            </div>
            <span class="text-slate-400 text-[11px] font-mono">${post.formattedDate}</span>
          </div>

          <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
            <a href="#/news/${post.slug}">
              ${post.title}
            </a>
          </h3>

          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
            ${post.summary}
          </p>

        </div>

        <div class="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <span class="text-slate-400 font-mono text-[11px]">${post.readingTime}</span>
          <a 
            href="#/news/${post.slug}" 
            class="font-semibold text-brand-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
          >
            <span>Read Article</span>
            ${icons.arrowRight('w-3.5 h-3.5')}
          </a>
        </div>
      </article>
    `).join('');
  }

  private updateDom() {
    const grid = document.getElementById('latest-news-grid');
    if (grid) {
      grid.innerHTML = this.renderCards();
    }
  }
}
