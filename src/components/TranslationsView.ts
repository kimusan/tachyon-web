import { icons } from '../assets/icons';
import { PROJECT_CONFIG } from '../config/project-info';
import { TranslationStatusService, TranslationStatusReport, LocaleTranslationStatus } from '../services/translation-status';

export class TranslationsViewComponent {
  private report: TranslationStatusReport | null = null;
  private isLoading: boolean = false;
  private searchQuery: string = '';
  private filterTab: 'all' | 'complete' | 'progress' = 'all';
  private sortField: 'percentage' | 'name' | 'missing' = 'percentage';
  private sortOrder: 'asc' | 'desc' = 'desc';

  public async loadData() {
    this.isLoading = true;
    this.render();
    try {
      this.report = await TranslationStatusService.getTranslationStatus();
      this.isLoading = false;
      this.updateView();
    } catch (e) {
      console.warn('Failed to load translation status report', e);
      this.isLoading = false;
      this.updateView();
    }
  }

  public render(): string {
    if (this.isLoading || !this.report) {
      return `
        <div class="space-y-8 animate-pulse py-8">
          <div class="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-2/3"></div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div class="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div class="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div class="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          </div>
          <div class="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      `;
    }

    const filteredLocales = this.getFilteredLocales();
    const fullCount = this.report.locales.filter(l => l.percentage >= 100).length;
    const progressCount = this.report.locales.filter(l => l.percentage < 100).length;

    return `
      <div id="translations-dashboard" class="space-y-8 max-w-full">
        
        <!-- Header -->
        <div class="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-cyan-300 border border-brand-200 dark:border-brand-800">
                <span>Release ${this.report.version}</span>
              </span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Live Translation Sync</span>
              </span>
            </div>

            <a 
              href="https://github.com/${PROJECT_CONFIG.githubRepo}/tree/master/tachyon/v/0.0.0/app/localization"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-sm transition-all"
            >
              ${icons.github('w-3.5 h-3.5')}
              <span>Contribute Translations</span>
              ${icons.externalLink('w-3 h-3')}
            </a>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Translation & Localization Status
          </h1>

          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            Tachyon supports <strong>${this.report.totalLocales} languages</strong> out of the box. Missing strings automatically fall back to English. Below is the real-time translation coverage for every supported locale.
          </p>
        </div>

        <!-- Metric Summary Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <div class="text-xs font-medium text-slate-500 dark:text-slate-400">Total Strings</div>
            <div class="text-2xl font-bold font-mono text-slate-900 dark:text-white">${this.report.totalStrings}</div>
            <div class="text-[11px] text-slate-400 font-mono">${this.report.userStrings} user + ${this.report.adminStrings} admin</div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <div class="text-xs font-medium text-slate-500 dark:text-slate-400">Supported Locales</div>
            <div class="text-2xl font-bold font-mono text-brand-600 dark:text-cyan-400">${this.report.totalLocales}</div>
            <div class="text-[11px] text-slate-400">Across 30+ countries</div>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80 space-y-1">
            <div class="text-xs font-medium text-emerald-700 dark:text-emerald-400">100% Complete</div>
            <div class="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-300">${fullCount}</div>
            <div class="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">Every string translated</div>
          </div>

          <div class="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/80 space-y-1">
            <div class="text-xs font-medium text-amber-700 dark:text-amber-400">Needs Translations</div>
            <div class="text-2xl font-bold font-mono text-amber-600 dark:text-amber-300">${progressCount}</div>
            <div class="text-[11px] text-amber-600/80 dark:text-amber-400/80">Open for contributions</div>
          </div>
        </div>

        <!-- Filter Bar & Search -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <!-- Filter Tabs -->
          <div class="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold">
            <button 
              id="trans-filter-all"
              class="px-3 py-1.5 rounded-lg transition-colors ${this.filterTab === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
            >
              All (${this.report.locales.length})
            </button>

            <button 
              id="trans-filter-complete"
              class="px-3 py-1.5 rounded-lg transition-colors ${this.filterTab === 'complete' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
            >
              100% Complete (${fullCount})
            </button>

            <button 
              id="trans-filter-progress"
              class="px-3 py-1.5 rounded-lg transition-colors ${this.filterTab === 'progress' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
            >
              Needs Work (${progressCount})
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative max-w-xs w-full">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              ${icons.search('w-4 h-4')}
            </div>
            <input 
              type="text" 
              id="trans-search-input"
              placeholder="Search language or code..."
              value="${this.searchQuery}"
              class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

        </div>

        <!-- Translation Status Table -->
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <th class="py-3.5 px-4">Language</th>
                  <th class="py-3.5 px-3">Code</th>
                  <th class="py-3.5 px-4 min-w-[180px]">Completeness</th>
                  <th class="py-3.5 px-3 text-right">Translated</th>
                  <th class="py-3.5 px-3 text-right">Missing</th>
                  <th class="py-3.5 px-4">Missing Categories & Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                ${filteredLocales.map(l => this.renderLocaleRow(l)).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- How to Translate Guide -->
        <div class="p-6 sm:p-8 rounded-2xl bg-gradient-to-tr from-slate-50 to-brand-50/30 dark:from-slate-900 dark:to-brand-950/20 border border-slate-200 dark:border-slate-800 space-y-4">
          <div class="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-white">
            ${icons.edit('w-5 h-5 text-brand-500')}
            <span>How to Help Translate Tachyon</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div class="font-bold text-slate-900 dark:text-white">1. Find Your Language</div>
              <p>Locate your language folder under <code>tachyon/v/0.0.0/app/localization/{code}/</code> (contains <code>user.json</code>, <code>admin.json</code>, and <code>static.json</code>).</p>
            </div>

            <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div class="font-bold text-slate-900 dark:text-white">2. Fill Missing Strings</div>
              <p>Missing keys default to English. Translate the values directly into your native language.</p>
            </div>

            <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div class="font-bold text-slate-900 dark:text-white">3. Open a Pull Request</div>
              <p>Submit a PR on GitHub. Your translations will be reviewed and shipped in the next release!</p>
            </div>
          </div>

          <div class="pt-2 flex items-center justify-between flex-wrap gap-3">
            <span class="text-xs text-slate-500 dark:text-slate-400">
              Need to add a completely new language? Create a new directory in <code>localization/</code> with the ISO code.
            </span>
            <a 
              href="https://github.com/${PROJECT_CONFIG.githubRepo}/tree/master/tachyon/v/0.0.0/app/localization"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-cyan-400 hover:underline"
            >
              <span>View Localization Directory on GitHub</span>
              ${icons.externalLink('w-3.5 h-3.5')}
            </a>
          </div>
        </div>

      </div>
    `;
  }

