If Tachyon feels very slow or sluggish or shows no messages, we need to find out why that is.
Using the full debug mode and analyzing the log, you may find the issue and probably a solution.

# First turn on debugging and Login
1. Go to `Admin -> Config` and find the option `debug` and turn it on.
Then at the bottom hit the `Save` button.
2. Open a new browser tab and login with an email account.
3. When fully loaded go back to Admin and turn off the `debug` mode to prevent noise of other logging.

# Analyzing the log
Open the log at `_data_/_default_/logs/*.txt` and we will walk you through the process.

## Setup connection speed
```
IMAP[INFO]: Start connection to "tcp://localhost:143"
IMAP[DEBUG]: 0.00046396255493164 (raw connection)
```
This is the time it took to make a connection with the server.

```
IMAP[INFO]: < * OK [CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID ENABLE IDLE LITERAL+ STARTTLS AUTH=PLAIN AUTH=LOGIN] Dovecot ready.\r\n
IMAP[DEBUG]: 0.0017571449279785 (*)
```
This is the time it took to the connection and get the first response from the server.
If the response doesn't have `[CAPABILITY`, the next question to the server is `IMAP[INFO]: > TAG CAPABILITY\r\n` to get all capabilities.

## Requests speed

Now the connection is fully set and we go ask the server to STARTTLS or AUTHENTICATE.

```
IMAP[INFO]: > TAG AUTHENTICATE PLAIN Base64==\r\n
IMAP[DEBUG]: 0.27842593193054 (TAG)
```
This is the time it took to login on the server.

Now each additional request is the same way:
```
IMAP[INFO]: > TAG ....\r\n
IMAP[INFO]: < ...\r\n
IMAP[DEBUG]: 0.27842593193054 (TAG)
```

## Finished total speed

And finally it ends with the LOGOUT and the total time it took.
```
IMAP[INFO]: Disconnected from "tcp://localhost:143" (success)
IMAP[DEBUG]: 0.28226494789123454 (net session)
```

# Things that could speed up your instance and prevent timeouts

## IMAP Proxy
Dovecot allows you to keep remote connections alive by proxying
https://doc.dovecot.org/admin_manual/dovecot_proxy/

## Disable capabilities
How to can be found at: https://github.com/kimusan/Tachyon/wiki/IMAP-capabilities

### Disable folders LIST-STATUS
1. Go to Admin -> Domains -> "the domain"
2. In the `Disable capabilities` section check `LIST-STATUS`
3. Hit the save button at the bottom

RFC 5819 LIST-STATUS is a way to return a lot of info instantly from the IMAP server.
This way Tachyon only has to do 1 request to the IMAP server to fetch all required information of all folders.
When the IMAP server is slow (for whatever reason) this kind of request can take a very long time.
With the above setting you disable the feature and Tachyon has to do several requests on the background (depends on the amount of folders).

### Disable folders METADATA
1. Go to Admin -> Domains -> "the domain"
2. In the `Disable capabilities` section check `METADATA`
3. Hit the save button at the bottom

The folders METADATA is fetched to support RFC 5464, RFC 6154 and Kolab.
With the above setting you disable the feature and Tachyon has no support to check for comments nor special-use nor integrate with Kolab.

### Disable folders STATUS SIZE
1. Go to Admin -> Domains -> "the domain"
2. In the `Disable capabilities` section check `STATUS SIZE`
3. Hit the save button at the bottom

With STATUS SIZE each folder size is calculated by the IMAP software and shown in the Settings -> Folders section

Also read https://github.com/kimusan/Tachyon/issues/1303

### Disable messages SORT(ing)
1. Go to Admin -> Domains -> "the domain"
2. In the `Disable capabilities` section check `SORT`
3. Hit the save button at the bottom

Sorting relies on the smart capabilities of the IMAP software.
When it is slow, this speeds things up, but does disable the sorting features.
Messages will probably be shown based on receival so when an old message is received it will be shown as first and the list could be a big mess.

Read more at https://github.com/kimusan/Tachyon/issues/1022

### Disable messages THREAD(ed) view
1. Go to Admin -> Domains -> "the domain"
2. In the `Disable capabilities` section check `THREAD`
3. Hit the save button at the bottom

When fetching the messages list Tachyon can combine messages in a thread.
This relies on the smart capabilities of the IMAP software.
When it is slow, this speeds things up, but does disable the threaded view features.

### Disable messages PREVIEW
1. Go to Admin -> Domains -> "the domain"
2. In the `Disable capabilities` section check `PREVIEW`
3. Hit the save button at the bottom

When fetching the messages list, Tachyon can also fetch preview text of each message.
When the IMAP software has no preview cached, it must analyze the message body and cache it.
When disabled the IMAP software does not generate previews.

## Shorten messages list
1. Go to Admin -> Domains -> "the domain"
2. In the `Limits` section set `Messages` to an amount you prefer (say 1000)
3. Hit the save button at the bottom

When there are more then N messages (say 1000) the system will not fetch all messages uid's for sorting.
It will only fetch a subset to speed things up.

## Also read issues
- https://github.com/kimusan/Tachyon/issues/724
- https://github.com/kimusan/Tachyon/issues/1071

# Dovecot
You can speed this up using ElasticSearch https://github.com/filiphanes/fts-elastic
