imapsync.php is a command line tool for syncing, copying, migrating, and archiving email mailboxes between two imap servers, one way, and without duplicates.

It is similar to the https://imapsync.lamiral.info/ script.
But there are differences to cope with special IMAP extensions (like handling the METADATA and custom flags), as discussed in https://github.com/kimusan/Tachyon/issues/419

Example:
```
/path/to/tachyon/v/3.0.12/imapsync.php \
  --host1 test1.tachyon.eu \
  --user1 test1               \
  --password1 "secret1"       \
  --host2 test2.tachyon.eu \
  --user2 test2               \
  --password2 "secret2"
```


## OPTIONS
```
    usage: imapsync.php [options]

    The standard options are the six values forming the credentials. Three
    values on each side are needed to login into the IMAP servers. These six
    values are a hostname, a username, and a password, two times.

  OPTIONS/credentials

     --host1        : Source or "from" imap server.
     --port1        : Port to connect on host1.
                      Optional since default ports are the
                      well known ports imap/143 or imaps/993.
     --user1        : User to login on host1.
     --password1    : Password of user1.

     --host2        : "destination" imap server.
     --port2        : Port to connect on host2. Optional
     --user2        : User to login on host2.
     --password2    : Password of user2.

    If you don't pass the user1 password via --password1 then imapsync will
    prompt to enter the password on the terminal. Same thing for user2 password.

  OPTIONS/encryption

     --nossl1       : Do not use a SSL connection on host1.
     --ssl1         : Use a SSL connection on host1. On by default if possible.

     --nossl2       : Do not use a SSL connection on host2.
     --ssl2         : Use a SSL connection on host2. On by default if possible.

     --notls1       : Do not use a TLS connection on host1.
     --tls1         : Use a TLS connection on host1. On by default if possible.

     --notls2       : Do not use a TLS connection on host2.
     --tls2         : Use a TLS connection on host2. On by default if possible.

  OPTIONS/folders

     --rootfolder   : prepend this name to each target folder.
                      For example `--rootfolder "test"` then "INBOX" becomes "test.INBOX"

  OPTIONS/behavior

     --timeout1     : Connection timeout in seconds for host1.
                      Default is 300 and 0 means no timeout at all.
     --timeout2     : Connection timeout in seconds for host2.
                      Default is 300 and 0 means no timeout at all.

     --justconnect  : Just connect to both servers and print useful information.

     --justlogin    : Just login to both host1 and host2 with users
                      credentials, then exit.

     --help         : print this help.
```
