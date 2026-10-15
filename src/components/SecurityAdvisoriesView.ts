import { icons } from '../assets/icons';
import { PROJECT_CONFIG } from '../config/project-info';
import { SecurityAdvisoriesService, SecurityAdvisory } from '../services/security-advisories';

export class SecurityAdvisoriesViewComponent {
  private advisories: SecurityAdvisory[] = [];
  private isLoading: boolean = false;
  private searchQuery: string = '';
  private selectedSeverity: 'all' | 'medium' | 'low' = 'all';
  private expandedIds: Set<string> = new Set();

  public async loadData() {
    this.isLoading = true;
    this.updateView();
    try {
      this.advisories = await SecurityAdvisoriesService.getAdvisories();
    } catch (e) {
      console.warn('Failed to load advisories', e);
    } finally {
      this.isLoading = false;
      this.updateView();
    }
  }

  public render(): string {
    if (this.isLoading && this.advisories.length === 0) {
      return `
        <div class="space-y-8 animate-pulse py-8">
          <div class="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-2/3"></div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div class="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div class="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div class="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          </div>
          <div class="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      `;
    }

    const filtered = this.getFilteredAdvisories();
    const mediumCount = this.advisories.filter(a => a.severity === 'medium').length;
    const lowCount = this.advisories.filter(a => a.severity === 'low').length;

    return `
      <div id="security-advisories-dashboard" class="space-y-8 max-w-full">
        
        <!-- Header -->
        <div class="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>All Known Advisories Patched</span>
              </span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <span>GHSA & CVE Tracker</span>
              </span>
            </div>

            <div class="flex items-center gap-2.5">
              <a 
                href="${PROJECT_CONFIG.githubSecurityReportUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-sm transition-all"
              >
                ${icons.shieldAlert('w-3.5 h-3.5')}
                <span>Report Vulnerability</span>
                ${icons.externalLink('w-3 h-3')}
              </a>

              <a 
                href="${PROJECT_CONFIG.githubSecurityAdvisoriesUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all"
              >
                ${icons.github('w-3.5 h-3.5')}
                <span>GitHub Advisories</span>
              </a>
            </div>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Security Advisories & Disclosures
          </h1>

          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            Tachyon operates a transparent security disclosure policy. Below are all tracked GitHub Security Advisories (GHSA), affected versions, and verification fixes. All disclosed issues have been thoroughly resolved in current releases.
          </p>
        </div>

        <!-- Metric Summary Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <div class="text-xs font-medium text-slate-500 dark:text-slate-400">Total Advisories</div>
            <div class="text-2xl font-bold font-mono text-slate-900 dark:text-white">${this.advisories.length}</div>
            <div class="text-[11px] text-slate-400">Tracked on GitHub</div>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80 space-y-1">
            <div class="text-xs font-medium text-emerald-700 dark:text-emerald-400">Resolution Rate</div>
            <div class="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-300">100% Patched</div>
            <div class="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">Resolved in v4.4.0+</div>
          </div>

          <div class="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/80 space-y-1">
            <div class="text-xs font-medium text-amber-700 dark:text-amber-400">Medium Severity</div>
            <div class="text-2xl font-bold font-mono text-amber-600 dark:text-amber-300">${mediumCount}</div>
            <div class="text-[11px] text-amber-600/80 dark:text-amber-400/80">All resolved</div>
          </div>

          <div class="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/80 space-y-1">
            <div class="text-xs font-medium text-blue-700 dark:text-blue-400">Low Severity</div>
            <div class="text-2xl font-bold font-mono text-blue-600 dark:text-blue-300">${lowCount}</div>
            <div class="text-[11px] text-blue-600/80 dark:text-blue-400/80">All resolved</div>
          </div>
        </div>

        <!-- Upgrade Recommendation Notice -->
        <div class="p-4 sm:p-5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200/80 dark:border-brand-800/60 flex items-start sm:items-center justify-between gap-4">
          <div class="flex items-start sm:items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
              ${icons.shieldCheck('w-5 h-5')}
            </div>
            <div class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Running an older version?</strong> Upgrading to <strong>Tachyon v4.4.2 or newer</strong> resolves every advisory listed on this page. Upgrades preserve existing configurations and user data without database changes.
            </div>
          </div>
          <a 
            href="#/docs/Installation-instructions" 
            class="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0 shadow-xs"
          >
            <span>Upgrade Guide</span>
            ${icons.arrowRight('w-3.5 h-3.5')}
          </a>
        </div>

        <!-- Filter Bar & Search -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <!-- Filter Tabs -->
          <div class="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold">
            <button 
              id="adv-filter-all"
              class="px-3 py-1.5 rounded-lg transition-colors ${this.selectedSeverity === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
            >
              All (${this.advisories.length})
            </button>

            <button 
              id="adv-filter-medium"
              class="px-3 py-1.5 rounded-lg transition-colors ${this.selectedSeverity === 'medium' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
            >
              Medium (${mediumCount})
            </button>

            <button 
              id="adv-filter-low"
              class="px-3 py-1.5 rounded-lg transition-colors ${this.selectedSeverity === 'low' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
            >
              Low (${lowCount})
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative max-w-xs w-full">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              ${icons.search('w-4 h-4')}
            </div>
            <input 
              type="text" 
              id="adv-search-input"
              placeholder="Search advisories, GHSA, CVE..."
              value="${this.searchQuery}"
              class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

        </div>

        <!-- Advisories List -->
        <div class="space-y-4">
          ${filtered.length > 0 ? filtered.map(advisory => this.renderAdvisoryCard(advisory)).join('') : `
            <div class="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                ${icons.search('w-5 h-5')}
              </div>
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">No advisories match your filter</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Try modifying your search query or severity filter.</p>
            </div>
          `}
        </div>

        <!-- Responsible Disclosure & Security Reporting Section -->
        <div class="p-6 sm:p-8 rounded-2xl bg-gradient-to-tr from-slate-50 to-rose-50/20 dark:from-slate-900 dark:to-rose-950/10 border border-slate-200 dark:border-slate-800 space-y-4">
          <div class="flex items-center gap-2.5 font-bold text-base text-slate-900 dark:text-white">
            ${icons.shield('w-5 h-5 text-rose-500')}
            <span>Responsible Vulnerability Disclosure</span>
          </div>

          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            We welcome responsible disclosure from security researchers and users. If you discover a security issue or vulnerability in Tachyon, please report it privately through GitHub Private Vulnerability Reporting rather than opening a public issue.
          </p>

          <div class="flex flex-wrap items-center gap-3 pt-2">
            <a 
              href="${PROJECT_CONFIG.githubSecurityReportUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-all"
            >
              ${icons.shieldAlert('w-3.5 h-3.5')}
              <span>Report Security Advisory (Private)</span>
              ${icons.externalLink('w-3 h-3')}
            </a>

            <a 
              href="${PROJECT_CONFIG.githubSecurityPolicyUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <span>View SECURITY.md Policy</span>
              ${icons.externalLink('w-3 h-3')}
            </a>
          </div>
        </div>

      </div>
    `;
  }

