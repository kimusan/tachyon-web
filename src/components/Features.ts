import { icons } from '../assets/icons';

export class FeaturesComponent {
  public render(): string {
    const features = [
      {
        icon: icons.calendar('w-6 h-6 text-emerald-500'),
        title: 'Built-in CalDAV Calendar',
        description: 'Full-featured calendar with Month, Week, Day, and List views, drag-and-drop event management, and CalDAV synchronization.'
      },
      {
        icon: icons.sun('w-6 h-6 text-amber-500'),
        title: 'Dark / Light Mode Toggling',
        description: 'Instant one-click theme mode toggle for supported skins, allowing seamless transitions between bright day and dark night themes.'
      },
      {
        icon: icons.user('w-6 h-6 text-sky-500'),
        title: 'vCard Categories & Groups',
        description: 'Organize address book contacts with vCard CATEGORIES tags and automatically expand group chips directly in compose fields.'
      },
      {
        icon: icons.databaseOff('w-6 h-6 text-brand-500'),
        title: 'Zero Database Required',
        description: 'Connects directly to your IMAP/SMTP server. No MySQL, PostgreSQL, or SQLite database setup or migrations required.'
      },
      {
        icon: icons.shield('w-6 h-6 text-emerald-500'),
        title: 'Hardened Security & CSP',
        description: 'Strict Content-Security-Policy with Reporting-Endpoints, Permissions-Policy headers denying camera/mic/USB, and SRI hashes.'
      },
      {
        icon: icons.zap('w-6 h-6 text-amber-500'),
        title: 'PHP 8.2+ Architecture',
        description: 'Refactored for PHP 8.2 to 8.4 with strict typing, enums (ResponseType, MessagePriority, Layout), and modern namespace architecture.'
      },
      {
        icon: icons.undo('w-6 h-6 text-cyan-500'),
        title: 'Undo Send Feature',
        description: 'Configurable delay (Off / 5 / 10 / 20 / 30 seconds) before SMTP delivery, giving you time to cancel accidental emails.'
      },
      {
        icon: icons.layers('w-6 h-6 text-indigo-500'),
        title: 'Multi-Account Switcher',
        description: 'Manage multiple email accounts simultaneously with live unread count badges on the account switcher button.'
      },
      {
        icon: icons.eyeOff('w-6 h-6 text-rose-500'),
        title: '100% Privacy & Zero Trackers',
        description: 'No Gravatar, no social trackers, no telemetry, no Google/Facebook embeds. Your email metadata stays strictly yours.'
      },
      {
        icon: icons.lock('w-6 h-6 text-violet-500'),
        title: 'Modern OpenPGP v5',
        description: 'End-to-end PGP email encryption and signature verification powered by updated OpenPGP.js v5.11.3 and Mailvelope.'
      },
      {
        icon: icons.filter('w-6 h-6 text-blue-500'),
        title: 'Advanced Sieve Filter Editor',
        description: 'Create and edit server-side mail filtering rules with syntax-highlighted ManageSieve script editor.'
      },
      {
        icon: icons.terminal('w-6 h-6 text-teal-500'),
        title: 'Syslog Fail2Ban Logging',
        description: 'Failed authentication attempts are logged directly to system syslog for seamless automated Fail2Ban IP blocking.'
      }
    ];

    return `
      <section id="features" class="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-cyan-400">
              Engineered For Speed & Privacy
            </h2>
            <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              A Modern Webmail Client Built Right
            </p>
            <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Tachyon eliminates bloated legacy code and insecure defaults, delivering an ultra-fast, hardened email client.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            ${features.map(f => `
              <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 card-hover shadow-sm space-y-3">
                <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  ${f.icon}
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                  ${f.title}
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  ${f.description}
                </p>
              </div>
            `).join('')}
          </div>

        </div>
      </section>
    `;
  }
}
