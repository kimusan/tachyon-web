export interface WikiPageMeta {
  slug: string;
  title: string;
  category: 'Getting Started' | 'Administration' | 'Security & Protocols' | 'Developer & Advanced';
  description: string;
}

export interface ReleaseAsset {
  name: string;
  downloadUrl: string;
  size: string;
  type: 'tar' | 'zip' | 'deb' | 'nextcloud' | 'owncloud' | 'plugin' | 'other';
}

export interface ReleaseInfo {
  version: string;
  name: string;
  publishedAt: string;
  htmlUrl: string;
  body: string;
  assets: ReleaseAsset[];
  tarballUrl: string;
  zipballUrl: string;
  isPrerelease?: boolean;
}

export interface ReleasesSummary {
  stable: ReleaseInfo;
  prerelease: ReleaseInfo | null;
}

export const PROJECT_CONFIG = {
  name: 'Tachyon Webmail',
  tagline: 'Simple, modern & fast web-based email client in PHP',
  subheading: 'Hardened, privacy-first, and zero-database webmail built for modern PHP 8.2+. Engineered to be faster than light.',
  domain: 'tachyonmail.app',
  githubRepo: 'kimusan/Tachyon',
  githubUrl: 'https://github.com/kimusan/Tachyon',
  githubIssuesUrl: 'https://github.com/kimusan/Tachyon/issues',
  githubNewIssueUrl: 'https://github.com/kimusan/Tachyon/issues/new/choose',
  githubNewBugUrl: 'https://github.com/kimusan/Tachyon/issues/new?template=bug_report.md',
  githubNewFeatureUrl: 'https://github.com/kimusan/Tachyon/issues/new?template=feature_request.md',
  githubDiscussionsUrl: 'https://github.com/kimusan/Tachyon/discussions',
  githubWikiBaseUrl: 'https://raw.githubusercontent.com/wiki/kimusan/Tachyon',
  githubWikiWebUrl: 'https://github.com/kimusan/Tachyon/wiki',
  nextcloudAppUrl: 'https://apps.nextcloud.com/apps/tachyon',
  license: 'GNU AGPLv3',
  licenseUrl: 'https://www.gnu.org/licenses/agpl-3.0.html',
};

export const FALLBACK_RELEASE: ReleaseInfo = {
  version: 'v3.2.8',
  name: 'Tachyon v3.2.8',
  publishedAt: '2026-08-22',
  htmlUrl: 'https://github.com/kimusan/Tachyon/releases/tag/v3.2.8',
  body: `### Changes in v3.2.8\n\n- Modernized PHP 8.2+ architecture with typed properties and enums\n- Strict Content-Security-Policy with Reporting-Endpoints header\n- Permissions-Policy header denying sensitive hardware APIs\n- Subresource Integrity (SRI) hashes for all static assets\n- Configurable Undo Send delay (Off / 5 / 10 / 20 / 30s)\n- Multi-account unread count badge\n- Updated OpenPGP.js to v5.11.3\n- Drop-in upgrade compatibility for existing SnappyMail installations`,
  tarballUrl: 'https://github.com/kimusan/Tachyon/releases/download/v3.2.8/tachyon-3.2.8.tar.gz',
  zipballUrl: 'https://github.com/kimusan/Tachyon/releases/download/v3.2.8/tachyon-3.2.8.zip',
  isPrerelease: false,
  assets: [
    {
      name: 'tachyon-3.2.8.tar.gz',
      downloadUrl: 'https://github.com/kimusan/Tachyon/releases/download/v3.2.8/tachyon-3.2.8.tar.gz',
      size: '6.9 MB',
      type: 'tar'
    },
    {
      name: 'tachyon-3.2.8.zip',
      downloadUrl: 'https://github.com/kimusan/Tachyon/releases/download/v3.2.8/tachyon-3.2.8.zip',
      size: '7.2 MB',
      type: 'zip'
    },
    {
      name: 'tachyon_3.2.8-1_all.deb',
      downloadUrl: 'https://github.com/kimusan/Tachyon/releases/download/v3.2.8/tachyon_3.2.8-1_all.deb',
      size: '5.9 MB',
      type: 'deb'
    },
    {
      name: 'tachyon-3.2.8-nextcloud.tar.gz',
      downloadUrl: 'https://github.com/kimusan/Tachyon/releases/download/v3.2.8/tachyon-3.2.8-nextcloud.tar.gz',
      size: '7.0 MB',
      type: 'nextcloud'
    },
    {
      name: 'tachyon-3.2.8-owncloud.tar.gz',
      downloadUrl: 'https://github.com/kimusan/Tachyon/releases/download/v3.2.8/tachyon-3.2.8-owncloud.tar.gz',
      size: '6.9 MB',
      type: 'owncloud'
    }
  ]
};

