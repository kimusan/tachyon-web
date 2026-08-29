import { icons } from '../assets/icons';
import { INSTALL_SNIPPETS, ReleaseInfo, FALLBACK_RELEASE, PROJECT_CONFIG } from '../config/project-info';

type InstallTabKey = 'docker' | 'debian' | 'rpm' | 'tarball' | 'nextcloud';

export class InstallTabsComponent {
  private activeTab: InstallTabKey = 'docker';
  private release: ReleaseInfo = FALLBACK_RELEASE;

  constructor(release: ReleaseInfo = FALLBACK_RELEASE) {
    this.release = release;
  }

  public updateRelease(release: ReleaseInfo) {
    this.release = release;
    const codeEl = document.getElementById('install-code-content');
    if (codeEl) {
      codeEl.textContent = this.getSnippet(this.activeTab);
    }
  }

  public render(): string {
    const tabs: { key: InstallTabKey; label: string; icon: string }[] = [
      { key: 'docker', label: 'Docker Container', icon: icons.packageIcon('w-4 h-4') },
      { key: 'debian', label: 'Debian / Ubuntu (.deb)', icon: icons.server('w-4 h-4') },
      { key: 'rpm', label: 'RHEL / Fedora (.rpm)', icon: icons.cpu('w-4 h-4') },
      { key: 'tarball', label: 'Manual Archive (.tar.gz)', icon: icons.terminal('w-4 h-4') },
      { key: 'nextcloud', label: 'Nextcloud App', icon: icons.layers('w-4 h-4') },
    ];

    return `
      <section id="install" class="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-cyan-400">
              Quick Start
            </h2>
            <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Deploy Tachyon in Minutes
            </p>
            <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Choose your preferred deployment method. No database setup or complex dependencies required.
            </p>
          </div>

          <div class="max-w-4xl mx-auto">
            
            <!-- Tab Navigation -->
            <div class="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 mb-4">
              ${tabs.map(tab => `
                <button 
                  data-install-tab="${tab.key}"
                  class="install-tab-btn flex-1 min-w-[130px] flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    this.activeTab === tab.key 
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }"
                >
                  ${tab.icon}
                  <span>${tab.label}</span>
                </button>
              `).join('')}
            </div>

            <!-- Terminal Snippet Box -->
            <div class="relative rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 shadow-2xl overflow-hidden">
              <div class="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div class="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span id="install-snippet-title" class="ml-2 text-xs font-mono text-slate-400">bash</span>
                </div>
                <button 
                  id="install-copy-btn"
                  class="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <span id="install-copy-icon">${icons.copy('w-3.5 h-3.5')}</span>
                  <span id="install-copied-icon" class="hidden text-emerald-400">${icons.check('w-3.5 h-3.5')}</span>
                  <span id="install-copy-text">Copy</span>
                </button>
              </div>

              <div class="p-6 overflow-x-auto">
                <pre class="font-mono text-sm leading-relaxed text-emerald-400/90"><code id="install-code-content">${this.getSnippet(this.activeTab)}</code></pre>
              </div>
            </div>

            <!-- Requirement Note -->
            <div class="mt-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
              <div class="flex items-center gap-1.5">
                ${icons.zap('w-4 h-4 text-amber-500')}
                <span>Requires PHP 8.2+ with <code>mbstring</code> & <code>OpenSSL</code>/<code>Sodium</code></span>
              </div>
              <a href="#/docs/Installation-instructions" class="text-brand-600 dark:text-cyan-400 hover:underline font-semibold flex items-center gap-1">
                <span>View Full Installation Guide</span>
                ${icons.arrowRight('w-3.5 h-3.5')}
              </a>
            </div>

          </div>

        </div>
      </section>
    `;
  }

  private getSnippet(tab: InstallTabKey): string {
    const rawVersion = this.release.version || 'v4.0.5';

    switch (tab) {
      case 'docker':
        return `# Pull and run the official Tachyon Docker container
docker run -d \\
  --name tachyon-webmail \\
  -p 8080:80 \\
  -v tachyon_data:/var/www/html/data \\
  --restart unless-stopped \\
  ghcr.io/${PROJECT_CONFIG.githubRepo.toLowerCase()}:latest`;

      case 'debian':
        return `# Download and install the latest .deb package on Debian/Ubuntu (${rawVersion})
wget https://github.com/${PROJECT_CONFIG.githubRepo}/releases/latest/download/tachyon_latest_all.deb
sudo apt install ./tachyon_latest_all.deb

# Verify PHP 8.2+ requirement and reload web server
sudo systemctl reload nginx # or apache2`;

      case 'rpm':
        return `# Download and install the latest .rpm package on RHEL/Fedora/CentOS/AlmaLinux (${rawVersion})
wget https://github.com/${PROJECT_CONFIG.githubRepo}/releases/latest/download/tachyon_latest_all.rpm
sudo dnf install ./tachyon_latest_all.rpm # or sudo rpm -Uvh ./tachyon_latest_all.rpm

# Verify PHP 8.2+ requirement and reload web server
sudo systemctl reload nginx # or httpd`;

      case 'tarball':
        return `# Download and extract the latest release archive (${rawVersion})
cd /var/www/html
wget https://github.com/${PROJECT_CONFIG.githubRepo}/releases/latest/download/tachyon-latest.tar.gz
tar -xzf tachyon-latest.tar.gz
chown -R www-data:www-data data/

# Open your browser and navigate to:
# http://your-domain.com/?admin`;

      case 'nextcloud':
        return `# In your Nextcloud web interface:
# 1. Navigate to Apps -> Search for "Tachyon"
# 2. Click "Download and enable"

# Or install manually into your Nextcloud apps directory:
cd /var/www/nextcloud/apps/
wget https://github.com/${PROJECT_CONFIG.githubRepo}/releases/latest/download/tachyon-latest-nextcloud.tar.gz
tar -xzf tachyon-latest-nextcloud.tar.gz`;

      default:
        return INSTALL_SNIPPETS[tab] || INSTALL_SNIPPETS.docker;
    }
  }

  public bindEvents() {
    const tabButtons = document.querySelectorAll('.install-tab-btn');
    const codeEl = document.getElementById('install-code-content');
    const copyBtn = document.getElementById('install-copy-btn');
    const copyIcon = document.getElementById('install-copy-icon');
    const copiedIcon = document.getElementById('install-copied-icon');
    const copyText = document.getElementById('install-copy-text');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-install-tab') as InstallTabKey;
        if (!targetTab) return;

        this.activeTab = targetTab;

        // Update button styles
        tabButtons.forEach(b => {
          b.classList.remove('bg-white', 'dark:bg-slate-900', 'text-slate-900', 'dark:text-white', 'shadow-sm');
          b.classList.add('text-slate-600', 'dark:text-slate-400');
        });

        btn.classList.add('bg-white', 'dark:bg-slate-900', 'text-slate-900', 'dark:text-white', 'shadow-sm');
        btn.classList.remove('text-slate-600', 'dark:text-slate-400');

        if (codeEl) {
          codeEl.textContent = this.getSnippet(targetTab);
        }
      });
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const currentCode = this.getSnippet(this.activeTab);
        try {
          await navigator.clipboard.writeText(currentCode);
          if (copyIcon && copiedIcon && copyText) {
            copyIcon.classList.add('hidden');
            copiedIcon.classList.remove('hidden');
            copyText.textContent = 'Copied!';
            setTimeout(() => {
              copyIcon.classList.remove('hidden');
              copiedIcon.classList.add('hidden');
              copyText.textContent = 'Copy';
            }, 2000);
          }
        } catch {
          // ignore
        }
      });
    }
  }
}
