---
title: "Hardening Webmail: Zero Trackers, Strict CSP & Sodium Cryptography"
date: "2026-08-28"
author: "Kim Schulz"
authorUrl: "https://schulz.dk"
authorAvatar: "/images/kim-schulz.webp"
tags: ["Security", "Privacy", "Architecture"]
summary: "A deep dive into Tachyon's security model: why we ditched third-party telemetry, how we enforce strict Content-Security-Policy headers, and our cryptographic design."
coverImage: ""
featured: false
---

Email remains one of the most sensitive communication channels on the internet. Yet many traditional webmail clients load remote tracking pixels, third-party avatars (such as Gravatar), or inject insecure inline scripts.

In Tachyon, privacy and security are architectural prerequisites, not optional plugins.

## 1. Zero Third-Party Telemetry & No Remote Leaks

In Tachyon, **100% of external telemetry is stripped**:
* **No Gravatar or Third-Party Avatars**: When viewing contacts or email headers, your browser never contacts Gravatar, Google, or social networks.
* **No CDN Dependencies**: All JavaScript, stylesheets, and icons are self-hosted directly from your server.
* **External Image Proxying**: Remote images in emails are blocked by default and can be loaded on-demand through a privacy proxy to prevent IP address logging by senders.

## 2. Hardened HTTP Response Headers

Tachyon ships with security headers pre-configured out of the box:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
```

By disallowing unneeded browser hardware capabilities via `Permissions-Policy`, client vulnerabilities in browser extensions or third-party scripts cannot access microphones or webcams.

## 3. Cryptography: Upgrading from XXTEA to Libsodium

Historically, legacy webmail forks utilized legacy XXTEA or OpenSSL symmetric ciphers. 

Tachyon modernizes credential storage:
* If legacy XXTEA credentials exist, Tachyon automatically migrates them upon first login.
* The system promotes credentials to **Libsodium** (`crypto_secretbox_easy` with ChaCha20-Poly1305 authenticated encryption) or AES-256-GCM via OpenSSL.
* Server-side keys are derived using secure memory-hard KDF algorithms.

## 4. Subresource Integrity (SRI) on Static Assets

Every script tag in Tachyon includes a cryptographic SRI hash (`sha384-...`). If an upstream file is tampered with on disk or in transit, the browser immediately halts execution, preventing supply-chain modifications.

---

Have questions or security feedback? Feel free to start a discussion below or open a topic in our [GitHub Discussions](#/community).
