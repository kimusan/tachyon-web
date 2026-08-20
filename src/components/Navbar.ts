import { icons } from '../assets/icons';
import { themeService } from '../services/theme';
import { PROJECT_CONFIG } from '../config/project-info';

export class NavbarComponent {
  private latestVersion: string = 'v3.2.5';
  private onOpenReleaseModal: () => void;

  constructor(onOpenReleaseModal: () => void) {
    this.onOpenReleaseModal = onOpenReleaseModal;
  }

  public setVersion(version: string) {
    this.latestVersion = version;
    const badge = document.getElementById('nav-version-badge');
    if (badge) {
      badge.textContent = this.latestVersion;
    }
    const mobileBadge = document.getElementById('nav-version-badge-mobile');
    if (mobileBadge) {
      mobileBadge.textContent = this.latestVersion;
    }
  }

  public render(): string {
    return `
      <header class="sticky top-0 z-40 w-full glass-panel border-b transition-colors duration-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            
            <!-- Logo & Brand -->
            <div class="flex items-center gap-3">
              <a href="#" class="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-xl tracking-tight group">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                  ${icons.zap('w-5 h-5')}
                </div>
                <span>Tachyon</span>
              </a>

              <!-- Version Pill Button -->
              <button 
                id="nav-release-btn"
                class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors"
                title="View Release Notes"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span id="nav-version-badge">${this.latestVersion}</span>
              </button>
            </div>

            <!-- Desktop Nav Links -->
            <nav class="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
              <a href="#features" class="px-3 py-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">Features</a>
              <a href="#history" class="px-3 py-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">Lineage</a>
              <a href="#install" class="px-3 py-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">Install</a>
              <a href="#comparison" class="px-3 py-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">Compare</a>
              <a href="#/docs" class="px-3 py-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold">
                ${icons.bookOpen('w-4 h-4')}
                <span>Docs</span>
              </a>
            </nav>

            <!-- Actions (Theme Toggle, GitHub, Mobile Menu) -->
            <div class="flex items-center gap-2.5">
              
              <!-- Theme Toggle Button -->
              <button 
                id="theme-toggle-btn"
                class="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
                title="Toggle Theme"
              >
                <span class="dark:hidden">${icons.moon('w-5 h-5')}</span>
                <span class="hidden dark:inline">${icons.sun('w-5 h-5')}</span>
              </button>

              <!-- GitHub Link -->
              <a 
                href="${PROJECT_CONFIG.githubUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              >
                ${icons.github('w-4 h-4')}
                <span>GitHub</span>
              </a>

              <!-- Mobile Menu Toggle -->
              <button 
                id="mobile-menu-btn"
                class="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Open menu"
              >
                <span id="menu-icon-open">${icons.menu('w-6 h-6')}</span>
                <span id="menu-icon-close" class="hidden">${icons.close('w-6 h-6')}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Drawer -->
        <div id="mobile-menu" class="hidden md:hidden border-t border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg">
          <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Latest Release</span>
            <button 
              id="mobile-nav-release-btn"
              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span id="nav-version-badge-mobile">${this.latestVersion}</span>
            </button>
          </div>
          <a href="#features" class="mobile-nav-link block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Features</a>
          <a href="#history" class="mobile-nav-link block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Lineage & History</a>
          <a href="#install" class="mobile-nav-link block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Install Guide</a>
          <a href="#comparison" class="mobile-nav-link block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Comparison</a>
          <a href="#/docs" class="mobile-nav-link block px-3 py-2 rounded-lg text-base font-medium text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-2">
            ${icons.bookOpen('w-5 h-5')}
            <span>Documentation (Live Wiki)</span>
          </a>
          <div class="pt-2">
            <a 
              href="${PROJECT_CONFIG.githubUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            >
              ${icons.github('w-5 h-5')}
              <span>View Source on GitHub</span>
            </a>
          </div>
        </div>
      </header>
    `;
  }

  public bindEvents() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        themeService.toggle();
      });
    }

    const releaseBtn = document.getElementById('nav-release-btn');
    if (releaseBtn) {
      releaseBtn.addEventListener('click', () => {
        this.onOpenReleaseModal();
      });
    }

    const mobileReleaseBtn = document.getElementById('mobile-nav-release-btn');
    if (mobileReleaseBtn) {
      mobileReleaseBtn.addEventListener('click', () => {
        this.onOpenReleaseModal();
        this.closeMobileMenu();
      });
    }

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.toggle('hidden');
        if (iconOpen && iconClose) {
          iconOpen.classList.toggle('hidden', !isHidden);
          iconClose.classList.toggle('hidden', isHidden);
        }
      });
    }

    // Close mobile menu on clicking any link
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });
  }

  private closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      if (iconOpen && iconClose) {
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
      }
    }
  }
}
