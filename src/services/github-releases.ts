import { FALLBACK_RELEASE, FALLBACK_PRERELEASE, ReleaseInfo, ReleaseAsset, ReleasesSummary, PROJECT_CONFIG } from '../config/project-info';

const CACHE_KEY = 'tachyon_releases_summary';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface CachedReleasesData {
  timestamp: number;
  data: ReleasesSummary;
}

export class GitHubReleasesService {
  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  private static parseAssetType(name: string): ReleaseAsset['type'] {
    if (name.endsWith('nextcloud.tar.gz')) return 'nextcloud';
    if (name.endsWith('owncloud.tar.gz')) return 'owncloud';
    if (name.endsWith('.deb')) return 'deb';
    if (name.endsWith('.tar.gz') || name.endsWith('.tgz')) return 'tar';
    if (name.endsWith('.zip')) return 'zip';
    if (name.includes('plugin') || name.endsWith('.tgz')) return 'plugin';
    return 'other';
  }

  private static mapReleaseJson(json: any): ReleaseInfo {
    const assets: ReleaseAsset[] = (json.assets || []).map((a: any) => ({
      name: a.name,
      downloadUrl: a.browser_download_url,
      size: this.formatBytes(a.size),
      type: this.parseAssetType(a.name)
    }));

    const tarAsset = assets.find(a => a.name.match(/^tachyon-[\d.]+(-nextcloud|-owncloud)?\.(tar\.gz|tgz)$/i) || a.name.endsWith('.tar.gz'));
    const zipAsset = assets.find(a => a.name.match(/^tachyon-[\d.]+\.zip$/i) || a.name.endsWith('.zip'));

    return {
      version: json.tag_name || json.name || 'v3.2.8',
      name: json.name || json.tag_name || 'Tachyon Release',
      publishedAt: json.published_at ? json.published_at.split('T')[0] : '',
      htmlUrl: json.html_url || PROJECT_CONFIG.githubUrl,
      body: json.body || '',
      assets,
      tarballUrl: tarAsset ? tarAsset.downloadUrl : (json.tarball_url || ''),
      zipballUrl: zipAsset ? zipAsset.downloadUrl : (json.zipball_url || ''),
      isPrerelease: Boolean(json.prerelease)
    };
  }

  public static async getReleasesSummary(): Promise<ReleasesSummary> {
    // 1. Check local cache
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: CachedReleasesData = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.data.stable) {
          return parsed.data;
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    // 2. Fetch live from GitHub API (releases list gives both stable & pre-releases)
    try {
      const response = await fetch(`https://api.github.com/repos/${PROJECT_CONFIG.githubRepo}/releases?per_page=20`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        console.warn(`GitHub API returned status ${response.status}. Using fallback release data.`);
        return {
          stable: FALLBACK_RELEASE,
          prerelease: FALLBACK_PRERELEASE
        };
      }

      const releasesJson = await response.json();
      if (!Array.isArray(releasesJson) || releasesJson.length === 0) {
        return {
          stable: FALLBACK_RELEASE,
          prerelease: FALLBACK_PRERELEASE
        };
      }

      const parsedReleases = releasesJson
        .filter((r: any) => !r.draft)
        .map((r: any) => this.mapReleaseJson(r));

      const stable = parsedReleases.find(r => !r.isPrerelease) || FALLBACK_RELEASE;
      const prerelease = parsedReleases.find(r => r.isPrerelease) || null;

      const summary: ReleasesSummary = {
        stable,
        prerelease
      };

      // Save to cache
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data: summary
        }));
      } catch {
        // Ignore localStorage error
      }

      return summary;
    } catch (error) {
      console.warn('Failed to fetch GitHub releases. Falling back to static data.', error);
      return {
        stable: FALLBACK_RELEASE,
        prerelease: FALLBACK_PRERELEASE
      };
    }
  }

  public static async getLatestRelease(): Promise<ReleaseInfo> {
    const summary = await this.getReleasesSummary();
    return summary.stable;
  }
}
