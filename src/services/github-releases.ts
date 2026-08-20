import { FALLBACK_RELEASE, ReleaseInfo, ReleaseAsset, PROJECT_CONFIG } from '../config/project-info';

const CACHE_KEY = 'tachyon_latest_release';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface CachedReleaseData {
  timestamp: number;
  data: ReleaseInfo;
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

  public static async getLatestRelease(): Promise<ReleaseInfo> {
    // 1. Check local cache
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: CachedReleaseData = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          return parsed.data;
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    // 2. Fetch live from GitHub API
    try {
      const response = await fetch(`https://api.github.com/repos/${PROJECT_CONFIG.githubRepo}/releases/latest`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        console.warn(`GitHub API returned status ${response.status}. Using fallback release data.`);
        return FALLBACK_RELEASE;
      }

      const json = await response.json();
      
      const assets: ReleaseAsset[] = (json.assets || []).map((a: any) => ({
        name: a.name,
        downloadUrl: a.browser_download_url,
        size: this.formatBytes(a.size),
        type: this.parseAssetType(a.name)
      }));

      // Find primary tarball and zipball
      const tarAsset = assets.find(a => a.name.match(/^tachyon-[\d.]+\.tar\.gz$/i));
      const zipAsset = assets.find(a => a.name.match(/^tachyon-[\d.]+\.zip$/i));

      const releaseInfo: ReleaseInfo = {
        version: json.tag_name || json.name || FALLBACK_RELEASE.version,
        name: json.name || json.tag_name || FALLBACK_RELEASE.name,
        publishedAt: json.published_at ? json.published_at.split('T')[0] : FALLBACK_RELEASE.publishedAt,
        htmlUrl: json.html_url || FALLBACK_RELEASE.htmlUrl,
        body: json.body || FALLBACK_RELEASE.body,
        assets,
        tarballUrl: tarAsset ? tarAsset.downloadUrl : (json.tarball_url || FALLBACK_RELEASE.tarballUrl),
        zipballUrl: zipAsset ? zipAsset.downloadUrl : (json.zipball_url || FALLBACK_RELEASE.zipballUrl)
      };

      // Save to cache
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data: releaseInfo
        }));
      } catch {
        // Ignore localStorage write error
      }

      return releaseInfo;
    } catch (error) {
      console.warn('Failed to fetch latest GitHub release. Falling back to static data.', error);
      return FALLBACK_RELEASE;
    }
  }

  public static async getAllReleases(limit = 5): Promise<ReleaseInfo[]> {
    try {
      const response = await fetch(`https://api.github.com/repos/${PROJECT_CONFIG.githubRepo}/releases?per_page=${limit}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        return [FALLBACK_RELEASE];
      }

      const releases = await response.json();
      if (!Array.isArray(releases)) return [FALLBACK_RELEASE];

      return releases.map((json: any) => ({
        version: json.tag_name || json.name,
        name: json.name || json.tag_name,
        publishedAt: json.published_at ? json.published_at.split('T')[0] : '',
        htmlUrl: json.html_url,
        body: json.body || '',
        assets: (json.assets || []).map((a: any) => ({
          name: a.name,
          downloadUrl: a.browser_download_url,
          size: this.formatBytes(a.size),
          type: this.parseAssetType(a.name)
        })),
        tarballUrl: json.tarball_url || '',
        zipballUrl: json.zipball_url || ''
      }));
    } catch {
      return [FALLBACK_RELEASE];
    }
  }
}
