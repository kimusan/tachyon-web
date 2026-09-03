---
title: "Tachyon v3.2.4: vCard Categories, Group Tagging & Nextcloud 34 Support"
date: "2026-08-19"
author: "Kim Schulz"
authorUrl: "https://schulz.dk"
authorAvatar: "/images/kim-schulz.webp"
tags: ["Release", "Features", "Nextcloud"]
summary: "Major contacts overhaul with vCard CATEGORIES support, address book group chips in compose autocomplete, and Nextcloud 34 DI modernizations."
coverImage: ""
featured: false
---

We have released **Tachyon v3.2.4**, featuring a major overhaul of the Contacts subsystem and improved compatibility with the latest Nextcloud 34 releases.

## Key Changes in v3.2.4

### 1. vCard CATEGORIES Support & Contact Tagging
* Store, edit, and organize contacts with standard vCard `CATEGORIES` tags.
* Filter your address book by category directly from the contacts sidebar.
* Supports multi-category assignments per contact.

### 2. Group Chip Expansion in Compose
* Typing a category name (e.g. `"Team"`, `"Friends"`) in the To/Cc/Bcc fields now displays an interactive group chip.
* Supports partial matching (e.g. typing `"frie"` matches `"Friends"`).
* The group chip expands automatically to all primary email addresses when the message is sent.

### 3. Nextcloud 34 Compatibility
* Modernized `Application.php` dependency injection for Nextcloud 34, removing deprecated helper methods and ensuring error-free app initialization.
* Autologin settings now read reliably from the `tachyon` app namespace.

---

*Check the full changelog on [GitHub Releases](https://github.com/kimusan/Tachyon/releases/tag/v3.2.4).*
