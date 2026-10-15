import { PROJECT_CONFIG, ReleaseInfo } from '../config/project-info';
import { GitHubReleasesService } from './github-releases';

export interface LocaleTranslationStatus {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  percentage: number;
  translatedCount: number;
  missingCount: number;
  untranslatedCount: number;
  missingFrom: string;
}

export interface TranslationStatusReport {
  version: string;
  totalStrings: number;
  userStrings: number;
  adminStrings: number;
  totalLocales: number;
  fullyTranslatedLocales: number;
  locales: LocaleTranslationStatus[];
}

const LANGUAGE_META: Record<string, { name: string; nativeName: string; flag: string }> = {
  da: { name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  en: { name: 'English', nativeName: 'English (Source)', flag: '🇬🇧' },
  nl: { name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  pl: { name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  'pt-BR': { name: 'Portuguese (Brazil)', nativeName: 'Português do Brasil', flag: '🇧🇷' },
  ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  sv: { name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  nb: { name: 'Norwegian Bokmål', nativeName: 'Norsk Bokmål', flag: '🇳🇴' },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  zh: { name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  'zh-TW': { name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼' },
  fi: { name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  cs: { name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  sk: { name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
  sl: { name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮' },
  uk: { name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  bg: { name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  el: { name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  et: { name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪' },
  fa: { name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
  hu: { name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  is: { name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸' },
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  lt: { name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹' },
  lv: { name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻' },
  ro: { name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  tr: { name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  be: { name: 'Belarusian', nativeName: 'Беларуская', flag: '🇧🇾' },
  eu: { name: 'Basque', nativeName: 'Euskara', flag: '🇪🇸' }
};

const CACHE_KEY = 'tachyon_translation_status';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export class TranslationStatusService {
  private static parseTranslationStatusText(rawText: string, defaultVersion = 'Latest'): TranslationStatusReport {
    const lines = rawText.split('\n');
    
    let version = defaultVersion;
    let userStrings = 637;
    let adminStrings = 147;
    let totalStrings = 784;
    let totalLocales = 0;
    let fullyTranslatedLocales = 0;

    const locales: LocaleTranslationStatus[] = [];

    // Parse header lines
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
      const line = lines[i].trim();
      const versionMatch = line.match(/Tachyon\s+([\d.]+)\s+translation\s+status/i);
      if (versionMatch) {
        version = `v${versionMatch[1]}`;
      }

      const refMatch = line.match(/Reference\s+en:\s+(\d+)\s+user\s+\+\s+(\d+)\s+admin\s+strings/i);
      if (refMatch) {
        userStrings = parseInt(refMatch[1], 10);
        adminStrings = parseInt(refMatch[2], 10);
        totalStrings = userStrings + adminStrings;
      }

      const localesCountMatch = line.match(/(\d+)\s+of\s+(\d+)\s+locales\s+have\s+every\s+string\s+translated/i);
      if (localesCountMatch) {
        fullyTranslatedLocales = parseInt(localesCountMatch[1], 10);
        totalLocales = parseInt(localesCountMatch[2], 10);
      }
    }

    // Parse summary table rows until separator line
    let inTable = false;
    for (const line of lines) {
      if (line.includes('locale') && line.includes('complete') && line.includes('missing')) {
        inTable = true;
        continue;
      }
      if (line.startsWith('-----') || line.startsWith('=====')) {
        if (inTable) break; // Finished table section
      }

      if (inTable) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Matches: code  91.8%  64  30  CALENDAR 26, ...
        const match = trimmed.match(/^([a-zA-Z-]+)\s+([\d.]+)%\s+(\d+)\s+(\d+)(?:\s+(.*))?$/);
        if (match) {
          const code = match[1];
          const percentage = parseFloat(match[2]);
          const missingCount = parseInt(match[3], 10);
          const untranslatedCount = parseInt(match[4], 10);
          const missingFrom = match[5] || '';
          const translatedCount = Math.max(0, totalStrings - missingCount);

          const meta = LANGUAGE_META[code] || {
            name: code.toUpperCase(),
            nativeName: code,
            flag: '🌐'
          };

          locales.push({
            code,
            name: meta.name,
            nativeName: meta.nativeName,
            flag: meta.flag,
            percentage,
            translatedCount,
            missingCount,
            untranslatedCount,
            missingFrom
          });
        }
      }
    }

    // Always include English as reference if not in list
    if (!locales.find(l => l.code === 'en')) {
      locales.unshift({
        code: 'en',
        name: 'English',
        nativeName: 'English (Source)',
        flag: '🇬🇧',
        percentage: 100.0,
        translatedCount: totalStrings,
        missingCount: 0,
        untranslatedCount: 0,
        missingFrom: ''
      });
    }

    if (totalLocales === 0) {
      totalLocales = locales.length;
    }
    if (fullyTranslatedLocales === 0) {
      fullyTranslatedLocales = locales.filter(l => l.percentage === 100).length;
    }

    return {
      version,
      totalStrings,
      userStrings,
      adminStrings,
      totalLocales,
      fullyTranslatedLocales,
      locales
    };
  }

  public static async getTranslationStatus(latestRelease?: ReleaseInfo | null): Promise<TranslationStatusReport> {
    // 0. Automatically resolve latest stable release if not provided
    if (!latestRelease) {
      try {
        const summary = await GitHubReleasesService.getReleasesSummary();
        latestRelease = summary.stable;
      } catch (err) {
        console.warn('Could not determine latest release for translation status', err);
      }
    }

    const releaseVersion = latestRelease?.version || 'v4.4.3';
    const versionCacheKey = `${CACHE_KEY}_${releaseVersion}`;

    // 1. Check local cache for this specific release version
    try {
      const cached = localStorage.getItem(versionCacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.data) {
          return parsed.data;
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    // 2. Look for translation status asset in release
    let downloadUrl: string | null = null;

    if (latestRelease?.assets) {
      const statusAsset = latestRelease.assets.find(a => a.name.includes('translation-status.txt'));
      if (statusAsset) {
        downloadUrl = statusAsset.downloadUrl;
      }
    }

    if (!downloadUrl) {
      downloadUrl = `https://github.com/${PROJECT_CONFIG.githubRepo}/releases/download/${releaseVersion}/tachyon-${releaseVersion.replace(/^v/i, '')}-translation-status.txt`;
    }

    // 3. Fetch status file from the release
    try {
      const response = await fetch(downloadUrl);
      if (response.ok) {
        const text = await response.text();
        const report = this.parseTranslationStatusText(text, releaseVersion);

        try {
          localStorage.setItem(versionCacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: report
          }));
        } catch {
          // Ignore
        }

        return report;
      }
    } catch (e) {
      console.warn('Could not fetch live translation status from GitHub release, trying static fallback', e);
    }

    // 4. Static Fallback Report from /translation-status-fallback.txt
    try {
      const fallbackRes = await fetch('/translation-status-fallback.txt');
      if (fallbackRes.ok) {
        const text = await fallbackRes.text();
        const report = this.parseTranslationStatusText(text, releaseVersion);

        try {
          localStorage.setItem(versionCacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: report
          }));
        } catch {
          // Ignore
        }

        return report;
      }
    } catch {
      // Ignore
    }

    // 5. Default generated report if offline
    return this.parseTranslationStatusText(FALLBACK_STATUS_TEXT, releaseVersion);
  }
}

const FALLBACK_STATUS_TEXT = `Tachyon 4.4.3 translation status

Reference en: 685 user + 234 admin strings.
3 of 36 locales have every string translated.

locale   complete   missing   untranslated?  missing from
fr         100.0%         0              3  
pl         100.0%         0              0  
ru         100.0%         0              4  
da          99.9%         1              2  TAB_SECURITY 1
de          98.0%        18              0  TAB_ABOUT 12, TAB_GENERAL 4, TAB_SECURITY 1, POPUPS_DOMAIN 1
es          98.0%        18              0  TAB_ABOUT 12, TAB_GENERAL 4, TAB_SECURITY 1, POPUPS_DOMAIN 1
it          81.0%       175             70  CONTACTS 36, CALENDAR 32, TAB_LOGS 20
zh          79.5%       188             19  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
id          78.3%       199              2  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
be          78.2%       200             30  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
cs          78.2%       200             13  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
eu          78.2%       200             86  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
fa          78.2%       200            137  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
fi          78.2%       200            140  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
hu          78.2%       200            136  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
ja          78.2%       200            103  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
lt          78.2%       200            140  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
nb          78.2%       200            104  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
nl          78.2%       200              2  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
pt          78.2%       200              3  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
pt-BR       78.2%       200            136  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
sk          78.2%       200            213  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
sl          78.2%       200            136  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
sv          78.2%       200            134  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
uk          78.2%       200              5  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
vi          78.2%       200            103  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
zh-TW       78.2%       200             21  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
ar          59.8%       369            142  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
bg          59.8%       369            122  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
el          59.8%       369            201  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
et          59.8%       369            127  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
is          59.8%       369            122  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
ko          59.8%       369            126  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
lv          59.8%       369            230  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
ro          59.8%       369            212  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
tr          59.8%       369            174  CONTACTS 36, CALENDAR 32, TAB_LOGS 28
`;
