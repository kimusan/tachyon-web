---
title: "The Browser Back Button Odyssey: Rapid Releases & The Path to v4.4.7"
date: "2026-10-16"
author: "Kim Schulz"
authorUrl: "https://schulz.dk"
authorAvatar: "/images/kim-schulz.webp"
tags: ["Release", "Routing", "UX", "Bugfix"]
summary: "A simple, much requested feature, letting the browser Back button close an open email, set off a run of subtle routing bugs across v4.4.3 to v4.4.6. Here is the technical story, why v4.4.6 is the one to run today, and what v4.4.7 still has to fix."
coverImage: ""
featured: true
---

Four releases in two days, three of them today, to clean up after one change.

In [v4.4.3](https://github.com/kimusan/Tachyon/releases/tag/v4.4.3) we shipped what looked like a small quality-of-life feature ([#141](https://github.com/kimusan/Tachyon/issues/141)): **the browser Back button closes an open email and returns you to the mailbox list**, and every message gets its own address (`#/mailbox/<folder>/m<uid>`).

The route handler had understood message addresses for a long time. What had never happened was the other half: the interface never pushed a history entry or wrote those addresses into the address bar. Doing that in a single-page webmail client, against whatever IMAP server a user happens to run, turned out to be far more involved than it looked. Every message click reset a different piece of mailbox state, and each one surfaced as its own bug: **v4.4.4**, **v4.4.5**, **v4.4.6**.

Here is what went wrong, where things stand, and what is left for **v4.4.7**.

---

## How one feature triggered three releases

### 1. Delimiters, slashes and phantom searches (fixed in v4.4.4)

Message links name a folder by a URL-safe hash of its full name. That is not decoration: IMAP hierarchies use a separator, which is `.` on a default Dovecot and `/` on others, and folder names also hold spaces and non-ASCII characters.

In v4.4.3 the message click handler passed the unhashed folder name into the address. Open an email in a nested folder like `Lists/dev` and the extra slash produced extra path segments (`#/mailbox/Lists/dev/m123`). No route matched that, and the leftover segments were read as the page and the search.

The result: the search box filled with what looked like nonsense, and the email never opened ([#153](https://github.com/kimusan/Tachyon/issues/153)). Any folder named only in plain ASCII hashes to itself, so `INBOX` behaved perfectly and the bug was invisible here. A separator of `.` is also safe, which is why a default Dovecot setup showed nothing, while a server configured with `/`, as Mailcow is, broke on the first click.

### 2. Folder hashes against folder names (fixed in v4.4.5)

The fix in v4.4.4 correctly wrote the URL-safe hash. That exposed an inversion on the way back in: the route handler took the hash out of the address and used it as the folder name.

Comparing that hash against the open message's real folder name never matched for any folder with a space, an accent or a parent. The client then built a replacement message pointing at a folder that does not exist, and the request for it was dropped without a word.

The symptom was odd enough to be hard to report: the body loaded for an instant, then went blank ([#155](https://github.com/kimusan/Tachyon/issues/155)). Thanks to **@remmmi**, who took it to the exact line.

### 3. Pagination, lost searches and thread state (fixed in v4.4.6)

With folders resolving properly, writing message state into the address bar exposed three more assumptions:

* **The page was reset.** A message link has nowhere to record which page you were on, so the route reported page one for all of them. Open an email from page 2 or 3 and the list came back at the top, after which the next and previous arrows walked a list that no longer held the open message and looked dead ([#157](https://github.com/kimusan/Tachyon/issues/157)).
* **The search was dropped.** Opening an email from a result list threw the search away and reloaded the whole unfiltered folder behind it ([#157](https://github.com/kimusan/Tachyon/issues/157)).
* **Conversations.** The test that stops the list refetching on every click compares the folder, the page and the search. In a conversation the thread id travels inside the folder segment, so it is none of those. Clicking a conversation count showed the whole mailbox, Back to list stayed inside the thread, and a refresh while reading a threaded message came back with the entire folder ([#156](https://github.com/kimusan/Tachyon/issues/156), thanks **@floppybl**).

---

## Two bugs that looked identical

Worth recording, because it cost a day. After v4.4.6 shipped, conversations still failed on my own mailbox, on a perfectly correct address, with the fix demonstrably in the build.

They were two separate bugs wearing the same symptom. The one above is in the browser. The other is on the server: `MessageList` has a branch for folders larger than `message_list_limit`, 10000 by default, that answers with the most recent slice and says plainly that it does not use THREAD. A request naming one conversation fell into it and came back as the unthreaded folder, with the thread id still echoed, so the client drew a "Back to message list" button over the whole mailbox.

It could not escape either, because the one thing that clears that limit is a cached lookup that is itself skipped when a conversation is named. In any folder past 10000 messages, no conversation could be opened at all. No code change was needed to turn this on: a mailbox growing past the limit is enough, which is why it had worked for years and then stopped.

That fix is on master, not in v4.4.6.

---

## Where we are now: v4.4.6 is live

v4.4.6 pulls every piece of state the address bar carries, the folder, the page, the search and the message, into one place that reads it and applies it together, instead of each one defaulting separately and overwriting what was there.

If you are on **v4.4.3, v4.4.4 or v4.4.5**, move to **v4.4.6**. It settles the folder separator, blank message, search retention and pagination problems.

One caveat: if any of your folders holds more than 10000 messages, opening a conversation in it is still broken in v4.4.6. That is the server-side bug above and it needs v4.4.7.

---

## The road to v4.4.7

Rather than keep fixing these one report at a time, I went through every place in the client that writes the address bar, twelve of them, and checked each against the state the route handler applies. Eleven were already right. The twelfth was a bug nobody had reported: reloading the browser while reading a message inside a conversation came back with the whole folder behind it.

**v4.4.7** will carry three fixes that are on master and already confirmed by the people who found them:

* conversations in folders over `message_list_limit`, the server-side bug above
* the whole folder sitting on screen, with no spinner, while a conversation loads, which made a slow fetch look like a failure
* crossing a page boundary with the next and previous arrows flashing the next page's list before the message, which only shows on mobile, where the list and the message are separate views (thanks **@lvarnava**)

I want to be straight about the limits of that audit. It covers the code that writes and reads the address bar, which is where all of this went wrong, and it found one real bug. It is not a proof. Nothing in the test suite can currently stand up the client's state and drive a route through it, and the server-side problem needs a mailbox of over ten thousand messages to see at all. Both of those are worth fixing, and neither is a morning's work.

Thanks to **@codiflow**, **@remmmi**, **@lvarnava** and **@floppybl**, who between them reported the symptoms, tested builds, and in two cases handed me the offending line.
