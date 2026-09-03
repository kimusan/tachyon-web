---
title: "Introducing Tachyon: Why We Forked and Where We're Heading"
date: "2026-06-15"
author: "Kim Schulz"
authorUrl: "https://schulz.dk"
authorAvatar: "/images/kim-schulz.webp"
tags: ["Announcement", "Open Source", "Architecture"]
summary: "A fast, zero-database webmail client built for modern PHP 8.2+. The story behind the fork from SnappyMail and our vision for a lean, privacy-respecting email engine."
coverImage: ""
featured: false
---

Today, we are announcing **Tachyon Webmail** — a high-performance, privacy-first webmail application designed from the ground up to run on modern PHP 8.2+ without requiring SQL databases.

## The Lineage: From RainLoop to SnappyMail to Tachyon

To understand why Tachyon exists, it helps to look at the history of modern web-based email:

1. **RainLoop (2013–2022)** revolutionized webmail UX with a fast single-page app interface and direct IMAP authentication without relational databases. However, upstream development stagnated and security vulnerabilities were left unaddressed.
2. **SnappyMail (2020–2024)** stepped in as a community fork, patching vulnerabilities, modernizing crypto, and cleaning up legacy code.
3. **Tachyon (2025–present)** is the next evolution in this lineage. As PHP evolved rapidly with PHP 8.2, 8.3, and 8.4, we needed a codebase that fully embraces modern language features, strict security policies, and an active release cadence.

## Core Principles of Tachyon

* **Zero Relational Database Required**: Tachyon talks directly to your IMAP and SMTP servers. User settings and cache can be stored on the filesystem, Redis, or APCu. No MySQL or PostgreSQL migrations to maintain.
* **100% Privacy & Zero Telemetry**: We eliminated all external tracking, third-party avatar requests (Gravatar), and remote font CDNs. Everything is self-hosted.
* **Drop-in Upgradability**: Existing SnappyMail installations can upgrade to Tachyon in seconds without modifying configuration or user data directories.
* **Blazing Fast**: Named after the theoretical faster-than-light particle, Tachyon is optimized for minimal memory usage, fast OPcache compilation, and immediate UI reactivity.

We invite the community to test Tachyon, report feedback, and help shape the future of independent open-source webmail.

---

*Check out our [GitHub Repository](https://github.com/kimusan/Tachyon) and join the discussion on our [Community Board](#/community).*
