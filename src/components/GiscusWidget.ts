import { themeService, Theme } from '../services/theme';
import { PROJECT_CONFIG } from '../config/project-info';

export interface GiscusWidgetOptions {
  containerId: string;
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  term?: string;
  category?: string;
  categoryId?: string;
  strict?: '0' | '1';
  reactionsEnabled?: '0' | '1';
  emitMetadata?: '0' | '1';
  inputPosition?: 'top' | 'bottom';
  lang?: string;
}

export class GiscusWidget {
  private options: GiscusWidgetOptions;
  private unsubscribeTheme: (() => void) | null = null;

  constructor(options: GiscusWidgetOptions) {
    this.options = {
      mapping: 'pathname',
      category: 'General',
      strict: '0',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'top',
      lang: 'en',
      ...options
    };
  }

  private getGiscusTheme(theme: Theme): string {
    return theme === 'dark' ? 'dark_dimmed' : 'light';
  }

  public render(): string {
    return `
      <div id="${this.options.containerId}" class="giscus-wrapper min-h-[160px] relative">
        <div class="giscus-loading flex items-center justify-center py-8 text-slate-400 text-sm gap-2">
          <svg class="animate-spin w-5 h-5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          <span>Loading discussions from GitHub...</span>
        </div>
      </div>
    `;
  }

  public mount() {
    const container = document.getElementById(this.options.containerId);
    if (!container) return;

    // Clear existing children
    container.innerHTML = '';

    const currentTheme = themeService.getTheme();
    const giscusTheme = this.getGiscusTheme(currentTheme);

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', PROJECT_CONFIG.githubRepo);
    script.setAttribute('data-repo-id', 'R_kgDOTJXgFA');
    script.setAttribute('data-category', this.options.category || 'General');
    if (this.options.categoryId) {
      script.setAttribute('data-category-id', this.options.categoryId);
    }
    script.setAttribute('data-mapping', this.options.mapping || 'pathname');
    if (this.options.term) {
      script.setAttribute('data-term', this.options.term);
    }
    script.setAttribute('data-strict', this.options.strict || '0');
    script.setAttribute('data-reactions-enabled', this.options.reactionsEnabled || '1');
    script.setAttribute('data-emit-metadata', this.options.emitMetadata || '0');
    script.setAttribute('data-input-position', this.options.inputPosition || 'top');
    script.setAttribute('data-theme', giscusTheme);
    script.setAttribute('data-lang', this.options.lang || 'en');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    container.appendChild(script);

    // Sync theme dynamically when user toggles dark/light mode
    if (this.unsubscribeTheme) {
      this.unsubscribeTheme();
    }

    this.unsubscribeTheme = themeService.subscribe((theme) => {
      this.updateTheme(theme);
    });
  }

  private updateTheme(theme: Theme) {
    const iframe = document.querySelector<HTMLIFrameElement>(`#${this.options.containerId} iframe.giscus-frame`);
    if (!iframe || !iframe.contentWindow) return;

    const giscusTheme = this.getGiscusTheme(theme);
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: giscusTheme } } },
      'https://giscus.app'
    );
  }

  public destroy() {
    if (this.unsubscribeTheme) {
      this.unsubscribeTheme();
      this.unsubscribeTheme = null;
    }
    const container = document.getElementById(this.options.containerId);
    if (container) {
      container.innerHTML = '';
    }
  }
}
