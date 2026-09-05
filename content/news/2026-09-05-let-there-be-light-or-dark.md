---
title: "Let There Be Light... or Dark... or Light"
date: "2026-09-05"
author: "Kim Schulz"
authorUrl: "https://schulz.dk"
authorAvatar: "/images/kim-schulz.webp"
tags: ["Themes", "UX", "Upcoming", "Release"]
summary: "Why have two themes when one toggle does the trick? We cleaned up Tachyon's theme roster, merged 7 light/dark theme duplicates into unified adaptive themes, and retired 8 legacy names with seamless auto-migration."
coverImage: ""
featured: false
---

In the beginning, webmail was bright. Blindingly bright. Then the dark mode revolution arrived, and developers across the world scrambled to create dark variants of everything.

Back in the RainLoop and early SnappyMail days, if you wanted a dark version of a theme, the solution was straightforward: *copy the theme folder, invert the colors, slap "Dark" onto the name, and call it a day.*

The result? A theme selector menu cluttered with duplicates: `Stripes` and `StripesDark`, `Love` and `LoveDark`, `Wood` and `BlackWood`, and the enigmatic duo `DarkShine` and `NightShine` (because apparently one dark shine wasn't quite dark enough).

## One Toggle to Rule Them All

When we introduced native **Dark / Light Mode Toggling** in Tachyon Webmail, having separate theme entries for light and dark skins quickly became obsolete. Why force users to change their entire theme just because the sun went down?

In the upcoming Tachyon release, we went through the theme closet with a broom. **Seven theme pairs have been merged into single, adaptive themes** that respond instantly to your light/dark mode preference or system settings.

### The Great Theme Consolidation:

| Old Light Theme | Old Dark Theme | New Unified Name |
| :--- | :--- | :--- |
| `Stripes` | `StripesDark` | **`Stripes`** |
| `Love` | `LoveDark` | **`Love`** |
| `Snow` | `SnowDarkV1` | **`Snow`** |
| `Blurred` | `BlurredDark` | **`Blurred`** |
| `Squares` | `SquaresDark` | **`Squares`** |
| `Wood` | `BlackWood` | **`Wood`** |
| `DarkShine` | `NightShine` | **`Shine`** |

Seven pairs merged, eight old legacy theme names retired, and a significantly cleaner, more intuitive settings panel.

## Seamless Migration for Existing Users

Don't worry — your customized webmail look isn't going to vanish into the void upon updating. 

The upcoming release includes automatic theme resolution. When the new version starts, it checks your saved theme preference:
* If you were using `StripesDark`, Tachyon automatically migrates your configuration to the unified **`Stripes`** theme while preserving your preference for **Dark Mode**.
* If you were using `BlackWood`, you land on **`Wood`** in dark mode.
* If you were rocking `NightShine`, you smoothly transition to **`Shine`**.

Zero broken layouts, zero missing backgrounds, and no manual reconfiguration required.

## What's Next?

This theme consolidation lays the groundwork for more dynamic styling features coming to Tachyon, including cleaner CSS variable theming and better accessibility contrast controls.

The updated themes will land in the next release. Until then: flip that switch, enjoy the contrast, and let there be light... or dark... or light.

---

*Have thoughts on the new theme roster or ideas for new themes? Share them on our [Community Board](#/community) or join the discussion on [GitHub](https://github.com/kimusan/Tachyon).*
