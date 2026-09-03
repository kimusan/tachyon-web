---
title: "Tachyon v3.1.0: Custom Branding, Directory Rebrand & Debian Packages"
date: "2026-07-02"
author: "Kim Schulz"
authorUrl: "https://schulz.dk"
authorAvatar: "/images/kim-schulz.webp"
tags: ["Release", "Debian", "Features"]
summary: "The full move to Tachyon: application directories renamed to tachyon/, custom logo uploads for the login screen, new default theme, and official .deb package releases."
coverImage: ""
featured: false
---

We are excited to announce **Tachyon v3.1.0** — marking our full transition to the Tachyon brand and adding several highly requested administrative features.

## What's New in v3.1.0

### 1. Login Page Custom Branding & Logo Upload
Administrators can now upload a custom company or organization logo directly from **Admin → Branding**:
* Supports PNG, JPG, GIF, SVG, and WebP formats.
* The logo is stored in the data directory and served securely through PHP — it is never exposed directly in a web-accessible folder.
* Custom themes can control logo positioning and dimensions using CSS variables (`--login-logo-max-height`, `--login-logo-max-width`).

### 2. Full Directory Rebrand
The application directory structure is now organized under `tachyon/v/3.1.0/` (migrated from legacy `snappymail/`). Upgrading is as simple as extracting the release archive over your current installation — existing configurations and mail cache in `data/` remain untouched.

### 3. New Default Theme
Fresh installations of Tachyon now feature the modern, clean Tachyon theme out of the box with responsive light and dark mode skins.

### 4. Official Debian / Ubuntu Package (`.deb`)
Starting with v3.1.0, every Tachyon release automatically includes an official `.deb` package for quick installations and updates on Debian and Ubuntu systems:

```bash
wget https://github.com/kimusan/Tachyon/releases/latest/download/tachyon_latest_all.deb
sudo apt install ./tachyon_latest_all.deb
```

---

*For detailed setup steps, visit our [Installation Guide](#/docs/Installation-instructions).*
