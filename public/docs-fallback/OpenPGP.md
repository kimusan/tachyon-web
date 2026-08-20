When OpenPGP is enabled by admin, you will have options to encrypt, decrypt, sign and verify messages.

These can be achieved with: Mailvelope, OpenPGP.js and GnuPG.
Difference is that GnuPG runs on the server and the others in your browser.

# Sign
Signing a message requires the passphrase of your private key.
For safety the system will first check if it is possible with OpenPGP.js else GnuPG.

## OpenPGP.js
* Sign only text/html
* Not the attachments
* Done in browser so that server doesn't need your passphrase
* This is the primary choice

## GnuPG
* Sign everything
* Done on server, passphrase less secure as it is transmitted (https recommended)
* This is the secondary choice

## Mailvelope
Not possible

# Encrypt
Encrypting a message doesn't need a passphrase, because that is done with public keys.
The system will first try GnuPG else OpenPGP.js.

## GnuPG
* Encrypt everything
* Done on server, send to server unencrypted (https recommended)
* This is the primary choice

## OpenPGP.js
* Encrypt only text/html
* Not the attachments
* Done in browser, so send to server encrypted
* This is the secondary choice

## Mailvelope
Use the special button in compose window to activate.
* Encrypt only text & attachments
* HTML not possible
* Done in browser, so send to server encrypted


# Sign and Encrypt
This combination is also possible and follows the above rules.
For a good understanding we explain each possible method.

## OpenPGP.js sign + GnuPG encrypt
This is the primary choice used as it follows all above mentioned rules.

## OpenPGP.js
Happens when GnuPG is not installed on the server or doesn't have all required public keys.

## GnuPG
Happens when OpenPGP.js doesn't have the private key to sign messages.

## Mailvelope
Not possible, because you can't select the private key to sign with.
Only the default key is used and that is an issue when sending from different e-mail addresses then the Mailvelope default on and we can't see which is the default.

# GnuPG notes
On the server GnuPG is used in one of two ways:
* As PHP extension https://php.net/gnupg and must be version 1.5+
* Else using the system command `gpg` when it is found using `which gpg` or in some `bin` directories

To know which your server is using, go to Tachyon Admin -> About.
There it will show a cross or check for GnuPG.
* ✔ = PHP GnuPG extension is used
* ❌ = gpg command line is used
