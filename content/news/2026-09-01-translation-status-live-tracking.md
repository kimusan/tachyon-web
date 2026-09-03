---
title: "Real-Time Localization Tracking: Coordinating 36 Languages for Tachyon"
date: "2026-09-01"
author: "Kim Schulz"
authorUrl: "https://schulz.dk"
authorAvatar: "/images/kim-schulz.webp"
tags: ["Localization", "Community", "Open Source"]
summary: "Introducing our new live translation dashboard on tachyonmail.app, tracking localization progress across 36 languages with direct GitHub contribution links."
coverImage: ""
featured: false
---

Internationalization is essential for making open-source webmail accessible to everyone worldwide. Tachyon currently supports **36 languages** spanning over 780 translation strings across user and administrator interfaces.

Today, we are launching an interactive **[Translation & Localization Dashboard](#/docs/Translations)** on the Tachyon website.

## How the Live Tracking Works

During each automated build and release cycle in GitHub Actions:
1. An analyzer scans all locale directories under `tachyon/v/0.0.0/app/localization/{code}/`.
2. It generates a comprehensive status report (`tachyon-${VERSION}-translation-status.txt`) attached directly to the GitHub release assets.
3. The Tachyon website dynamically parses this report in real time, showing exact string completeness, missing components, and progress percentages for every language.

## Current Localization Highlights

* **100% Complete**: Danish (🇩🇰), German (🇩🇪), Spanish (🇪🇸), French (🇫🇷).
* **$\ge 90\%$ Complete**: Over 20 languages including Dutch, Polish, Portuguese, Russian, Swedish, and Norwegian.
* **Open for Contributions**: Many locales only need 50–60 strings in calendar and contacts to achieve 100% coverage.

## How You Can Help

Translating Tachyon is straightforward and requires no complex tooling:

1. Visit the [Translations Dashboard](#/docs/Translations) to find your native language.
2. Click the **"Translate"** button to jump directly into your language folder on GitHub.
3. Edit `user.json` or `admin.json` in your browser or local editor.
4. Open a Pull Request on GitHub.

Every contribution helps bring private, fast email to users in their native language!
