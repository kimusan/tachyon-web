import { icons } from '../assets/icons';
import { ReleaseInfo, ReleaseAsset } from '../config/project-info';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export class ReleaseModalComponent {
  private release: ReleaseInfo;
  private isOpen: boolean = false;

  constructor(release: ReleaseInfo) {
    this.release = release;
  }

  public setRelease(release: ReleaseInfo) {
    this.release = release;
    if (this.isOpen) {
      this.renderContent();
    }
  }

  public open() {
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

  private getModalInnerHtml(): string {
    const rawBody = this.release.body || 'No release notes provided.';
    const parsedBody = DOMPurify.sanitize(marked.parse(rawBody) as string);

    return `
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-brand-500 text-white">
              ${this.release.version}
            </span>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">
              ${this.release.name}
            </h3>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Published on ${this.release.publishedAt || 'GitHub'}
          </p>
        </div>

        <button 
          id="release-modal-close-btn"
          class="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          ${icons.close('w-5 h-5')}
        </button>
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
            Download Assets
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${this.release.assets.map(asset => `
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
          href="${this.release.htmlUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-semibold text-brand-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
        >
          <span>View on GitHub Releases</span>
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
