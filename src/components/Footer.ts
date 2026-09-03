import { icons } from '../assets/icons';
import { PROJECT_CONFIG } from '../config/project-info';

export class FooterComponent {
  public render(): string {
    return `
      <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            <!-- Col 1: Brand & Bio -->
            <div class="space-y-4 md:col-span-2">
              <div class="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white">
                  ${icons.zap('w-4 h-4')}
                </div>
                <span>Tachyon Webmail</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                The modern, hardened webmail client for PHP 8.2+. Named after the theoretical particle that moves faster than light.
              </p>
              <div class="text-xs text-slate-400">
                Released under the <a href="${PROJECT_CONFIG.licenseUrl}" target="_blank" class="underline hover:text-brand-500">${PROJECT_CONFIG.license}</a>.
              </div>
            </div>

            <!-- Col 2: Documentation & News -->
            <div class="space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Resources & Updates
              </h4>
              <ul class="space-y-2 text-xs">
                <li><a href="#/news" class="hover:text-brand-500 dark:hover:text-cyan-400 transition-colors font-semibold text-brand-600 dark:text-cyan-400 flex items-center gap-1.5">${icons.rss('w-3.5 h-3.5')}<span>News & Announcements</span></a></li>
                <li><a href="/feed.xml" target="_blank" class="hover:text-brand-500 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-amber-600 dark:text-amber-400"><span>RSS Feed (XML)</span></a></li>
                <li><a href="#/docs/Installation-instructions" class="hover:text-brand-500 dark:hover:text-cyan-400 transition-colors">Installation Guide</a></li>
                <li><a href="#/docs/Docker" class="hover:text-brand-500 dark:hover:text-cyan-400 transition-colors">Docker Setup</a></li>
                <li><a href="#/docs/Admin-Manual" class="hover:text-brand-500 dark:hover:text-cyan-400 transition-colors">Admin Manual</a></li>
                <li><a href="#/docs/Translations" class="hover:text-brand-500 dark:hover:text-cyan-400 transition-colors">Translations Status</a></li>
                <li><a href="#/docs/OpenPGP" class="hover:text-brand-500 dark:hover:text-cyan-400 transition-colors">OpenPGP Encryption</a></li>
              </ul>
            </div>

            <!-- Col 3: Community & Source -->
            <div class="space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Community
              </h4>
              <ul class="space-y-2 text-xs">
                <li><a href="#/community" class="hover:text-brand-500 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5 font-semibold text-brand-600 dark:text-cyan-400">${icons.messageSquare('w-3.5 h-3.5')}<span>Community & Discussions</span></a></li>
                <li><a href="${PROJECT_CONFIG.githubUrl}" target="_blank" class="hover:text-brand-500 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">${icons.github('w-3.5 h-3.5')}<span>GitHub Repository</span></a></li>
                <li><a href="${PROJECT_CONFIG.githubIssuesUrl}" target="_blank" class="hover:text-brand-500 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">${icons.bug('w-3.5 h-3.5')}<span>Issue Tracker</span></a></li>
                <li><a href="${PROJECT_CONFIG.githubDiscussionsUrl}" target="_blank" class="hover:text-brand-500 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">${icons.externalLink('w-3.5 h-3.5')}<span>Discussions on GitHub</span></a></li>
                <li><a href="${PROJECT_CONFIG.nextcloudAppUrl}" target="_blank" class="hover:text-brand-500 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">${icons.layers('w-3.5 h-3.5')}<span>Nextcloud App Store</span></a></li>
                <li><a href="${PROJECT_CONFIG.githubWikiWebUrl}" target="_blank" class="hover:text-brand-500 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">${icons.bookOpen('w-3.5 h-3.5')}<span>GitHub Wiki</span></a></li>
                <li><a href="https://schulz.dk" target="_blank" class="hover:text-brand-500 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">${icons.globe('w-3.5 h-3.5')}<span>Maintainer: schulz.dk</span></a></li>
              </ul>
            </div>

          </div>

          <!-- Bottom Copyright & Lineage Acknowledgement -->
          <div class="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div>
              © 2025 - present Tachyon by <a href="https://schulz.dk" target="_blank" class="underline hover:text-brand-500">Kim Schulz</a> • © 2020 - 2024 SnappyMail • © 2013 - 2022 RainLoop
            </div>
            <div class="flex items-center gap-4">
              <span>tachyonmail.app</span>
              <span>•</span>
              <a href="${PROJECT_CONFIG.githubUrl}" target="_blank" class="hover:underline">Source on GitHub</a>
            </div>
          </div>

        </div>
      </footer>
    `;
  }
}
