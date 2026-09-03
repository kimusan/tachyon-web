---
title: "Tachyon v4.0.1 – v4.0.2 Released: Critical Fixes for Contacts, UTF-8 & CalDAV"
date: "2026-08-26"
author: "Kim Schulz"
authorUrl: "https://schulz.dk"
authorAvatar: "/images/kim-schulz.webp"
tags: ["Release", "Bugfix", "Security"]
summary: "Following the v4.0 rollout, several critical issues were identified and promptly resolved in the v4.0.1 and v4.0.2 patch releases, including contact selection deletion bugs, UTF-8 send corruption, and CalDAV auth."
coverImage: ""
featured: false
---

Following the release of **Tachyon 4.0**, community testing quickly surfaced a few critical edge cases. We immediately released **v4.0.1** and **v4.0.2** to patch these issues.

If you are running an earlier 4.0 build, **upgrading to v4.0.2 (or newer) is strongly recommended**.

---

## 1. Critical Fix: Contact Deletion ID Mismatch
In 4.0.1, the newly introduced *"Select all matching"* feature in the address book returned vCard string UIDs (e.g. `"1234-abcd-..."`), whereas the underlying contact deletion backend expected integer IDs. 

Because `intval("1234-abcd-...")` evaluated to `1234`, running a bulk delete after selecting all matching contacts had the potential to delete unintended contacts with matching prefix IDs.

**Resolved in v4.0.2**:
* Selection queries now return exact internal record IDs.
* Contact pagination is now deterministically sorted, preventing contacts from appearing across multiple pages or being skipped during bulk actions.
* Multi-page recipient selection limits have been resolved when addressing emails to large contact lists.

---

## 2. UTF-8 Character Corruption on Send
A subtle regular expression bug in message body processing caused certain multi-byte UTF-8 characters to become corrupted upon sending. 

Specifically, using `\R` in PHP regular expressions without the `/u` (PCRE UTF-8) modifier matches the byte `0x85`, which frequently serves as a valid continuation byte in multi-byte UTF-8 sequences.

**Resolved in v4.0.2**:
* Added the `/u` Unicode modifier to all message body line-break normalization regexes. Special thanks to **@kostaris** for tracking this down in [#21](https://github.com/kimusan/Tachyon/pull/21).

---

## 3. CalDAV & CardDAV Authentication Fixes
During live Nextcloud and CalDAV server testing, several authentication and permission bugs were addressed:
* **Preemptive Basic Auth**: Credentials are now sent preemptively on the initial request rather than waiting for a `401 Unauthorized` challenge, resolving connection failures behind Nginx reverse proxies that respond with `404` to unauthenticated CalDAV endpoints.
* **Encrypted Password Bug in CardDAV Test**: The connection test previously transmitted the encrypted ciphertext of the password rather than the decrypted string, causing test failures on all CardDAV backends.
* **Visual Status Feedback**: Both CardDAV and CalDAV test buttons now provide explicit visual success/failure indicators.

---

## 4. Nextcloud Logout Conflict Resolution
Fixes [#13](https://github.com/kimusan/Tachyon/issues/13), where signing out of Nextcloud could cause a conflict when both Tachyon and legacy SnappyMail extensions competed for global version constants during the logout cycle. Tachyon now safely yields during session cleanup.

---

## 5. Automated Translation Tracking
Starting with v4.0.2, every release package includes an automated `tachyon-${VERSION}-translation-status.txt` asset, powering our live [Localization Dashboard](#/docs/Translations). 

French has also reached 100% translation completeness thanks to **@hguilbert** in [#22](https://github.com/kimusan/Tachyon/pull/22) and [#23](https://github.com/kimusan/Tachyon/pull/23), joining Danish, German, and Spanish.

---

## Upgrading to v4.0.2+

You can upgrade your installation immediately using the latest release packages:

```bash
# Debian / Ubuntu (.deb)
wget https://github.com/kimusan/Tachyon/releases/latest/download/tachyon_latest_all.deb
sudo apt install ./tachyon_latest_all.deb

# Or standard archive
wget https://github.com/kimusan/Tachyon/releases/latest/download/tachyon-latest.tar.gz
```

*For more details, see the full release notes on [GitHub Releases](https://github.com/kimusan/Tachyon/releases).*