  private renderAdvisoryCard(a: SecurityAdvisory): string {
    const isExpanded = this.expandedIds.has(a.ghsaId);

    const severityBadge = a.severity === 'medium'
      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800/80'
      : a.severity === 'low'
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800/80'
        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800/80';

    return `
      <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-all">
        
        <!-- Card Clickable Header -->
        <div 
          data-adv-toggle="${a.ghsaId}"
          class="p-5 sm:p-6 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors select-none"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
            <div class="flex flex-wrap items-center gap-2 text-xs">
              <!-- Severity Pill -->
              <span class="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] border ${severityBadge}">
                ${a.severity}
              </span>

              <!-- Patched Pill -->
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                ${icons.badgeCheck('w-3 h-3 text-emerald-600 dark:text-emerald-400')}
                <span>Patched in v${a.patchedVersions}</span>
              </span>

              <!-- GHSA Identifier -->
              <span class="px-2 py-0.5 rounded font-mono text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                ${a.ghsaId}
              </span>

              ${a.cveId ? `
                <span class="px-2 py-0.5 rounded font-mono text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  ${a.cveId}
                </span>
              ` : ''}
            </div>

            <span class="text-xs font-mono text-slate-400 flex-shrink-0">
              ${a.formattedDate}
            </span>
          </div>

          <!-- Title -->
          <div class="flex items-start justify-between gap-4">
            <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              ${a.summary}
            </h3>

            <button 
              type="button" 
              class="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-transform flex-shrink-0 mt-0.5"
              aria-label="Toggle details"
            >
              <span class="inline-block transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}">
                ${icons.chevronDown('w-4 h-4')}
              </span>
            </button>
          </div>

          <!-- Quick Metadata Row -->
          <div class="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-3 text-xs text-slate-500 dark:text-slate-400">
            <div>
              <span>Affected:</span>
              <strong class="font-mono text-slate-700 dark:text-slate-300 font-semibold">${a.vulnerableVersionRange}</strong>
            </div>

            <div>
              <span>Patched:</span>
              <strong class="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">${a.patchedVersions}</strong>
            </div>

            ${a.cvssScore ? `
              <div>
                <span>CVSS:</span>
                <strong class="font-mono text-slate-700 dark:text-slate-300 font-semibold">${a.cvssScore}</strong>
              </div>
            ` : ''}

            ${a.reporter ? `
              <div>
                <span>Credit:</span>
                <span class="text-slate-600 dark:text-slate-300 font-medium">@${a.reporter}</span>
              </div>
            ` : ''}

            <span class="text-brand-600 dark:text-cyan-400 font-semibold ml-auto flex items-center gap-1">
              <span>${isExpanded ? 'Hide Details' : 'View Writeup & Fix'}</span>
            </span>
          </div>
        </div>

        <!-- Expandable Details Content -->
        ${isExpanded ? `
          <div class="border-t border-slate-200 dark:border-slate-800 p-5 sm:p-8 bg-slate-50/50 dark:bg-slate-950/40 space-y-6">
            
            <div class="prose-custom max-w-none text-xs sm:text-sm">
              ${a.htmlDescription}
            </div>

            <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <div class="text-xs text-slate-500 dark:text-slate-400">
                Official GHSA Advisory on GitHub:
              </div>

              <a 
                href="${a.htmlUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
              >
                ${icons.github('w-3.5 h-3.5')}
                <span>Open ${a.ghsaId} on GitHub</span>
                ${icons.externalLink('w-3 h-3')}
              </a>
            </div>

          </div>
        ` : ''}

      </div>
    `;
  }

