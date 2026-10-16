---
title: "The Browser Back Button Odyssey: Rapid Releases & The Path to v4.4.7"
date: "2026-10-16"
author: "Kim Schulz"
authorUrl: "https://schulz.dk"
authorAvatar: "/images/kim-schulz.webp"
tags: ["Release", "Routing", "UX", "Bugfix"]
summary: "What started as a simple, highly requested feature—allowing the browser Back button to close open emails—unleashed a cascade of subtle routing bugs across v4.4.3 through v4.4.6. Here is the technical story, why v4.4.6 is recommended today, and what to expect in v4.4.7."
coverImage: ""
featured: true
---

Five releases in two days, and three of them today alone to clean up after one change. 

In [v4.4.3](https://github.com/kimusan/Tachyon/releases/tag/v4.4.3), we implemented what looked like a straightforward, highly requested quality-of-life feature ([#141](https://github.com/kimusan/Tachyon/issues/141)): **enabling the browser Back button to close an open email and return to the mailbox list**, along with giving each message its own direct URL (`#/mailbox/<folder>/m<uid>`).

The route handler had technically understood message URLs for a long time, but the UI had never actually pushed history states or written those hashes into the address bar. Doing so in a rich Single-Page Application (SPA) webmail client connected to arbitrary IMAP server configurations turned out to be far more intricate than anticipated. Every message click ended up resetting a different piece of mailbox state, kicking off a cascade of rapid releases: **v4.4.4**, **v4.4.5**, and **v4.4.6**.

Here is a look at what went wrong under the hood, where things stand now, and our plan for **v4.4.7**.

---

## The Domino Effect: How One Feature Triggered Three Releases

### 1. Delimiters, Slashes, and Phantom Searches (Fixed in v4.4.4)

In Tachyon, message links reference folders using URL-safe hashes of their full name. This is essential because IMAP folder hierarchies use delimiters (such as `.` on Dovecot or `/` on Mailcow/Courier), spaces, and non-ASCII characters.

In v4.4.3, the message click handler erroneously passed the unhashed folder name into the URL. If a user opened an email in a nested folder like `Lists/dev`, the extra slash generated additional URL segments (`#/mailbox/Lists/dev/m123`). The router could not match this path, fell through, and parsed the trailing segments as pagination and search parameters. 

The result? The search input was populated with garbage, and the email never opened ([#153](https://github.com/kimusan/Tachyon/issues/153)). Dovecot setups with `.` delimiters never showed the bug during initial testing, but Mailcow and Courier users ran into it immediately.

### 2. Folder Hashes vs. Folder Names (Fixed in v4.4.5)

To address the delimiter issue, v4.4.4 correctly applied the URL-safe folder hash to the address bar. However, this introduced a subtle inversion in the route listener: the handler took the hash from the URL and treated it as the literal folder name.

When comparing the route's folder name against the message's actual full folder name, the check failed for any folder containing spaces, accents, or subfolders. The client then attempted to construct a replacement message targeting a nonexistent folder matching the hash, which failed silently. 

The symptom was baffling: the email body would load for a split second, only to be immediately cleared and replaced by a blank white view ([#155](https://github.com/kimusan/Tachyon/issues/155)). Huge thanks to **@remmmi** for pinpointing this down to the exact offending line.

### 3. Pagination Resets, Lost Searches & Thread State (Fixed in v4.4.6)

Even with folder resolution patched, writing message state into the URL exposed several other assumptions:

* **Pagination Reset**: Message links had nowhere to preserve the active page number. Opening an email from page 2 or 3 reset the route to page 1. When users tried to use the next/previous message arrow keys, the client traversed a page 1 list that didn't even contain the open message ([#157](https://github.com/kimusan/Tachyon/issues/157)).
* **Search Context Loss**: Opening an email from search results dropped the active search query, reloading the entire unfiltered folder behind the message view ([#157](https://github.com/kimusan/Tachyon/issues/157)).
* **Conversation & Threading Views**: The guard that prevents repeated list reloads on every click compared folder, page, and search parameters. However, in conversation mode, the thread UID travels inside the folder segment. As a result, clicking a conversation count displayed the entire mailbox list, clicking "Back to list" remained stuck inside the thread, and refreshing while viewing a threaded message reloaded the entire folder ([#156](https://github.com/kimusan/Tachyon/issues/156)).

---

## Where We Are Now: v4.4.6 is Live

In **v4.4.6**, we consolidated all address bar parameters—folders, pages, search queries, and message UIDs—so that they are parsed and applied in one centralized location.

If you are running Tachyon **v4.4.3, v4.4.4, or v4.4.5**, **upgrading to v4.4.6 is strongly recommended**. It resolves the vast majority of routing, folder delimiter, search retention, and pagination issues.

---

## The Road to v4.4.7: Auditing All Routes

Rather than continuing to play whack-a-mole with routing edge cases, **I am currently methodically working through every single possible route and navigation path in the codebase** to ensure that nothing else is broken.

While v4.4.6 stabilizes standard mailbox browsing, search, and pagination, a few subtleties remain around conversation/threading views (specifically around thread navigation transitions, returning from nested thread items, and thread state persistence).

**Tachyon v4.4.7** will be the release that ties everything together with fully verified routing across all mailbox views, conversation threads, and browser navigation actions.

Thank you to everyone in the community—especially **@codiflow**, **@remmmi**, **@lvarnava**, and **@floppybl**—for reporting issues, testing builds, and sharing detailed diagnostics. Your patience and feedback are what keep Tachyon moving forward!
