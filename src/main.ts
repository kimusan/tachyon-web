import './styles/main.css';
import './services/theme';
import { GitHubReleasesService } from './services/github-releases';
import { FALLBACK_RELEASE, ReleaseInfo } from './config/project-info';

import { NavbarComponent } from './components/Navbar';
import { HeroComponent } from './components/Hero';
import { FeaturesComponent } from './components/Features';
import { LineageHistoryComponent } from './components/LineageHistory';
import { InstallTabsComponent } from './components/InstallTabs';
import { ComparisonTableComponent } from './components/ComparisonTable';
import { DocsViewerComponent } from './components/DocsViewer';
import { ReleaseModalComponent } from './components/ReleaseModal';
import { IssueTrackerCTAComponent } from './components/IssueTrackerCTA';
import { FooterComponent } from './components/Footer';

class App {
  private currentRelease: ReleaseInfo = FALLBACK_RELEASE;
  private navbar: NavbarComponent;
  private hero: HeroComponent;
  private features: FeaturesComponent;
  private history: LineageHistoryComponent;
  private installTabs: InstallTabsComponent;
  private comparisonTable: ComparisonTableComponent;
  private docsViewer: DocsViewerComponent;
  private releaseModal: ReleaseModalComponent;
  private issueTrackerCTA: IssueTrackerCTAComponent;
  private footer: FooterComponent;

  constructor() {
    this.releaseModal = new ReleaseModalComponent(this.currentRelease);
    this.navbar = new NavbarComponent(() => this.releaseModal.open());
    this.hero = new HeroComponent(this.currentRelease, () => this.releaseModal.open());
    this.features = new FeaturesComponent();
    this.history = new LineageHistoryComponent();
    this.installTabs = new InstallTabsComponent();
    this.comparisonTable = new ComparisonTableComponent();
    this.docsViewer = new DocsViewerComponent();
    this.issueTrackerCTA = new IssueTrackerCTAComponent();
    this.footer = new FooterComponent();
  }

  public async init() {
    this.render();
    this.bindRouting();
    this.fetchLatestRelease();
  }

  private render() {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    const hash = window.location.hash;
    const isDocs = hash.startsWith('#/docs');

    appEl.innerHTML = `
      ${this.navbar.render()}
      
      <div id="main-view-container">
        ${isDocs ? this.docsViewer.render() : this.renderLandingPage()}
      </div>

      ${this.footer.render()}
      ${this.releaseModal.render()}
    `;

    this.bindEvents(isDocs);
  }

  private renderLandingPage(): string {
    return `
      <main>
        ${this.hero.render()}
        ${this.features.render()}
        ${this.history.render()}
        ${this.installTabs.render()}
        ${this.comparisonTable.render()}
        ${this.issueTrackerCTA.render()}
      </main>
    `;
  }

  private bindEvents(isDocs: boolean) {
    this.navbar.bindEvents();
    this.releaseModal.bindEvents();

    if (isDocs) {
      this.docsViewer.bindEvents();
      const slug = this.getDocSlugFromHash();
      this.docsViewer.loadPage(slug);
    } else {
      this.hero.bindEvents();
      this.installTabs.bindEvents();
    }
  }

  private getDocSlugFromHash(): string {
    const hash = window.location.hash;
    if (hash.startsWith('#/docs/')) {
      const rawSlug = hash.substring(7);
      return decodeURIComponent(rawSlug.split('?')[0].split('#')[0]) || 'Home';
    }
    return 'Home';
  }

  private bindRouting() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash;
      const isDocs = hash.startsWith('#/docs');
      const container = document.getElementById('main-view-container');

      if (isDocs) {
        if (!document.getElementById('docs-viewer-container')) {
          if (container) {
            container.innerHTML = this.docsViewer.render();
            this.docsViewer.bindEvents();
          }
        }
        const slug = this.getDocSlugFromHash();
        this.docsViewer.loadPage(slug);
      } else {
        // If transitioning from Docs back to Landing Page
        if (!document.getElementById('features')) {
          if (container) {
            container.innerHTML = this.renderLandingPage();
            this.hero.bindEvents();
            this.installTabs.bindEvents();
          }
        }

        // Smooth scroll to section if standard anchor
        if (hash && !hash.startsWith('#/')) {
          const targetId = hash.substring(1);
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  }

  private async fetchLatestRelease() {
    try {
      const release = await GitHubReleasesService.getLatestRelease();
      this.currentRelease = release;
      this.navbar.setVersion(release.version);
      this.hero.updateRelease(release);
      this.releaseModal.setRelease(release);
    } catch (err) {
      console.warn('Could not fetch live GitHub release, using fallback.', err);
    }
  }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
