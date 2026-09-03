---
title: "Tachyon v4.0 Released: Modern PHP 8.4 Architecture & Enhanced Security"
date: "2026-08-25"
author: "Kim Schulz"
authorUrl: "https://schulz.dk"
authorAvatar: "/images/kim-schulz.webp"
tags: ["Release", "PHP", "Security"]
summary: "We are thrilled to announce Tachyon v4.0! This major release brings full PHP 8.4 compatibility, hardened security headers, and an automated release build pipeline."
coverImage: ""
featured: true
---

We are excited to announce the release of **Tachyon v4.0** — the next major iteration of our privacy-first, zero-database webmail engine.

Tachyon continues our mission of providing a blazing-fast, lightweight, and modern alternative to legacy webmail solutions like Roundcube and RainLoop, without requiring SQL databases or complex runtime dependencies.

## What's New in v4.0

### 1. Modern PHP 8.2 – 8.4 Engine
The entire codebase has been modernized to take full advantage of PHP 8.2+ features:
* **Strict Typing & Enums**: Robust data models and elimination of legacy type ambiguities.
* **Constructor Property Promotion**: Cleaner, leaner classes.
* **OPcache & APCu Optimization**: Sub-millisecond script startup times and streamlined memory footprints.

### 2. Enterprise-Grade Security Hardening
Security has been elevated across all layers:
* **Permissions-Policy**: Proactively denies browser access to sensitive hardware APIs (camera, microphone, geolocation, USB) to eliminate client-side attack surfaces.
* **Strict CSP & Reporting**: Content Security Policy with standard `Reporting-Endpoints` header support.
* **Subresource Integrity (SRI)**: All bundled static assets are verified with SHA-384 hashes.
* **Sodium Cryptography**: Upgraded encryption backend utilizing modern `libsodium` primitives for credential and data protection.

### 3. Automated Release Distribution
With v4.0, release packages are automatically published for every environment:
* Official Docker containers on GitHub Container Registry (`ghcr.io/kimusan/tachyon:latest`)
* Debian & Ubuntu packages (`.deb`)
* RHEL, Fedora, AlmaLinux packages (`.rpm`)
* Nextcloud & ownCloud app packages
* Standard `.tar.gz` and `.zip` deployment archives

## Upgrading to v4.0

Upgrading from existing Tachyon or SnappyMail installations is a seamless, drop-in process. Existing accounts, domain configurations, and user preferences are automatically preserved.

```bash
# Upgrade via Debian/Ubuntu package
wget https://github.com/kimusan/Tachyon/releases/latest/download/tachyon_latest_all.deb
sudo apt install ./tachyon_latest_all.deb
sudo systemctl reload nginx # or apache2
```

For full installation and upgrade instructions, check out the [Installation Guide](#/docs/Installation-instructions).

---

*Join the discussion on this release in the comments below or visit our [Community Board](#/community).*