  private renderLocaleRow(l: LocaleTranslationStatus): string {
    const isComplete = l.percentage >= 100;
    const progressColor = isComplete 
      ? 'bg-emerald-500' 
      : l.percentage >= 90 
        ? 'bg-brand-500' 
        : l.percentage >= 70 
          ? 'bg-amber-500' 
          : 'bg-rose-500';

    const badgeClass = isComplete
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      : l.percentage >= 90
        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-cyan-300 border-brand-200 dark:border-brand-800'
        : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';

    const editUrl = `https://github.com/${PROJECT_CONFIG.githubRepo}/tree/master/tachyon/v/0.0.0/app/localization/${l.code}`;

    return `
      <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
        <!-- Language + Flag -->
        <td class="py-3 px-4">
          <div class="flex items-center gap-2.5">
            <span class="text-lg leading-none select-none">${l.flag}</span>
            <div>
              <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>${l.name}</span>
                ${isComplete ? `<span class="text-emerald-500" title="100% Complete">${icons.badgeCheck('w-3.5 h-3.5')}</span>` : ''}
              </div>
              <div class="text-[11px] text-slate-400">${l.nativeName}</div>
            </div>
          </div>
        </td>

        <!-- Code -->
        <td class="py-3 px-3">
          <span class="px-2 py-0.5 rounded font-mono text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            ${l.code}
          </span>
        </td>

        <!-- Progress Bar & Percentage -->
        <td class="py-3 px-4">
          <div class="space-y-1.5 max-w-[200px]">
            <div class="flex items-center justify-between text-xs font-mono">
              <span class="font-bold px-1.5 py-0.2 rounded border text-[11px] ${badgeClass}">
                ${l.percentage.toFixed(1)}%
              </span>
              <span class="text-[11px] text-slate-400">${l.translatedCount}/${this.report?.totalStrings}</span>
            </div>
            <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div class="h-full rounded-full ${progressColor} transition-all duration-500" style="width: ${l.percentage}%"></div>
            </div>
          </div>
        </td>

        <!-- Translated count -->
        <td class="py-3 px-3 text-right font-mono font-medium text-slate-900 dark:text-white">
          ${l.translatedCount}
        </td>

        <!-- Missing count -->
        <td class="py-3 px-3 text-right font-mono font-medium ${l.missingCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}">
          ${l.missingCount > 0 ? l.missingCount : '—'}
        </td>

        <!-- Missing Categories & Action -->
        <td class="py-3 px-4">
          <div class="flex items-center justify-between gap-3">
            <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[220px]" title="${l.missingFrom || 'Fully translated'}">
              ${l.missingFrom ? l.missingFrom : '<span class="text-emerald-600 dark:text-emerald-400 font-medium">All strings translated ✓</span>'}
            </div>

            <a 
              href="${editUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-700 transition-colors inline-flex items-center gap-1 flex-shrink-0"
              title="Edit ${l.name} on GitHub"
            >
              <span>${isComplete ? 'View' : 'Translate'}</span>
              ${icons.externalLink('w-3 h-3')}
            </a>
          </div>
        </td>
      </tr>
    `;
  }

