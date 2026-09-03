import './styles/main.css';
import './services/theme';
import { GitHubReleasesService } from './services/github-releases';
import { FALLBACK_RELEASE, FALLBACK_PRERELEASE, ReleaseInfo } from './config/project-info';

import { NavbarComponent } from './components/Navbar';
import { HeroComponent } from './components/Hero';
import { FeaturesComponent } from './components/Features';
import { LineageHistoryComponent } from './components/LineageHistory';
import { InstallTabsComponent } from './components/InstallTabs';
import { ComparisonTableComponent } from './components/ComparisonTable';
import { LatestNewsSectionComponent } from './components/LatestNewsSection';
import { AboutMaintainerComponent } from './components/AboutMaintainer';
import { DocsViewerComponent } from './components/DocsViewer';
import { CommunityViewComponent } from './components/CommunityView';
import { NewsHubComponent } from './components/NewsHub';
import { NewsArticleComponent } from './components/NewsArticle';
import { ReleaseModalComponent } from './components/ReleaseModal';
import { IssueTrackerCTAComponent } from './components/IssueTrackerCTA';
import { FooterComponent } from './components/Footer';

class App {
  private currentStableRelease: ReleaseInfo = FALLBACK_RELEASE;
  private currentPreRelease: ReleaseInfo | null = FALLBACK_PRERELEASE;
  private navbar: NavbarComponent;
  private hero: HeroComponent;
  private features: FeaturesComponent;
  private history: LineageHistoryComponent;
  private installTabs: InstallTabsComponent;
  private comparisonTable: ComparisonTableComponent;
  private latestNews: LatestNewsSectionComponent;
  private aboutMaintainer: AboutMaintainerComponent;
  private docsViewer: DocsViewerComponent;
  private communityView: CommunityViewComponent;
  private newsHub: NewsHubComponent;
  private newsArticle: NewsArticleComponent;
  private releaseModal: ReleaseModalComponent;
  private issueTrackerCTA: IssueTrackerCTAComponent;
  private footer: FooterComponent;

  constructor() {
    this.releaseModal = new ReleaseModalComponent(this.currentStableRelease, this.currentPreRelease);
    this.navbar = new NavbarComponent((rel) => this.releaseModal.open(rel));
    this.hero = new HeroComponent(
      this.currentStableRelease, 
      this.currentPreRelease, 
      (rel) => this.releaseModal.open(rel)
    );
    this.features = new FeaturesComponent();
    this.history = new LineageHistoryComponent();
    this.installTabs = new InstallTabsComponent(this.currentStableRelease);
    this.comparisonTable = new ComparisonTableComponent();
    this.latestNews = new LatestNewsSectionComponent();
    this.aboutMaintainer = new AboutMaintainerComponent();
    this.docsViewer = new DocsViewerComponent();
    this.communityView = new CommunityViewComponent();
    this.newsHub = new NewsHubComponent();
    this.newsArticle = new NewsArticleComponent();
    this.issueTrackerCTA = new IssueTrackerCTAComponent();
    this.footer = new FooterComponent();
  }

  public async init() {
    this.render();
    this.bindRouting();
    this.fetchReleases();
  }

  private render() {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    const hash = window.location.hash;
    const isDocs = hash.startsWith('#/docs');
    const isCommunity = hash.startsWith('#/community') || hash.startsWith('#/discussions');
    const isNewsArticle = hash.startsWith('#/news/') && hash.length > 8;
    const isNewsHub = hash.startsWith('#/news') && !isNewsArticle;

    let mainContentHtml = this.renderLandingPage();
    if (isDocs) {
      mainContentHtml = this.docsViewer.render();
    } else if (isCommunity) {
      mainContentHtml = this.communityView.render();
    } else if (isNewsArticle) {
      mainContentHtml = this.newsArticle.render();
    } else if (isNewsHub) {
      mainContentHtml = this.newsHub.render();
    }

    appEl.innerHTML = `
      ${this.navbar.render()}
      
      <div id="main-view-container">
        ${mainContentHtml}
      </div>

      ${this.footer.render()}
      ${this.releaseModal.render()}
    `;

    this.bindEvents(isDocs, isCommunity, isNewsHub, isNewsArticle);
  }

  private renderLandingPage(): string {
    return `
      <main>
        ${this.hero.render()}
        ${this.features.render()}
        ${this.history.render()}
        ${this.installTabs.render()}
        ${this.comparisonTable.render()}
        ${this.latestNews.render()}
        ${this.aboutMaintainer.render()}
        ${this.issueTrackerCTA.render()}
      </main>
    `;
  }

  private bindEvents(isDocs: boolean, isCommunity: boolean, isNewsHub: boolean, isNewsArticle: boolean) {
    this.navbar.bindEvents();
    this.releaseModal.bindEvents();

    if (isDocs) {
      this.docsViewer.bindEvents();
      const slug = this.getDocSlugFromHash();
      this.docsViewer.loadPage(slug);
    } else if (isCommunity) {
      this.communityView.mount();
    } else if (isNewsArticle) {
      const slug = this.getNewsSlugFromHash();
      this.newsArticle.loadArticle(slug);
    } else if (isNewsHub) {
      this.newsHub.loadData();
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

  private getNewsSlugFromHash(): string {
    const hash = window.location.hash;
    if (hash.startsWith('#/news/')) {
      const rawSlug = hash.substring(8);
      return decodeURIComponent(rawSlug.split('?')[0].split('#')[0]) || '';
    }
    return '';
  }

  private bindRouting() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash;
      const isDocs = hash.startsWith('#/docs');
      const isCommunity = hash.startsWith('#/community') || hash.startsWith('#/discussions');
      const isNewsArticle = hash.startsWith('#/news/') && hash.length > 8;
      const isNewsHub = hash.startsWith('#/news') && !isNewsArticle;
      const container = document.getElementById('main-view-container');

      if (!container) return;

      // Cleanup prior views
      this.docsViewer.destroy();
      this.communityView.destroy();
      this.newsArticle.destroy();

      if (isDocs) {
        container.innerHTML = this.docsViewer.render();
        this.docsViewer.bindEvents();
        const slug = this.getDocSlugFromHash();
        this.docsViewer.loadPage(slug);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (isCommunity) {
        container.innerHTML = this.communityView.render();
        this.communityView.mount();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (isNewsArticle) {
        container.innerHTML = this.newsArticle.render();
        const slug = this.getNewsSlugFromHash();
        this.newsArticle.loadArticle(slug);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (isNewsHub) {
        container.innerHTML = this.newsHub.render();
        this.newsHub.loadData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        container.innerHTML = this.renderLandingPage();
        this.hero.bindEvents();
        this.installTabs.bindEvents();

        // Smooth scroll to section if standard anchor (e.g. #features)
        if (hash && !hash.startsWith('#/')) {
          const targetId = hash.substring(1);
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
  }

  private async fetchReleases() {
    try {
      const summary = await GitHubReleasesService.getReleasesSummary();
      this.currentStableRelease = summary.stable;
      this.currentPreRelease = summary.prerelease;

      this.navbar.setReleases(summary.stable, summary.prerelease);
      this.hero.updateReleases(summary.stable, summary.prerelease);
      this.installTabs.updateRelease(summary.stable);
      this.releaseModal.setReleases(summary.stable, summary.prerelease);
    } catch (err) {
      console.warn('Could not fetch live GitHub releases, using fallback.', err);
    }
  }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
