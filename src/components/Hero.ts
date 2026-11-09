import { icons } from '../assets/icons';
import { ReleaseInfo, PROJECT_CONFIG, FALLBACK_RELEASE, FALLBACK_PRERELEASE } from '../config/project-info';

export class HeroComponent {
  private stableRelease: ReleaseInfo = FALLBACK_RELEASE;
  private prerelease: ReleaseInfo | null = FALLBACK_PRERELEASE;
  private onOpenReleaseModal: (release?: ReleaseInfo) => void;

  constructor(
    stableRelease: ReleaseInfo, 
    prerelease: ReleaseInfo | null, 
    onOpenReleaseModal: (release?: ReleaseInfo) => void
  ) {
    this.stableRelease = stableRelease;
    this.prerelease = prerelease;
    this.onOpenReleaseModal = onOpenReleaseModal;
  }

  public updateReleases(stable: ReleaseInfo, prerelease: ReleaseInfo | null) {
    this.stableRelease = stable;
    this.prerelease = prerelease;

    // Update stable text & download href
    const versionEl = document.getElementById('hero-version-text');
    if (versionEl) versionEl.textContent = stable.version;

    const dlBtn = document.getElementById('hero-main-download-btn') as HTMLAnchorElement;
    if (dlBtn && stable.tarballUrl) {
      dlBtn.href = stable.tarballUrl;
    }
    const dlBtnText = document.getElementById('hero-main-download-text');
    if (dlBtnText) {
      dlBtnText.textContent = `Download ${stable.version}`;
    }

    // Update pre-release text & container
    const preContainer = document.getElementById('hero-prerelease-banner');
    const preVersionEl = document.getElementById('hero-prerelease-version-text');
    const preCtaBtn = document.getElementById('hero-prerelease-cta-btn');

    if (preContainer) {
      if (this.prerelease) {
        preContainer.classList.remove('hidden');
        if (preVersionEl) preVersionEl.textContent = this.prerelease.version;
      } else {
        preContainer.classList.add('hidden');
      }
    }

    if (preCtaBtn) {
      if (this.prerelease) {
        preCtaBtn.classList.remove('hidden');
        const preCtaText = document.getElementById('hero-prerelease-cta-text');
        if (preCtaText) preCtaText.textContent = `Pre-release: ${this.prerelease.version}`;
      } else {
        preCtaBtn.classList.add('hidden');
      }
    }
  }

  public render(): string {
    return `
      <section class="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden tachyon-glow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div class="text-center max-w-3xl mx-auto space-y-6">
            
            <!-- Dynamic Release Badges (Stable + Pre-release) -->
            <div class="flex flex-wrap items-center justify-center gap-2.5">
              
              <!-- Stable Version Pill -->
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm font-medium shadow-sm">
                <span class="flex h-2 w-2 relative">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span class="text-slate-600 dark:text-slate-300">Latest stable:</span>
                <strong id="hero-version-text" class="text-slate-900 dark:text-white font-mono font-semibold">${this.stableRelease.version}</strong>
                <span class="text-slate-300 dark:text-slate-600">|</span>
                <button 
                  id="hero-changelog-btn" 
                  class="text-brand-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Changelog</span>
                  ${icons.chevronRight('w-3.5 h-3.5')}
                </button>
              </div>

              <!-- Pre-Release Pill (Shown when pre-release exists) -->
              <div id="hero-prerelease-banner" class="${this.prerelease ? '' : 'hidden'} inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 text-xs sm:text-sm font-medium shadow-sm">
                ${icons.flask('w-3.5 h-3.5 text-amber-500')}
                <span class="text-amber-800 dark:text-amber-300 font-medium">Pre-release:</span>
                <strong id="hero-prerelease-version-text" class="text-amber-900 dark:text-amber-100 font-mono font-semibold">${this.prerelease ? this.prerelease.version : ''}</strong>
                <span class="text-amber-300 dark:text-amber-800">|</span>
                <button 
                  id="hero-prerelease-changelog-btn" 
                  class="text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Preview</span>
                  ${icons.chevronRight('w-3.5 h-3.5')}
                </button>
              </div>

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
              
              <!-- Primary Download Button (Stable) -->
              <a 
                id="hero-main-download-btn"
                href="${this.stableRelease.tarballUrl || '#'}"
                class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all text-base"
              >
                ${icons.download('w-5 h-5')}
                <span id="hero-main-download-text">Download ${this.stableRelease.version}</span>
              </a>

              <!-- Pre-Release CTA Button (if pre-release available) -->
              <button 
                id="hero-prerelease-cta-btn"
                class="${this.prerelease ? '' : 'hidden'} inline-flex items-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-amber-900 dark:text-amber-100 bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 dark:hover:bg-amber-900 border border-amber-200 dark:border-amber-800 hover:-translate-y-0.5 transition-all text-base"
              >
                ${icons.flask('w-4 h-4 text-amber-500')}
                <span id="hero-prerelease-cta-text">Pre-release: ${this.prerelease ? this.prerelease.version : ''}</span>
              </button>

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
                  <span class="text-slate-300">docker run -d -p 8080:8888 ghcr.io/kimusan/tachyon:latest</span>
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
                <div class="flex items-center gap-1.5 text-slate-400 text-xs">
                  <span class="text-brand-600 dark:text-cyan-400">${icons.tachyonMark('w-3.5 h-3.5')}</span>
                  <span class="px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-mono font-semibold">Tachyon Webmail</span>
                </div>
              </div>

              <!-- Webmail Interface Screenshot (Dark / Light Mode) -->
              <div class="relative bg-slate-100 dark:bg-slate-950">
                <img 
                  src="/images/tachyon-modern-dark.png" 
                  alt="Tachyon Webmail Interface - Dark Mode" 
                  class="hidden dark:block w-full h-auto select-none"
                  width="2560"
                  height="1600"
                  fetchpriority="high"
                />
                <img 
                  src="/images/tachyon-modern-light.png" 
                  alt="Tachyon Webmail Interface - Light Mode" 
                  class="block dark:hidden w-full h-auto select-none"
                  width="2560"
                  height="1600"
                  fetchpriority="high"
                />
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
        this.onOpenReleaseModal(this.stableRelease);
      });
    }

    const preChangelogBtn = document.getElementById('hero-prerelease-changelog-btn');
    if (preChangelogBtn) {
      preChangelogBtn.addEventListener('click', () => {
        if (this.prerelease) {
          this.onOpenReleaseModal(this.prerelease);
        }
      });
    }

    const preCtaBtn = document.getElementById('hero-prerelease-cta-btn');
    if (preCtaBtn) {
      preCtaBtn.addEventListener('click', () => {
        if (this.prerelease) {
          this.onOpenReleaseModal(this.prerelease);
        }
      });
    }

    const copyBtn = document.getElementById('hero-copy-cmd-btn');
    const copyIcon = document.getElementById('hero-copy-icon');
    const copiedIcon = document.getElementById('hero-copied-icon');

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const cmd = 'docker run -d -p 8080:8888 ghcr.io/kimusan/tachyon:latest';
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
