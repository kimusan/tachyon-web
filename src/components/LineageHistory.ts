import { icons } from '../assets/icons';
import { HISTORY_TIMELINE } from '../config/project-info';

export class LineageHistoryComponent {
  public render(): string {
    return `
      <section id="history" class="py-20 relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-cyan-400">
              Project Evolution
            </h2>
            <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              From RainLoop to SnappyMail to Tachyon
            </p>
            <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Understanding the lineage and why Tachyon is the future of lightweight, secure PHP webmail.
            </p>
          </div>

          <!-- Timeline Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            ${HISTORY_TIMELINE.map((item, index) => {
              const isTachyon = index === 2;
              return `
                <div class="relative p-6 sm:p-8 rounded-2xl ${
                  isTachyon 
                    ? 'bg-gradient-to-b from-brand-50/80 to-indigo-50/80 dark:from-brand-950/40 dark:to-slate-900 border-2 border-brand-500/80 shadow-lg shadow-brand-500/10' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                } space-y-4 flex flex-col justify-between">
                  
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                        isTachyon 
                          ? 'bg-brand-500 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }">
                        ${item.year}
                      </span>
                      <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
                        ${item.status}
                      </span>
                    </div>

                    <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      ${isTachyon ? icons.zap('w-5 h-5 text-brand-500') : ''}
                      <span>${item.name}</span>
                    </h3>

                    <p class="text-xs font-semibold text-brand-600 dark:text-cyan-400">
                      ${item.tagline}
                    </p>

                    <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      ${item.description}
                    </p>
                  </div>

                  ${isTachyon ? `
                    <div class="pt-4 border-t border-brand-200 dark:border-brand-900/60">
                      <div class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        ${icons.badgeCheck('w-4 h-4')}
                        <span>100% In-Place SnappyMail Upgrade Compatible</span>
                      </div>
                    </div>
                  ` : ''}

                </div>
              `;
            }).join('')}
          </div>

          <!-- Upgrade Banner Callout -->
          <div class="mt-12 p-6 sm:p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="space-y-2 text-center md:text-left">
              <h4 class="text-lg sm:text-xl font-bold flex items-center justify-center md:justify-start gap-2">
                <span class="text-cyan-400">${icons.refreshCw('w-5 h-5')}</span>
                <span>Already running SnappyMail?</span>
              </h4>
              <p class="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Upgrading to Tachyon is seamless: your existing <code>data/</code> directory, user settings, domain configurations, and address books remain untouched. Plugin shims ensure existing RainLoop/SnappyMail plugins continue working.
              </p>
            </div>
            <a 
              href="#/docs/Installation-instructions"
              class="px-5 py-3 rounded-xl font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors text-sm whitespace-nowrap flex items-center gap-2 flex-shrink-0"
            >
              <span>Upgrade Guide</span>
              ${icons.arrowRight('w-4 h-4')}
            </a>
          </div>

        </div>
      </section>
    `;
  }
}
