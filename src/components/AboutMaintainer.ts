import { icons } from '../assets/icons';

export class AboutMaintainerComponent {
  public render(): string {
    return `
      <section id="maintainer" class="py-20 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xl relative overflow-hidden">
            
            <!-- Subtle background accent glow -->
            <div class="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <!-- Left Profile Card (4 cols) -->
              <div class="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-4">
                
                <!-- Profile Image -->
                <div class="relative group">
                  <div class="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-400 p-1 shadow-xl shadow-brand-500/20 group-hover:shadow-brand-500/35 transition-all">
                    <div class="w-full h-full rounded-[12px] overflow-hidden bg-slate-900">
                      <picture>
                        <source srcset="/images/kim-schulz.webp" type="image/webp">
                        <img 
                          src="/images/kim-schulz.png" 
                          alt="Kim Schulz - Creator & Maintainer of Tachyon Webmail" 
                          class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          width="300"
                          height="300"
                          loading="lazy"
                        />
                      </picture>
                    </div>
                  </div>
                  <div class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-md" title="Active Lead Maintainer">
                    ${icons.code('w-3.5 h-3.5')}
                  </div>
                </div>

                <div>
                  <h3 class="text-xl font-bold text-slate-900 dark:text-white">
                    Kim Schulz
                  </h3>
                  <p class="text-xs font-medium text-brand-600 dark:text-cyan-400 font-mono mt-0.5">
                    Lead Maintainer & Creator
                  </p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Software engineer • Denmark
                  </p>
                </div>

                <div class="w-full pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <a 
                    href="https://schulz.dk" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
                  >
                    ${icons.globe('w-4 h-4 text-brand-500')}
                    <span>schulz.dk</span>
                    ${icons.externalLink('w-3 h-3 opacity-70')}
                  </a>

                  <a 
                    href="https://github.com/kimusan" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    ${icons.github('w-4 h-4')}
                    <span>@kimusan on GitHub</span>
                  </a>
                </div>

              </div>

              <!-- Right Bio & Vision (8 cols) -->
              <div class="lg:col-span-8 space-y-6">
                
                <div class="space-y-2">
                  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-cyan-300 text-xs font-semibold">
                    ${icons.heart('w-3.5 h-3.5 text-rose-500')}
                    <span>About the Maintainer</span>
                  </div>
                  
                  <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Driven by Open Source & Performance
                  </h2>
                </div>

                <div class="prose-custom text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
                  <p>
                    Tachyon is created and actively maintained by <strong>Kim Schulz</strong> — a software hacker by day and hardware hacker by night with a deep passion for gadgets, programming, and high-performance developer tools.
                  </p>
                  
                  <p>
                    With decades of software engineering experience and having authored books on tools like Vim, Kim stepped up to build Tachyon to provide the open source community with a modern, hardened, and ultra-fast webmail client built for <strong>PHP 8.2+</strong>.
                  </p>
                </div>

                <!-- 3 Pillars of Stewardship -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div class="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div class="text-brand-500 dark:text-cyan-400 font-semibold text-xs flex items-center gap-1.5">
                      ${icons.shield('w-4 h-4')}
                      <span>Zero Telemetry</span>
                    </div>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      100% open source under AGPLv3. No ads, tracking, or corporate strings attached.
                    </p>
                  </div>

                  <div class="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div class="text-brand-500 dark:text-cyan-400 font-semibold text-xs flex items-center gap-1.5">
                      ${icons.zap('w-4 h-4')}
                      <span>Modern PHP 8+</span>
                    </div>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      Engineered with strict typed properties, subresource integrity, and zero database latency.
                    </p>
                  </div>

                  <div class="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div class="text-brand-500 dark:text-cyan-400 font-semibold text-xs flex items-center gap-1.5">
                      ${icons.messageSquare('w-4 h-4')}
                      <span>Active Triage</span>
                    </div>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      Continuous updates, transparent roadmap, and responsive issue resolution.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>
    `;
  }
}
