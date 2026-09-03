---
title: "Tachyon for Nextcloud: Seamless Webmail for Your Cloud"
date: "2026-07-05"
author: "Kim Schulz"
authorUrl: "https://schulz.dk"
authorAvatar: "/images/kim-schulz.webp"
tags: ["Nextcloud", "Integration", "Release"]
summary: "Bringing Tachyon directly into Nextcloud and ownCloud environments with automated release artifacts and drop-in SnappyMail upgrade compatibility."
coverImage: ""
featured: false
---

Many users rely on **Nextcloud** as their self-hosted productivity hub. With **Tachyon v3.2.0**, we are introducing first-class Nextcloud and ownCloud integration packages as automated release artifacts.

## Integrated Cloud Webmail

The Tachyon Nextcloud app embeds the full Tachyon webmail interface directly within Nextcloud's navigation bar and iframe bridge:

* **Single Sign-On (SSO)**: Automatically log in to webmail using your Nextcloud session and user email credentials.
* **Modern DI Container Integration**: Fully refactored to support modern Nextcloud dependency injection patterns (`IUserSession`, `ISession`).
* **Backward Compatibility**: If you are upgrading an existing Nextcloud instance from SnappyMail, the app detects your `appdata_snappymail` directory and seamlessly migrates settings to `appdata_tachyon`.

## Installing into Nextcloud

You can install the app manually into your Nextcloud apps directory:

```bash
cd /var/www/nextcloud/apps/
wget https://github.com/kimusan/Tachyon/releases/latest/download/tachyon-latest-nextcloud.tar.gz
tar -xzf tachyon-latest-nextcloud.tar.gz
```

Once extracted, enable the Tachyon app under **Apps → Installed apps** in your Nextcloud administration panel.

---

*Find more details in our [Installation Documentation](#/docs/Installation-instructions).*