  private getFilteredAdvisories(): SecurityAdvisory[] {
    let list = [...this.advisories];

    if (this.selectedSeverity !== 'all') {
      list = list.filter(a => a.severity === this.selectedSeverity);
    }

    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(a => 
        a.summary.toLowerCase().includes(q) ||
        a.ghsaId.toLowerCase().includes(q) ||
        (a.cveId && a.cveId.toLowerCase().includes(q)) ||
        a.description.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public bindEvents() {
    const searchInput = document.getElementById('adv-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = (e.target as HTMLInputElement).value;
        this.updateView();
      });
    }

    const filterAll = document.getElementById('adv-filter-all');
    if (filterAll) {
      filterAll.addEventListener('click', () => {
        this.selectedSeverity = 'all';
        this.updateView();
      });
    }

    const filterMedium = document.getElementById('adv-filter-medium');
    if (filterMedium) {
      filterMedium.addEventListener('click', () => {
        this.selectedSeverity = 'medium';
        this.updateView();
      });
    }

    const filterLow = document.getElementById('adv-filter-low');
    if (filterLow) {
      filterLow.addEventListener('click', () => {
        this.selectedSeverity = 'low';
        this.updateView();
      });
    }

    // Toggle expansion
    document.querySelectorAll('[data-adv-toggle]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-adv-toggle');
        if (id) {
          if (this.expandedIds.has(id)) {
            this.expandedIds.delete(id);
          } else {
            this.expandedIds.add(id);
          }
          this.updateView();
        }
      });
    });
  }

  private updateView() {
    const container = document.getElementById('docs-main-content');
    if (container) {
      container.innerHTML = this.render();
      this.bindEvents();
    }
  }
}