  private getFilteredLocales(): LocaleTranslationStatus[] {
    if (!this.report) return [];

    let list = [...this.report.locales];

    // Filter tab
    if (this.filterTab === 'complete') {
      list = list.filter(l => l.percentage >= 100);
    } else if (this.filterTab === 'progress') {
      list = list.filter(l => l.percentage < 100);
    }

    // Search
    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(l => 
        l.name.toLowerCase().includes(q) || 
        l.nativeName.toLowerCase().includes(q) || 
        l.code.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (this.sortField === 'percentage') {
        return this.sortOrder === 'desc' ? b.percentage - a.percentage : a.percentage - b.percentage;
      }
      if (this.sortField === 'name') {
        return this.sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      }
      if (this.sortField === 'missing') {
        return this.sortOrder === 'desc' ? b.missingCount - a.missingCount : a.missingCount - b.missingCount;
      }
      return 0;
    });

    return list;
  }

  public bindEvents() {
    const searchInput = document.getElementById('trans-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = (e.target as HTMLInputElement).value;
        this.updateView();
      });
    }

    const filterAll = document.getElementById('trans-filter-all');
    if (filterAll) {
      filterAll.addEventListener('click', () => {
        this.filterTab = 'all';
        this.updateView();
      });
    }

    const filterComplete = document.getElementById('trans-filter-complete');
    if (filterComplete) {
      filterComplete.addEventListener('click', () => {
        this.filterTab = 'complete';
        this.updateView();
      });
    }

    const filterProgress = document.getElementById('trans-filter-progress');
    if (filterProgress) {
      filterProgress.addEventListener('click', () => {
        this.filterTab = 'progress';
        this.updateView();
      });
    }
  }

  private updateView() {
    const container = document.getElementById('docs-main-content');
    if (container) {
      container.innerHTML = this.render();
      this.bindEvents();
    }
  }
}
