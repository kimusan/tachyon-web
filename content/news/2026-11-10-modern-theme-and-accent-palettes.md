---
title: "Leaving the Dusty SnappyMail Look Behind: The Modern Theme & Custom Accent Colors"
date: "2026-11-10"
author: "Kim Schulz"
authorUrl: "https://schulz.dk"
authorAvatar: "/images/kim-schulz.webp"
tags: ["Themes", "UX", "Upcoming"]
summary: "Coming in the next release: a new Modern theme, configurable accent color palettes for themes, and a cleaned-up Tachyon theme redesign. Check out the frontpage of tachyonmail.app for a live dark and light teaser."
coverImage: ""
featured: true
---

Tachyon has spent a lot of recent releases shedding the under-the-hood legacy it inherited from RainLoop and SnappyMail. On the surface, though, much of the interface still carried that familiar, dated 2010s webmail look.

In the **next release**, that changes. We are introducing a brand-new **Modern** theme, native support for **configurable accent color palettes** across themes, and a thorough **redesign and cleanup of the bundled Tachyon theme**.

If you want a preview before the release drops, head over to the **[frontpage of tachyonmail.app](#/)** right now. We just replaced the old HTML mockup in the hero section with real screenshots of the new **Modern** theme. Switch the site between light and dark mode using the toggle in the top navigation bar to see both views.

---

## Moving Past the Old SnappyMail Design

Back in September, we [consolidated seven duplicate light/dark theme pairs](#/news/2026-09-05-let-there-be-light-or-dark), switched interface icons over to theme-aware vectors instead of mismatched emojis, and made light/dark toggling instant without page reloads.

Even after that cleanup, **Chris Jones** (`@christopherjones`) pointed out an obvious truth in [Discussion #186](https://github.com/kimusan/Tachyon/discussions/186): the website's frontpage preview looked cleaner and more current than Tachyon's actual default interface. So he built [tachyon-theme-modern](https://github.com/christopherjones/tachyon-theme-modern) for his clients and shared it under the MIT license.

Rather than simply dropping another theme folder into the repository, we used his contribution as the catalyst to rethink how themes and color customization work across Tachyon as a whole.

---

## Meet the New "Modern" Theme

Contributed by Chris Jones and integrated directly into core, **Modern** gives Tachyon a contemporary, uncluttered layout built for everyday reading and writing:

* **Tinted surfaces instead of harsh boxes**: In light mode, Modern pairs a subtle cool-slate canvas (`#e4e8f0`) with soft off-white panels (`#f9fafc`), separating sidebars, message lists, and headers through gentle tonal contrast rather than heavy borders—while keeping the reading pane clean for HTML mail. Dark mode steps down to low-glare slate surfaces.
* **Sharper spacing and responsive fixes**: Alongside integrating Modern, we tightened message row layout so preview lines, sender names, and mobile/touch-screen star controls work cleanly across narrow and wide panes alike.
* **Seven built-in accent palettes**: Upstream shipped as seven separate theme variants (`Modern`, `Evergreen`, `Midnight`, `Clay`, `Graphite`, `Ink`, and `Plum`). Inside Tachyon, all seven live cleanly inside one unified theme.

*(Want a closer look? See the live teaser on the [frontpage of tachyonmail.app](#/) in both light and dark modes.)*

---

## Configurable Accent Colors for Themes

Maintaining seven separate copies of a stylesheet just to change highlight colors is noisy for users and painful to maintain. To solve that properly, the next release adds **first-class accent palette support** for any theme.

A theme can now include a small `theme.json` manifest next to its `styles.css` listing the palettes it supports (`id`, display name, and swatch hex color):

* **Picker swatches in Settings**: Under **Settings → Themes**, selecting a theme displays color swatches for every palette that theme offers. Switching theme starts on its default palette.
* **Server-wide admin default**: Administrators can choose both the default theme and the default accent palette (`webmail.theme_accent`) under **Admin → General**.
* **Instant updates, zero stylesheet reload**: Picking a palette updates a single `data-accent` attribute on `<html>`. No extra CSS file is requested, the compiled theme cache stays untouched, and Tachyon renders the active `data-accent` server-side on load so the page paints in the right colors immediately without flashing.
* **Automatic upgrade mapping**: Existing users who previously installed standalone `Modern*@custom` theme folders map straight onto the unified `Modern` theme with the matching accent active.

---

## A Redesigned & Cleaned-Up `Tachyon` Theme (and Renaming `Snappymail`)

With palette infrastructure in place, we applied the same thinking back onto Tachyon's own flagship theme:

* **Cleaned-up CSS token architecture**: The bundled **`Tachyon`** theme has been refactored around clean `--t-*` neutral and accent tokens, using modern `color-mix()` rules for soft fills, hover states, and focus rings rather than scattered per-component overrides.
* **Verified contrast across modes**: Neutral surfaces and accent foreground pairs were audited across both light and dark modes (including OS dark-mode auto-switching) so button text and links hold a minimum 4.5:1 contrast ratio.
* **Seven Tachyon palettes**: `Tachyon` now ships with **Blue** (default), **Teal**, **Green**, **Purple**, **Pink**, **Orange**, and **Graphite**.

To draw a clear line under the past, we also **renamed the legacy `Default` theme to `Snappymail`**. Tachyon's own styling has moved on, and calling that inherited layout "Default" no longer made sense. Saved configs still set to `Default` continue to resolve cleanly to `Snappymail`, while missing or removed themes safely fall back to `Tachyon`.

---

## Also Coming in the Next Release

Alongside the visual overhaul, several quality-of-life fixes and features are already merged on `master` for the next release:

* **Date range & sent-date search**: Advanced search now supports from/to date ranges and lets you match against the message's `Date` header (`SENTSINCE`/`SENTBEFORE`) rather than only server arrival time—helpful when searching imported mail archives.
* **Help → About tab**: A new About view showing installed version, website, source link, and license information.
* **Message view & composer polish**: Fixes for full-width table rendering and quoted image sizing when composing replies.

---

Head to the **[frontpage of tachyonmail.app](#/)** to preview the **Modern** theme in light and dark mode, or drop by [Discussion #186](https://github.com/kimusan/Tachyon/discussions/186) and our [Community page](#/community) to let us know what you think.
