import { icons } from '../assets/icons';
import { PROJECT_CONFIG } from '../config/project-info';
import { GiscusWidget } from './GiscusWidget';

export class CommunityViewComponent {
  private giscus: GiscusWidget;

  constructor() {
    this.giscus = new GiscusWidget({
      containerId: 'community-giscus-container',
      mapping: 'specific',
      term: 'Tachyon Community Hub',
      category: 'General',
      inputPosition: 'top'
    });
  }

  public render(): string {
    const categories = [
      {
        title: 'Q&A & Help',
        description: 'Ask questions about server setups, IMAP config, Sieve filters, or OpenPGP.',
        icon: icons.messageSquare('w-5 h-5 text-blue-500'),
        url: `${PROJECT_CONFIG.githubDiscussionsUrl}/categories/q-a`,
        badge: 'Q&A'
      },
      {
        title: 'Ideas & Feature Requests',
        description: 'Propose enhancements, vote on roadmap suggestions, and share architectural ideas.',
        icon: icons.lightbulb('w-5 h-5 text-amber-500'),
        url: `${PROJECT_CONFIG.githubDiscussionsUrl}/categories/ideas`,
        badge: 'Ideas'
      },
      {
        title: 'Show and Tell & Plugins',
        description: 'Share your custom plugins, themes, deployment scripts, and setups with the community.',
        icon: icons.packageIcon('w-5 h-5 text-emerald-500'),
        url: `${PROJECT_CONFIG.githubDiscussionsUrl}/categories/show-and-tell`,
        badge: 'Showcase'
      },
      {
        title: 'General Discussions',
        description: 'Open discussions about email protocols, security best practices, and webmail experiences.',
        icon: icons.zap('w-5 h-5 text-violet-500'),
        url: `${PROJECT_CONFIG.githubDiscussionsUrl}/categories/general`,
        badge: 'General'
      },
      {
        title: 'Announcements',
        description: 'Official release announcements, roadmap updates, and project news from maintainers.',
        icon: icons.badgeCheck('w-5 h-5 text-cyan-500'),
        url: `${PROJECT_CONFIG.githubDiscussionsUrl}/categories/announcements`,
        badge: 'Updates'
      }
    ];

    return `
      <div id="community-view-container" class="min-h-screen pt-4 pb-20">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <!-- Header Hero -->
          <div class="text-center max-w-3xl mx-auto space-y-4 pt-4">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-cyan-300 border border-brand-200 dark:border-brand-800 text-xs font-semibold">
              ${icons.github('w-3.5 h-3.5')}
              <span>Powered by GitHub Discussions</span>
            </div>
            
            <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Tachyon Community & Discussions
            </h1>
            
            <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Connect with developers, ask configuration questions, share custom plugins, or propose new features. All discussions are synced live with GitHub.
            </p>

            <!-- Actions -->
            <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a 
                href="${PROJECT_CONFIG.githubDiscussionsUrl}/new/choose"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 text-sm transition-all"
              >
                ${icons.messageSquare('w-4 h-4')}
                <span>Start a Discussion on GitHub</span>
                ${icons.externalLink('w-3.5 h-3.5 opacity-80')}
              </a>

              <a 
                href="${PROJECT_CONFIG.githubDiscussionsUrl}/categories/q-a"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-sm transition-all"
              >
                <span>Ask a Question (Q&A)</span>
                ${icons.externalLink('w-3.5 h-3.5 opacity-80')}
              </a>
            </div>
          </div>

          <!-- Category Grid -->
          <div class="space-y-4">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
              Discussion Categories
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              ${categories.map(cat => `
                <a 
                  href="${cat.url}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-cyan-400 card-hover shadow-sm flex flex-col justify-between group transition-all"
                >
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        ${cat.icon}
                      </div>
                      <span class="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        ${cat.badge}
                      </span>
                    </div>

                    <h4 class="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-300 transition-colors text-base flex items-center gap-1.5">
                      <span>${cat.title}</span>
                    </h4>

                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      ${cat.description}
                    </p>
                  </div>

                  <div class="pt-4 mt-2 flex items-center text-xs font-semibold text-brand-600 dark:text-cyan-400 gap-1">
                    <span>View Category on GitHub</span>
                    ${icons.externalLink('w-3.5 h-3.5')}
                  </div>
                </a>
              `).join('')}
            </div>
          </div>

          <!-- Live Embedded Discussions Board -->
          <div class="space-y-4">
            <div class="flex items-center justify-between px-1">
              <div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                  Live Discussion Feed
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  Comment directly or reply to ongoing community topics.
                </p>
              </div>

              <a 
                href="${PROJECT_CONFIG.githubDiscussionsUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs font-semibold text-brand-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Browse All on GitHub</span>
                ${icons.externalLink('w-3.5 h-3.5')}
              </a>
            </div>

            <div class="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              ${this.giscus.render()}
            </div>
          </div>

        </div>
      </div>
    `;
  }

  public mount() {
    this.giscus.mount();
  }

  public destroy() {
    this.giscus.destroy();
  }
}
