import { icons } from '../assets/icons';
import { ReleaseInfo, PROJECT_CONFIG } from '../config/project-info';

export class HeroComponent {
  private release: ReleaseInfo;
  private onOpenReleaseModal: () => void;

  constructor(release: ReleaseInfo, onOpenReleaseModal: () => void) {
    this.release = release;
    this.onOpenReleaseModal = onOpenReleaseModal;
  }

  public updateRelease(release: ReleaseInfo) {
    this.release = release;
    const versionEl = document.getElementById('hero-version-text');
    if (versionEl) versionEl.textContent = release.version;
    const dateEl = document.getElementById('hero-release-date');
    if (dateEl) dateEl.textContent = release.publishedAt ? `Released ${release.publishedAt}` : '';
    const dlBtn = document.getElementById('hero-main-download-btn') as HTMLAnchorElement;
    if (dlBtn && release.tarballUrl) {
      dlBtn.href = release.tarballUrl;
    }
  }

  public render(): string {
    return `
      <section class="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden tachyon-glow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div class="text-center max-w-3xl mx-auto space-y-6">
            
            <!-- Dynamic Release Banner / Pill -->
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm font-medium shadow-sm">
              <span class="flex h-2 w-2 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span class="text-slate-600 dark:text-slate-300">Latest version:</span>
              <strong id="hero-version-text" class="text-slate-900 dark:text-white font-mono font-semibold">${this.release.version}</strong>
              <span class="text-slate-300 dark:text-slate-600">|</span>
              <button 
                id="hero-changelog-btn" 
                class="text-brand-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Changelog</span>
                ${icons.chevronRight('w-3.5 h-3.5')}
              </button>
            </div>

            <!-- Main Headline -->
            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              The <span class="text-gradient">Faster-Than-Light</span> Webmail for Modern PHP
            </h1>

            <!-- Subtitle -->
            <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Hardened, ultra-fast, and database-free. Built for PHP 8.2+ with Subresource Integrity, strict CSP, Undo Send, and drop-in SnappyMail upgrade compatibility.
            </p>

            <!-- Call to Actions -->
            <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
              
              <!-- Primary Download Button -->
              <a 
                id="hero-main-download-btn"
                href="${this.release.tarballUrl || '#'}"
                class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all text-base"
              >
                ${icons.download('w-5 h-5')}
                <span>Download ${this.release.version}</span>
              </a>

              <!-- Explore Docs Button -->
              <a 
                href="#/docs"
                class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:-translate-y-0.5 transition-all text-base"
              >
                ${icons.bookOpen('w-5 h-5')}
                <span>Documentation</span>
              </a>

              <!-- GitHub Repo Button -->
              <a 
                href="${PROJECT_CONFIG.githubUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-base"
              >
                ${icons.github('w-5 h-5')}
                <span>Star on GitHub</span>
              </a>
            </div>

            <!-- Quick Copy Terminal Command -->
            <div class="pt-4 max-w-xl mx-auto">
              <div class="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 shadow-xl font-mono text-xs sm:text-sm">
                <div class="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                  <span class="text-emerald-400 select-none">$</span>
                  <span class="text-slate-300">docker run -d -p 8080:80 ghcr.io/kimusan/tachyon:latest</span>
                </div>
                <button 
                  id="hero-copy-cmd-btn"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0"
                  title="Copy command"
                >
                  <span id="hero-copy-icon">${icons.copy('w-4 h-4')}</span>
                  <span id="hero-copied-icon" class="hidden text-emerald-400">${icons.check('w-4 h-4')}</span>
                </button>
              </div>
            </div>

            <!-- Key Feature Badges -->
            <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              <div class="flex items-center gap-1.5">
                <span class="text-emerald-500">${icons.badgeCheck('w-4 h-4')}</span>
                <span>PHP 8.2 - 8.4</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-emerald-500">${icons.badgeCheck('w-4 h-4')}</span>
                <span>No Database Required</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-emerald-500">${icons.badgeCheck('w-4 h-4')}</span>
                <span>Zero Trackers / Telemetry</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-emerald-500">${icons.badgeCheck('w-4 h-4')}</span>
                <span>AGPL-3.0 Licensed</span>
              </div>
            </div>

          </div>

          <!-- Interactive UI Preview Showcase Mockup -->
          <div class="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-2xl overflow-hidden">
              
              <!-- Mock Window Bar -->
              <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/80">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div class="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div class="flex items-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400">
                  ${icons.lock('w-3.5 h-3.5 text-emerald-500')}
                  <span>https://mail.yourcompany.org</span>
                </div>
                <div class="flex items-center gap-1 text-slate-400 text-xs">
                  <span class="px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-mono font-semibold">Tachyon 3.2</span>
                </div>
              </div>

              <!-- Mock Webmail Interface Body -->
              <div class="grid grid-cols-1 md:grid-cols-12 min-h-[380px] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                
                <!-- Mock Sidebar (3 cols) -->
                <div class="hidden md:block md:col-span-3 border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/30">
                  
                  <!-- Account Switcher with multi-account badges -->
                  <div class="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div class="flex items-center gap-2.5 overflow-hidden">
                      <div class="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold flex items-center justify-center text-xs">
                        JS
                      </div>
                      <div class="text-xs truncate">
                        <div class="font-semibold text-slate-900 dark:text-white">admin@domain.tld</div>
                        <div class="text-slate-400 text-[11px]">Primary Mailbox</div>
                      </div>
                    </div>
                    <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500 text-white">4</span>
                  </div>

                  <!-- Folders -->
                  <div class="space-y-1 text-xs font-medium">
                    <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold">
                      <div class="flex items-center gap-2">
                        ${icons.mail('w-4 h-4')}
                        <span>Inbox</span>
                      </div>
                      <span class="px-1.5 py-0.2 rounded-full bg-brand-600 text-white text-[10px]">3</span>
                    </div>

                    <div class="flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40">
                      <div class="flex items-center gap-2">
                        ${icons.edit('w-4 h-4')}
                        <span>Drafts</span>
                      </div>
                      <span class="text-slate-400 text-[11px]">1</span>
                    </div>

                    <div class="flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40">
                      <div class="flex items-center gap-2">
                        ${icons.arrowRight('w-4 h-4')}
                        <span>Sent</span>
                      </div>
                    </div>

                    <div class="flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40">
                      <div class="flex items-center gap-2">
                        ${icons.filter('w-4 h-4')}
                        <span>Sieve Rules</span>
                      </div>
                    </div>

                    <div class="flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40">
                      <div class="flex items-center gap-2">
                        ${icons.shield('w-4 h-4')}
                        <span>OpenPGP Keys</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Mock Message List (4 cols) -->
                <div class="hidden sm:block md:col-span-4 border-r border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                  <div class="p-3 bg-slate-50 dark:bg-slate-950/20 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Recent Messages</span>
                    <span>3 Unread</span>
                  </div>

                  <div class="p-3.5 bg-brand-50/50 dark:bg-brand-950/20 border-l-4 border-brand-500 space-y-1">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-bold text-slate-900 dark:text-white">Security Operations</span>
                      <span class="text-slate-400 text-[11px]">Just now</span>
                    </div>
                    <div class="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">Tachyon Hardening & SRI Check Passed</div>
                    <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">Content Security Policy report-to endpoint is active...</div>
                  </div>

                  <div class="p-3.5 space-y-1 hover:bg-slate-50 dark:hover:bg-slate-800/20">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-semibold text-slate-800 dark:text-slate-200">DevOps Alert</span>
                      <span class="text-slate-400 text-[11px]">10:42 AM</span>
                    </div>
                    <div class="text-xs text-slate-700 dark:text-slate-300 truncate">PHP 8.3 OPcache stats at 99.4% hitrate</div>
                    <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">Memory usage 4.2 MB per request. Zero SQL latency...</div>
                  </div>

                  <div class="p-3.5 space-y-1 hover:bg-slate-50 dark:hover:bg-slate-800/20">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-semibold text-slate-800 dark:text-slate-200">Nextcloud Hub</span>
                      <span class="text-slate-400 text-[11px]">Yesterday</span>
                    </div>
                    <div class="text-xs text-slate-700 dark:text-slate-300 truncate">Tachyon App v3.2.5 successfully synchronized</div>
                  </div>
                </div>

                <!-- Mock Reading Pane & Undo Toast (5 cols) -->
                <div class="md:col-span-5 p-5 flex flex-col justify-between space-y-4">
                  <div class="space-y-4">
                    <div class="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <h3 class="font-bold text-slate-900 dark:text-white text-base">Tachyon Hardening & SRI Check Passed</h3>
                        <div class="text-xs text-slate-500 mt-0.5">From: <span class="font-mono text-slate-700 dark:text-slate-300">secops@tachyon-mail.app</span></div>
                      </div>
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        ${icons.lock('w-3 h-3')}
                        <span>PGP Signed</span>
                      </span>
                    </div>

                    <div class="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                      <p>All automated security validations have passed:</p>
                      <ul class="space-y-1 font-mono text-[11px] text-slate-500 dark:text-slate-400 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
                        <li>✓ Subresource Integrity (SRI) verified</li>
                        <li>✓ Permissions-Policy: camera=(), mic=()</li>
                        <li>✓ Pure IMAP connection via TLS 1.3</li>
                      </ul>
                    </div>
                  </div>

                  <!-- Headline Feature Highlight: Undo Send Bar -->
                  <div class="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-lg border border-slate-800 text-xs">
                    <div class="flex items-center gap-2.5">
                      <span class="text-cyan-400">${icons.undo('w-4 h-4')}</span>
                      <span>Message queued. Sending in <strong class="text-cyan-300 font-mono">5s</strong></span>
                    </div>
                    <button class="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] transition-colors">
                      Undo Send
                    </button>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </section>
    `;
  }

  public bindEvents() {
    const changelogBtn = document.getElementById('hero-changelog-btn');
    if (changelogBtn) {
      changelogBtn.addEventListener('click', () => {
        this.onOpenReleaseModal();
      });
    }

    const copyBtn = document.getElementById('hero-copy-cmd-btn');
    const copyIcon = document.getElementById('hero-copy-icon');
    const copiedIcon = document.getElementById('hero-copied-icon');

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const cmd = 'docker run -d -p 8080:80 ghcr.io/kimusan/tachyon:latest';
        try {
          await navigator.clipboard.writeText(cmd);
          if (copyIcon && copiedIcon) {
            copyIcon.classList.add('hidden');
            copiedIcon.classList.remove('hidden');
            setTimeout(() => {
              copyIcon.classList.remove('hidden');
              copiedIcon.classList.add('hidden');
            }, 2000);
          }
        } catch {
          // fallback
        }
      });
    }
  }
}
