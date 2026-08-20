When you click on a domain at `?admin#/domains`, you can disable capabilities on the IMAP tab.
You can also do this at `data/_data_/_default_/domains/*.json`.
This allows you to prevent errors in the IMAP server or [improve speed](https://github.com/kimusan/Tachyon/wiki/Improve-performance#disable-capabilities).


![image](https://github.com/the-djmaze/snappymail/assets/3752035/9b73c7cb-4f90-4e93-9e17-1b4b7325db0a)

By default a few capabilities are shown. If you want all capabilities that the server supports, you must hit the `[Test]` button WITH login credentials.

Below you will find info about each capability.

# Used by Tachyon

## ACL / RIGHTS=
Allows a user to see which access permissions a certain folder/mailbox has.
In the future this also allows the user to add/edit/delete the access for others.
![image](https://github.com/the-djmaze/snappymail/assets/3752035/f08fb4db-0c9e-41fb-8233-98d8939bf370)

## APPENDLIMIT
This provides the ability to advertise a maximum upload size allowed by the IMAP server, so that we know the size limitation.

## AUTH=*
Which type of login methods are allowed to use.
Can be things like: LOGIN, PLAIN, SCRAM, etc.

## BINARY
This lets the server perform content-type decoding prior to transmitting message data.
When disabled, Tachyon has to decode the data itself through PHP (in the future maybe through JavaScript).
If the server fails in decoding, it is best to disable this capability.

## CONDSTORE
This is a very important capability that allows for better cache handling by fetching the HIGHESTMODSEQ of the folder/mailbox.
Also read [QRESYNC](#qresync)

## ENABLE
This enables features on the server. Currently 2 are used:
1. `IMAP4rev1` to tell IMAP4rev2 server to use v1
2. `UTF8=ACCEPT` to tell the server we want to communicate in UTF-8 mode


## LIST-EXTENDED
Allows to instantly fetch more folder/mailbox info with the LIST command.
Like:
* [CHILDREN](#children)
* [SPECIAL-USE](#special-use)
* SUBSCRIBED

Disabling this feature allows faster loading of the folders list.
Tachyon will then ask the status of each folder later in a queue.

## LIST-STATUS
Allows to instantly fetch more folder/mailbox info with the LIST command.
Like:
* STATUS
* MESSAGES
* UNSEEN
* UIDNEXT
* UIDVALIDITY
* HIGHESTMODSEQ _(requires capability [CONDSTORE](#condstore) or [QRESYNC](#qresync))_
* [APPENDLIMIT](#appendlimit)
* SIZE _(requires capability [STATUS=SIZE](#statussize))_
* MAILBOXID _(requires capability [OBJECTID](#objectid))_

## LITERAL+

## METADATA
This is used to get more information about the folders.
Like: comments, special-use and kolab folder type.

## MOVE

## NAMESPACE

## OBJECTID
Is used to fetch the MAILBOXID of each folder/mailbox.

Cyrus mail server has a [bug](https://github.com/kimusan/Tachyon/issues/1640) that crashes with this capability.
In this case disable it.

## PREVIEW

## QRESYNC
When [CONDSTORE](#condstore) is not available (disabled), this is used for better cache handling of the folder/mailbox.

## SASL-IR
When enabled, this makes the login process faster.

## SORT

## SPECIAL-USE
Allows to know which folders/mailboxes are default for sent, archive, trash, etc.

## STATUS=SIZE
Allows to show how much bytes the folders/mailboxes contains.

## THREAD
Allows to show message threads

## UIDPLUS

## UNSELECT

## WITHIN


# Currently not used

## CATENATE

## CHILDREN
Returns the `\haschildren` or `\hasnochildren` flag on folders/mailboxes.
This is handy to know if a certain folder/mailbox has children, but currently not used by because the complete mailbox hierarchy is loaded.

## CONTEXT=SEARCH

## ESEARCH
Used by `\MailSo\ImapClient::MessageSimpleESearch()` to fill the messages list

## ESORT
Used by `\MailSo\ImapClient::MessageSimpleESort()` to fill the messages list

## I18NLEVEL=1

## ID
Used by `\MailSo\ImapClient::ServerID()`

## IDLE

## LOGIN-REFERRALS

## MULTIAPPEND

## NOTIFY

## SAVEDATE

## SEARCHRES

## URL-PARTIAL
