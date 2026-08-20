import { icons } from '../assets/icons';
import { PROJECT_CONFIG } from '../config/project-info';

export class IssueTrackerCTAComponent {
  public render(): string {
    return `
      <section class="py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-brand-900 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl border border-brand-800/50 relative overflow-hidden">
            
            <!-- Background Glow -->
            <div class="absolute -right-20 -top-20 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div class="relative z-10 space-y-8 text-center md:text-left">
              
              <div class="max-w-2xl space-y-3">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-800/60 border border-brand-700/60 text-xs font-semibold text-cyan-300">
                  ${icons.github('w-3.5 h-3.5')}
                  <span>Open Source & Community Driven</span>
                </div>
                <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Help Shape the Future of Tachyon
                </h2>
                <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Have an idea for a feature, discovered an edge case, or want to contribute? The project lives and evolves on GitHub.
                </p>
              </div>

              <!-- Action Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                
                <!-- Bug Report -->
                <a 
                  href="${PROJECT_CONFIG.githubNewBugUrl}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-cyan-400/50 transition-all group text-left"
                >
                  <div class="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    ${icons.bug('w-5 h-5')}
                  </div>
                  <h3 class="font-bold text-white text-base flex items-center justify-between">
                    <span>Report a Bug</span>
                    ${icons.externalLink('w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors')}
                  </h3>
                  <p class="text-xs text-slate-300 mt-1">
                    Found an issue with rendering or IMAP? File a report.
                  </p>
                </a>

                <!-- Feature Request -->
                <a 
                  href="${PROJECT_CONFIG.githubNewFeatureUrl}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-cyan-400/50 transition-all group text-left"
                >
                  <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    ${icons.lightbulb('w-5 h-5')}
                  </div>
                  <h3 class="font-bold text-white text-base flex items-center justify-between">
                    <span>Feature Request</span>
                    ${icons.externalLink('w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors')}
                  </h3>
                  <p class="text-xs text-slate-300 mt-1">
                    Suggest improvements or vote on proposed ideas.
                  </p>
                </a>

                <!-- Discussions -->
                <a 
                  href="${PROJECT_CONFIG.githubDiscussionsUrl}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-cyan-400/50 transition-all group text-left"
                >
                  <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    ${icons.messageSquare('w-5 h-5')}
                  </div>
                  <h3 class="font-bold text-white text-base flex items-center justify-between">
                    <span>Discussions</span>
                    ${icons.externalLink('w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors')}
                  </h3>
                  <p class="text-xs text-slate-300 mt-1">
                    Ask questions, share custom plugins, and get help.
                  </p>
                </a>

              </div>

            </div>

          </div>

        </div>
      </section>
    `;
  }
}