export const FALLBACK_PRERELEASE: ReleaseInfo | null = null;

export const WIKI_PAGES: WikiPageMeta[] = [
  {
    slug: 'Home',
    title: 'Overview & Introduction',
    category: 'Getting Started',
    description: 'Introduction to Tachyon, key differences from upstream forks, and overview.'
  },
  {
    slug: 'Installation-instructions',
    title: 'Installation Instructions',
    category: 'Getting Started',
    description: 'Complete setup guide for Linux servers running Apache, Nginx, or Caddy.'
  },
  {
    slug: 'Docker',
    title: 'Docker Deployment',
    category: 'Getting Started',
    description: 'Run Tachyon with Docker and Docker Compose in seconds.'
  },
  {
    slug: 'FAQ',
    title: 'Frequently Asked Questions',
    category: 'Getting Started',
    description: 'Common troubleshooting questions, password resets, and server configs.'
  },
  {
    slug: 'Admin-Manual',
    title: 'Administrator Manual',
    category: 'Administration',
    description: 'Managing domains, security policies, branding, storage, and server settings.'
  },
  {
    slug: 'Improve-performance',
    title: 'Performance & Tuning',
    category: 'Administration',
    description: 'Caching with APCu/Redis, OPcache configuration, and IMAP optimizations.'
  },
  {
    slug: 'Filters---Sieve',
    title: 'Sieve Mail Filters',
    category: 'Administration',
    description: 'Server-side email filtering rules, syntax highlighting, and ManageSieve setup.'
  },
  {
    slug: 'Spam-or-Virus',
    title: 'Spam & Antivirus Integration',
    category: 'Administration',
    description: 'Integrating Rspamd, SpamAssassin, and ClamAV with Tachyon.'
  },
  {
    slug: 'OpenPGP',
    title: 'OpenPGP Encryption',
    category: 'Security & Protocols',
    description: 'End-to-end PGP email encryption with OpenPGP.js v5 and Mailvelope.'
  },
  {
    slug: 'IMAP-capabilities',
    title: 'IMAP Capabilities & Extensions',
    category: 'Security & Protocols',
    description: 'Supported IMAP RFCs, IDLE push notifications, CONDSTORE, and QRESYNC.'
  },
  {
    slug: 'Developer-Documentation',
    title: 'Developer Documentation',
    category: 'Developer & Advanced',
    description: 'Plugin architecture, hook system, events, and extending Tachyon.'
  },
  {
    slug: 'Custom-Themes',
    title: 'Custom Themes & Styling',
    category: 'Developer & Advanced',
    description: 'Designing custom UI themes, CSS overrides, and dark mode skins.'
  },
  {
    slug: 'API',
    title: 'API Reference',
    category: 'Developer & Advanced',
    description: 'Internal JSON-RPC / REST API endpoints and authentication flow.'
  },
  {
    slug: 'imapsync.php',
    title: 'IMAP Sync Tool',
    category: 'Developer & Advanced',
    description: 'Command line utility to synchronize mailboxes between IMAP accounts.'
  }
];

export const INSTALL_SNIPPETS = {
  docker: `# Pull and run the official Tachyon Docker container
docker run -d \\
  --name tachyon-webmail \\
  -p 8080:80 \\
  -v tachyon_data:/var/www/html/data \\
  --restart unless-stopped \\
  ghcr.io/kimusan/tachyon:latest`,
  
  debian: `# Download and install the latest .deb package on Debian/Ubuntu
wget https://github.com/kimusan/Tachyon/releases/download/v3.2.8/tachyon_3.2.8-1_all.deb
sudo apt install ./tachyon_3.2.8-1_all.deb

# Verify PHP 8.2+ requirement and reload web server
sudo systemctl reload nginx # or apache2`,

  tarball: `# Download and extract the latest release archive
cd /var/www/html
wget https://github.com/kimusan/Tachyon/releases/download/v3.2.8/tachyon-3.2.8.tar.gz
tar -xzf tachyon-3.2.8.tar.gz
chown -R www-data:www-data data/

# Open your browser and navigate to:
# http://your-domain.com/?admin`,

  nextcloud: `# In your Nextcloud web interface:
# 1. Navigate to Apps -> Search for "Tachyon"
# 2. Click "Download and enable"

# Or install manually into your Nextcloud apps directory:
cd /var/www/nextcloud/apps/
wget https://github.com/kimusan/Tachyon/releases/download/v3.2.8/tachyon-3.2.8-nextcloud.tar.gz
tar -xzf tachyon-3.2.8-nextcloud.tar.gz`
};

