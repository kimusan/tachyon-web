import { PROJECT_CONFIG, ReleaseInfo } from '../config/project-info';

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
    // 1. Check local cache
    try {
      const cached = localStorage.getItem(CACHE_KEY);
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
    let releaseVersion = latestRelease?.version || 'v4.0.3';

    if (latestRelease?.assets) {
      const statusAsset = latestRelease.assets.find(a => a.name.includes('translation-status.txt'));
      if (statusAsset) {
        downloadUrl = statusAsset.downloadUrl;
      }
    }

    if (!downloadUrl) {
      downloadUrl = `https://github.com/${PROJECT_CONFIG.githubRepo}/releases/download/${releaseVersion}/tachyon-${releaseVersion.replace(/^v/i, '')}-translation-status.txt`;
    }

    // 3. Fetch status file
    try {
      const response = await fetch(downloadUrl);
      if (response.ok) {
        const text = await response.text();
        const report = this.parseTranslationStatusText(text, releaseVersion);

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
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

    // 4. Static Fallback Report
    try {
      const fallbackRes = await fetch('/translation-status-fallback.txt');
      if (fallbackRes.ok) {
        const text = await fallbackRes.text();
        return this.parseTranslationStatusText(text, releaseVersion);
      }
    } catch {
      // Ignore
    }

    // 5. Default generated report if offline
    return this.parseTranslationStatusText(FALLBACK_STATUS_TEXT, releaseVersion);
  }
}

const FALLBACK_STATUS_TEXT = `Tachyon 4.0.3 translation status

Reference en: 637 user + 147 admin strings.
4 of 36 locales have every string translated.

locale   complete   missing   untranslated?  missing from
da         100.0%         0              1  
de         100.0%         0              0  
es         100.0%         0              0  
fr         100.0%         0              2  
be          91.8%        64             30  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
cs          91.8%        64             13  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
eu          91.8%        64             87  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
fa          91.8%        64            138  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
fi          91.8%        64            141  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
hu          91.8%        64            137  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
id          91.8%        64            139  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
it          91.8%        64             76  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
ja          91.8%        64            104  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
lt          91.8%        64            141  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
nb          91.8%        64            105  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
nl          91.8%        64              2  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
pl          91.8%        64              5  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
pt          91.8%        64              3  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
pt-BR       91.8%        64            137  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
ru          91.8%        64             24  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
sk          91.8%        64            214  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
sl          91.8%        64            137  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
sv          91.8%        64            135  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
uk          91.8%        64              5  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
vi          91.8%        64            104  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
zh          91.8%        64             19  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
zh-TW       91.8%        64             21  CALENDAR 26, CONTACTS 17, EDITOR 8, SETTINGS_CALENDAR 6, SETTINGS_CONTACTS 2, TAB_CONTACTS 2, GLOBAL 1, SETTINGS_LABELS 1, NOTIFICATIONS 1
ar          73.3%       209            143  CALENDAR 26, POPUPS_DOMAIN 26, CONTACTS 17, TAB_GENERAL 15, TAB_CONTACTS 15, NOTIFICATIONS 13, GLOBAL 12, TAB_SECURITY 11, SETTINGS_LABELS 10, TAB_BRANDING 9, TAB_ABOUT 9, EDITOR 8, SETTINGS_CALENDAR 6, TAB_LOGIN 5, TAB_DOMAINS 5, TAB_PACKAGES 5, LOGIN 3, POPUPS_DOMAIN_ALIAS 3, SETTINGS_CONTACTS 2, POPUPS_PLUGIN 2, HINTS 2, ERRORS 2, TOP_PANEL 1, POPUPS_ASK 1, POPUPS_LANGUAGES 1
bg          73.3%       209            123  CALENDAR 26, POPUPS_DOMAIN 26, CONTACTS 17, TAB_GENERAL 15, TAB_CONTACTS 15, NOTIFICATIONS 13, GLOBAL 12, TAB_SECURITY 11, SETTINGS_LABELS 10, TAB_BRANDING 9, TAB_ABOUT 9, EDITOR 8, SETTINGS_CALENDAR 6, TAB_LOGIN 5, TAB_DOMAINS 5, TAB_PACKAGES 5, LOGIN 3, POPUPS_DOMAIN_ALIAS 3, SETTINGS_CONTACTS 2, POPUPS_PLUGIN 2, HINTS 2, ERRORS 2, TOP_PANEL 1, POPUPS_ASK 1, POPUPS_LANGUAGES 1
el          73.3%       209            202  CALENDAR 26, POPUPS_DOMAIN 26, CONTACTS 17, TAB_GENERAL 15, TAB_CONTACTS 15, NOTIFICATIONS 13, GLOBAL 12, TAB_SECURITY 11, SETTINGS_LABELS 10, TAB_BRANDING 9, TAB_ABOUT 9, EDITOR 8, SETTINGS_CALENDAR 6, TAB_LOGIN 5, TAB_DOMAINS 5, TAB_PACKAGES 5, LOGIN 3, POPUPS_DOMAIN_ALIAS 3, SETTINGS_CONTACTS 2, POPUPS_PLUGIN 2, HINTS 2, ERRORS 2, TOP_PANEL 1, POPUPS_ASK 1, POPUPS_LANGUAGES 1
et          73.3%       209            128  CALENDAR 26, POPUPS_DOMAIN 26, CONTACTS 17, TAB_GENERAL 15, TAB_CONTACTS 15, NOTIFICATIONS 13, GLOBAL 12, TAB_SECURITY 11, SETTINGS_LABELS 10, TAB_BRANDING 9, TAB_ABOUT 9, EDITOR 8, SETTINGS_CALENDAR 6, TAB_LOGIN 5, TAB_DOMAINS 5, TAB_PACKAGES 5, LOGIN 3, POPUPS_DOMAIN_ALIAS 3, SETTINGS_CONTACTS 2, POPUPS_PLUGIN 2, HINTS 2, ERRORS 2, TOP_PANEL 1, POPUPS_ASK 1, POPUPS_LANGUAGES 1
is          73.3%       209            123  CALENDAR 26, POPUPS_DOMAIN 26, CONTACTS 17, TAB_GENERAL 15, TAB_CONTACTS 15, NOTIFICATIONS 13, GLOBAL 12, TAB_SECURITY 11, SETTINGS_LABELS 10, TAB_BRANDING 9, TAB_ABOUT 9, EDITOR 8, SETTINGS_CALENDAR 6, TAB_LOGIN 5, TAB_DOMAINS 5, TAB_PACKAGES 5, LOGIN 3, POPUPS_DOMAIN_ALIAS 3, SETTINGS_CONTACTS 2, POPUPS_PLUGIN 2, HINTS 2, ERRORS 2, TOP_PANEL 1, POPUPS_ASK 1, POPUPS_LANGUAGES 1
ko          73.3%       209            127  CALENDAR 26, POPUPS_DOMAIN 26, CONTACTS 17, TAB_GENERAL 15, TAB_CONTACTS 15, NOTIFICATIONS 13, GLOBAL 12, TAB_SECURITY 11, SETTINGS_LABELS 10, TAB_BRANDING 9, TAB_ABOUT 9, EDITOR 8, SETTINGS_CALENDAR 6, TAB_LOGIN 5, TAB_DOMAINS 5, TAB_PACKAGES 5, LOGIN 3, POPUPS_DOMAIN_ALIAS 3, SETTINGS_CONTACTS 2, POPUPS_PLUGIN 2, HINTS 2, ERRORS 2, TOP_PANEL 1, POPUPS_ASK 1, POPUPS_LANGUAGES 1
lv          73.3%       209            231  CALENDAR 26, POPUPS_DOMAIN 26, CONTACTS 17, TAB_GENERAL 15, TAB_CONTACTS 15, NOTIFICATIONS 13, GLOBAL 12, TAB_SECURITY 11, SETTINGS_LABELS 10, TAB_BRANDING 9, TAB_ABOUT 9, EDITOR 8, SETTINGS_CALENDAR 6, TAB_LOGIN 5, TAB_DOMAINS 5, TAB_PACKAGES 5, LOGIN 3, POPUPS_DOMAIN_ALIAS 3, SETTINGS_CONTACTS 2, POPUPS_PLUGIN 2, HINTS 2, ERRORS 2, TOP_PANEL 1, POPUPS_ASK 1, POPUPS_LANGUAGES 1
ro          73.3%       209            213  CALENDAR 26, POPUPS_DOMAIN 26, CONTACTS 17, TAB_GENERAL 15, TAB_CONTACTS 15, NOTIFICATIONS 13, GLOBAL 12, TAB_SECURITY 11, SETTINGS_LABELS 10, TAB_BRANDING 9, TAB_ABOUT 9, EDITOR 8, SETTINGS_CALENDAR 6, TAB_LOGIN 5, TAB_DOMAINS 5, TAB_PACKAGES 5, LOGIN 3, POPUPS_DOMAIN_ALIAS 3, SETTINGS_CONTACTS 2, POPUPS_PLUGIN 2, HINTS 2, ERRORS 2, TOP_PANEL 1, POPUPS_ASK 1, POPUPS_LANGUAGES 1
tr          73.3%       209            175  CALENDAR 26, POPUPS_DOMAIN 26, CONTACTS 17, TAB_GENERAL 15, TAB_CONTACTS 15, NOTIFICATIONS 13, GLOBAL 12, TAB_SECURITY 11, SETTINGS_LABELS 10, TAB_BRANDING 9, TAB_ABOUT 9, EDITOR 8, SETTINGS_CALENDAR 6, TAB_LOGIN 5, TAB_DOMAINS 5, TAB_PACKAGES 5, LOGIN 3, POPUPS_DOMAIN_ALIAS 3, SETTINGS_CONTACTS 2, POPUPS_PLUGIN 2, HINTS 2, ERRORS 2, TOP_PANEL 1, POPUPS_ASK 1, POPUPS_LANGUAGES 1
`;
