import { icons } from '../assets/icons';
import { ReleaseInfo, ReleaseAsset, FALLBACK_RELEASE, FALLBACK_PRERELEASE } from '../config/project-info';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export class ReleaseModalComponent {
  private stableRelease: ReleaseInfo = FALLBACK_RELEASE;
  private prerelease: ReleaseInfo | null = FALLBACK_PRERELEASE;
  private activeTab: 'stable' | 'prerelease' = 'stable';
  private isOpen: boolean = false;

  constructor(stable: ReleaseInfo, prerelease: ReleaseInfo | null = null) {
    this.stableRelease = stable;
    this.prerelease = prerelease;
  }

  public setReleases(stable: ReleaseInfo, prerelease: ReleaseInfo | null) {
    this.stableRelease = stable;
    this.prerelease = prerelease;
    if (this.isOpen) {
      this.renderContent();
    }
  }

  public setRelease(release: ReleaseInfo) {
    if (release.isPrerelease) {
      this.prerelease = release;
      this.activeTab = 'prerelease';
    } else {
      this.stableRelease = release;
      this.activeTab = 'stable';
    }
    if (this.isOpen) {
      this.renderContent();
    }
  }

  public open(targetRelease?: ReleaseInfo) {
    if (targetRelease) {
      if (targetRelease.isPrerelease) {
        this.prerelease = targetRelease;
        this.activeTab = 'prerelease';
      } else {
        this.stableRelease = targetRelease;
        this.activeTab = 'stable';
      }
    }

    this.isOpen = true;
    const modalEl = document.getElementById('release-modal-overlay');
    if (modalEl) {
      modalEl.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      this.renderContent();
    }
  }

  public close() {
    this.isOpen = false;
    const modalEl = document.getElementById('release-modal-overlay');
    if (modalEl) {
      modalEl.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  public render(): string {
    return `
      <div 
        id="release-modal-overlay" 
        class="fixed inset-0 z-50 hidden bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      >
        <div 
          id="release-modal-card"
          class="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
        >
          <div id="release-modal-inner">
            ${this.getModalInnerHtml()}
          </div>
        </div>
      </div>
    `;
  }

  private getCurrentRelease(): ReleaseInfo {
    if (this.activeTab === 'prerelease' && this.prerelease) {
      return this.prerelease;
    }
    return this.stableRelease;
  }

  private getModalInnerHtml(): string {
    const current = this.getCurrentRelease();
    const rawBody = current.body || 'No release notes provided.';
    const parsedBody = DOMPurify.sanitize(marked.parse(rawBody) as string);
    const isPre = current.isPrerelease;

    return `
      <!-- Modal Header -->
      <div class="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-4">
        
        <div class="flex items-center justify-between">
          
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
              isPre ? 'bg-amber-500 text-white' : 'bg-brand-500 text-white'
            }">
              ${current.version}
            </span>

            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
              isPre 
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800' 
                : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
            }">
              ${isPre ? icons.flask('w-3 h-3') : icons.badgeCheck('w-3 h-3')}
              <span>${isPre ? 'Pre-Release' : 'Latest Stable'}</span>
            </span>

            <span class="text-xs text-slate-500 dark:text-slate-400">
              Published on ${current.publishedAt || 'GitHub'}
            </span>
          </div>

          <button 
            id="release-modal-close-btn"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            ${icons.close('w-5 h-5')}
          </button>
        </div>

        <!-- Release Switcher Tabs (If pre-release is available) -->
        ${this.prerelease ? `
          <div class="flex items-center gap-2 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 max-w-sm">
            <button 
              id="modal-tab-stable"
              class="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                this.activeTab === 'stable' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Stable (${this.stableRelease.version})</span>
            </button>

            <button 
              id="modal-tab-prerelease"
              class="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                this.activeTab === 'prerelease' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }"
            >
              ${icons.flask('w-3 h-3 text-amber-500')}
              <span>Pre-release (${this.prerelease.version})</span>
            </button>
          </div>
        ` : ''}

      </div>

      <!-- Modal Body -->
      <div class="p-6 max-h-[60vh] overflow-y-auto space-y-6">
        
        <!-- Release Notes -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Changelog & Release Notes
          </h4>
          <div class="prose-custom text-sm">
            ${parsedBody}
          </div>
        </div>

        <!-- Download Packages & Assets -->
        <div class="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Download Assets (${current.assets.length})
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${current.assets.map(asset => `
              <a 
                href="${asset.downloadUrl}"
                target="_blank"
                class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-cyan-400 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between group transition-all"
              >
                <div class="flex items-center gap-2.5 overflow-hidden">
                  <span class="text-brand-500 dark:text-cyan-400">${this.getAssetIcon(asset.type)}</span>
                  <div class="text-xs truncate">
                    <div class="font-medium text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-300 truncate">
                      ${asset.name}
                    </div>
                    <div class="text-slate-400 text-[11px]">${asset.size}</div>
                  </div>
                </div>
                ${icons.download('w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors flex-shrink-0')}
              </a>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
        <a 
          href="${current.htmlUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-semibold text-brand-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
        >
          <span>View ${current.version} on GitHub</span>
          ${icons.externalLink('w-3.5 h-3.5')}
        </a>

        <button 
          id="release-modal-done-btn"
          class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          Close
        </button>
      </div>
    `;
  }

  private getAssetIcon(type: ReleaseAsset['type']): string {
    switch (type) {
      case 'deb':
        return icons.server('w-4 h-4');
      case 'nextcloud':
      case 'owncloud':
        return icons.layers('w-4 h-4');
      case 'tar':
      case 'zip':
        return icons.packageIcon('w-4 h-4');
      default:
        return icons.packageIcon('w-4 h-4');
    }
  }

  private renderContent() {
    const innerEl = document.getElementById('release-modal-inner');
    if (innerEl) {
      innerEl.innerHTML = this.getModalInnerHtml();
      this.bindEvents();
    }
  }

  public bindEvents() {
    const overlay = document.getElementById('release-modal-overlay');
    const closeBtn = document.getElementById('release-modal-close-btn');
    const doneBtn = document.getElementById('release-modal-done-btn');

    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (doneBtn) doneBtn.addEventListener('click', () => this.close());

    const stableTab = document.getElementById('modal-tab-stable');
    if (stableTab) {
      stableTab.addEventListener('click', () => {
        this.activeTab = 'stable';
        this.renderContent();
      });
    }

    const preTab = document.getElementById('modal-tab-prerelease');
    if (preTab) {
      preTab.addEventListener('click', () => {
        this.activeTab = 'prerelease';
        this.renderContent();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.close();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }
}
