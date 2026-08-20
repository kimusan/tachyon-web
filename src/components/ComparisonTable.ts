import { icons } from '../assets/icons';
import { COMPARISON_DATA } from '../config/project-info';

export class ComparisonTableComponent {
  public render(): string {
    return `
      <section id="comparison" class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-cyan-400">
              Feature Matrix
            </h2>
            <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How Tachyon Compares
            </p>
            <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              See the architectural and security advantages of Tachyon compared to previous forks and alternatives.
            </p>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                  <th class="p-4 sm:p-5 font-semibold text-slate-900 dark:text-white w-1/4">Feature / Capability</th>
                  <th class="p-4 sm:p-5 font-bold text-brand-600 dark:text-cyan-400 bg-brand-50/50 dark:bg-brand-950/40 border-x border-brand-200/60 dark:border-brand-900/60 w-1/4">
                    <div class="flex items-center gap-1.5">
                      ${icons.zap('w-4 h-4')}
                      <span>Tachyon</span>
                    </div>
                  </th>
                  <th class="p-4 sm:p-5 font-semibold text-slate-700 dark:text-slate-300 w-1/4">SnappyMail</th>
                  <th class="p-4 sm:p-5 font-semibold text-slate-500 dark:text-slate-400 w-1/4">RainLoop (Legacy)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
                ${COMPARISON_DATA.map((row, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/40 dark:bg-slate-950/20'}">
                    <td class="p-4 sm:p-5 font-medium text-slate-900 dark:text-white">
                      ${row.feature}
                    </td>
                    <td class="p-4 sm:p-5 font-semibold text-brand-900 dark:text-brand-200 bg-brand-50/30 dark:bg-brand-950/20 border-x border-brand-200/40 dark:border-brand-900/40">
                      <div class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        ${icons.badgeCheck('w-4 h-4 flex-shrink-0')}
                        <span class="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">${row.tachyon}</span>
                      </div>
                    </td>
                    <td class="p-4 sm:p-5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                      ${row.snappymail}
                    </td>
                    <td class="p-4 sm:p-5 text-slate-400 dark:text-slate-500 text-xs sm:text-sm">
                      ${row.rainloop}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

        </div>
      </section>
    `;
  }
}
