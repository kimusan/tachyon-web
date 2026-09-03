import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newsDir = path.resolve(__dirname, '../content/news');
const outputDir = path.resolve(__dirname, '../public');
const outputFile = path.join(outputDir, 'feed.xml');

const SITE_URL = 'https://tachyonmail.app';
const SITE_TITLE = 'Tachyon Webmail News & Announcements';
const SITE_DESC = 'Latest updates, releases, and security announcements from Tachyon Webmail.';

function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: fileContent };

  const rawMeta = match[1];
  const content = match[2];
  const meta = {};

  const lines = rawMeta.split(/\r?\n/);
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();

    // Handle strings with quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // Handle booleans
    else if (val.toLowerCase() === 'true') {
      val = true;
    } else if (val.toLowerCase() === 'false') {
      val = false;
    }
    // Handle array like ["Release", "PHP"]
    else if (val.startsWith('[') && val.endsWith(']')) {
      try {
        val = JSON.parse(val);
      } catch {
        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      }
    }

    meta[key] = val;
  }

  return { meta, content };
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function generateRss() {
  if (!fs.existsSync(newsDir)) {
    console.log('No content/news directory found, skipping RSS generation.');
    return;
  }

  const files = fs.readdirSync(newsDir).filter(f => f.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const fullPath = path.join(newsDir, file);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const { meta } = parseFrontmatter(raw);

    const slug = file.replace(/\.md$/, '');
    const date = meta.date || new Date().toISOString().split('T')[0];
    const pubDate = new Date(date).toUTCString();

    posts.push({
      slug,
      title: meta.title || slug,
      date,
      pubDate,
      author: meta.author || 'Kim Schulz',
      summary: meta.summary || '',
      link: `${SITE_URL}/#/news/${slug}`,
      tags: meta.tags || []
    });
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const lastBuildDate = posts.length > 0 ? posts[0].pubDate : new Date().toUTCString();

  const itemsXml = posts.map(post => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(post.link)}</link>
      <guid isPermaLink="true">${escapeXml(post.link)}</guid>
      <pubDate>${post.pubDate}</pubDate>
      <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">${escapeXml(post.author)}</dc:creator>
      <description>${escapeXml(post.summary)}</description>
      ${post.tags.map(t => `<category>${escapeXml(t)}</category>`).join('\n      ')}
    </item>`).join('\n\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, rss, 'utf-8');
  console.log(`Generated RSS feed at ${outputFile} with ${posts.length} posts.`);
}

generateRss();