export const COMPARISON_DATA = [
  {
    feature: 'PHP Compatibility',
    tachyon: 'Modern PHP 8.2 - 8.4 (Strict Typing, Enums)',
    snappymail: 'PHP 7.4 - 8.3 (Legacy codebases)',
    rainloop: 'PHP 5.4 - 7.4 (Unmaintained)',
    roundcube: 'PHP 7.3 - 8.2'
  },
  {
    feature: 'Database Required',
    tachyon: 'No Database Needed (Direct IMAP/File/Redis)',
    snappymail: 'No Database Needed',
    rainloop: 'No Database Needed',
    roundcube: 'SQL Database Required (MySQL/PgSQL/SQLite)'
  },
  {
    feature: 'Third-Party Telemetry & Trackers',
    tachyon: '100% Zero Trackers (No Gravatar, Google, Social)',
    snappymail: 'Minimal',
    rainloop: 'Included Social & Gravatar tracking',
    roundcube: 'Optional plugins'
  },
  {
    feature: 'Security Headers & SRI',
    tachyon: 'Strict CSP, Permissions-Policy, SRI on all assets',
    snappymail: 'Basic CSP',
    rainloop: 'Legacy headers',
    roundcube: 'Customizable'
  },
  {
    feature: 'Undo Send Feature',
    tachyon: 'Built-in (Configurable 5-30s delay)',
    snappymail: 'Not available',
    rainloop: 'Not available',
    roundcube: 'Plugin required'
  },
  {
    feature: 'Multi-Account Unread Badges',
    tachyon: 'Native switcher badges',
    snappymail: 'Partial',
    rainloop: 'No',
    roundcube: 'Plugin required'
  },
  {
    feature: 'Drop-in Upgrade from SnappyMail',
    tachyon: '100% In-Place Upgrade (Preserves config/data)',
    snappymail: 'N/A',
    rainloop: 'Requires migration',
    roundcube: 'No'
  },
  {
    feature: 'Nextcloud App Store Integration',
    tachyon: 'Available in App Store',
    snappymail: 'Available',
    rainloop: 'Deprecated',
    roundcube: 'Community app'
  },
  {
    feature: 'OpenPGP Encryption',
    tachyon: 'OpenPGP.js v5.11.3 + Mailvelope',
    snappymail: 'OpenPGP.js v4/v5',
    rainloop: 'Legacy OpenPGP',
    roundcube: 'Enigma plugin (GnuPG on server)'
  }
];

export const HISTORY_TIMELINE = [
  {
    year: '2013 - 2022',
    name: 'RainLoop Webmail',
    tagline: 'The Lightweight Pioneer',
    description: 'RainLoop introduced a sleek, database-free webmail experience. However, development stalled, leaving outdated PHP 5/7 practices and third-party trackers.',
    status: 'Archived / End of Life'
  },
  {
    year: '2020 - 2024',
    name: 'SnappyMail',
    tagline: 'The Community Hardening',
    description: 'Forked RainLoop to clean up legacy dependencies, remove tracking, and introduce modern security fixes for PHP 7 & early 8.',
    status: 'Legacy Predecessor'
  },
  {
    year: '2025 - Present',
    name: 'Tachyon Webmail',
    tagline: 'Faster Than Light. Modern PHP 8.2+ & Hardened Security',
    description: 'The definitive evolution: strict PHP 8.2+ types and enums, subresource integrity (SRI), Permissions-Policy, Undo Send, multi-account switcher badges, and full drop-in upgrade compatibility for existing SnappyMail deployments.',
    status: 'Active & Evolving'
  }
];
