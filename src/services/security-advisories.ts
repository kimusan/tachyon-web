import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { PROJECT_CONFIG } from '../config/project-info';
import FALLBACK_ADVISORIES_RAW from '../data/fallback-advisories.json';

export interface SecurityAdvisory {
  ghsaId: string;
  cveId: string | null;
  summary: string;
  description: string;
  htmlDescription: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  publishedAt: string;
  formattedDate: string;
  htmlUrl: string;
  vulnerableVersionRange: string;
  patchedVersions: string;
  reporter: string | null;
  cvssScore: number | null;
  cvssVector: string | null;
}

const CACHE_KEY = 'tachyon_security_advisories';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export class SecurityAdvisoriesService {
  private static cachedAdvisories: SecurityAdvisory[] | null = null;

  private static formatDate(dateStr: string): string {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  private static async processRawAdvisory(item: any): Promise<SecurityAdvisory> {
    const desc = item.description || '';
    const parsed = await marked.parse(desc);
    const sanitized = DOMPurify.sanitize(parsed, {
      ADD_ATTR: ['target', 'rel', 'id']
    });

    const ghsaId = item.ghsaId || item.ghsa_id || '';
    const publishedAt = item.publishedAt || item.published_at || new Date().toISOString();

    const vulnerabilities = item.vulnerabilities || [];
    const firstVuln = vulnerabilities[0] || {};
    const vulnerableVersionRange = item.vulnerableVersionRange || firstVuln.vulnerable_version_range || '< 4.4.0';
    const patchedVersions = item.patchedVersions || firstVuln.patched_versions || '4.4.0';

    const reporter = item.reporter || item.credits?.[0]?.login || null;
    const cvssScore = item.cvssScore ?? item.cvss?.score ?? item.cvss_severities?.cvss_v3?.score ?? null;
    const cvssVector = item.cvssVector ?? item.cvss?.vector_string ?? item.cvss_severities?.cvss_v3?.vector_string ?? null;

    return {
      ghsaId,
      cveId: item.cveId || item.cve_id || null,
      summary: item.summary || 'Security Advisory',
      description: desc,
      htmlDescription: sanitized,
      severity: (item.severity?.toLowerCase() || 'medium') as SecurityAdvisory['severity'],
      publishedAt,
      formattedDate: this.formatDate(publishedAt),
      htmlUrl: item.htmlUrl || item.html_url || `https://github.com/${PROJECT_CONFIG.githubRepo}/security/advisories/${ghsaId}`,
      vulnerableVersionRange,
      patchedVersions,
      reporter,
      cvssScore,
      cvssVector
    };
  }

  public static async getAdvisories(): Promise<SecurityAdvisory[]> {
    if (this.cachedAdvisories) {
      return this.cachedAdvisories;
    }

    // Try reading from localStorage cache
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS && Array.isArray(parsed.data)) {
          this.cachedAdvisories = parsed.data;
          return parsed.data;
        }
      }
    } catch (e) {
      console.warn('Could not read cached security advisories', e);
    }

    try {
      const response = await fetch(`https://api.github.com/repos/${PROJECT_CONFIG.githubRepo}/security-advisories`, {
        headers: {
          'Accept': 'application/vnd.github+json'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API returned status ${response.status}`);
      }

      const rawItems = await response.json();
      if (!Array.isArray(rawItems) || rawItems.length === 0) {
        throw new Error('Invalid advisory response or empty array');
      }

      const processed = await Promise.all(rawItems.map(item => this.processRawAdvisory(item)));
      processed.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      this.cachedAdvisories = processed;

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data: processed
        }));
      } catch {
        // LocalStorage quota or access issue
      }

      return processed;
    } catch (err) {
      console.warn('Failed to fetch live security advisories from GitHub, falling back to static dataset.', err);

      const fallbackProcessed = await Promise.all(
        (FALLBACK_ADVISORIES_RAW as any[]).map(item => this.processRawAdvisory(item))
      );
      fallbackProcessed.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      this.cachedAdvisories = fallbackProcessed;
      return fallbackProcessed;
    }
  }
}
