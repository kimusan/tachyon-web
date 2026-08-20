The Frequently Asked Questions area should help you to find solutions for common problems.

# Admin login fails
This is mostly due to the wrong login name or passphrase.
Open application.ini and modify the admin name and pass there.
Keep the passphrase setting empty and Tachyon will create one (just like at install).
For further issues check the logs.

# How do I enable logging?
Logs help the developer a lot to identify and fix problems. Logs are enabled in the `application.ini` file, that can be found in the directory `…/data/_data_/_default_/configs` of your Tachyon installation. There are different types of logs:
* Server side log (PHP)
  * Under [logs] OR [debug], set `enable = On`.
  * Get your log from `…/data/_data_/_default_/logs`.
  * Under [logs] you can also change `level = 4` to show/hide some messages from the logs. (when [debug] enabled it logs everything)
* Client side log (Javascript)
  * Under [debug], set `javascript = On`.
  * Click F12 to open the console in your browser and get the log from there.

# When I click on 'Display external images', nothing happens.
This is a security feature. You can enable it the following way:
* Login to the admin UI.
* Go to settings.
* Enable 'Use local proxy for external images'.

See also https://github.com/kimusan/Tachyon/wiki/Admin-Manual#menu-security

# Enable Filters
Tachyon requires Sieve for managing filters.
Sieve must be installed on the IMAP server and integrated in the IMAP daemon.
Currently there is no other way to manage filters.
When the IMAP supports Sieve, you can enable this in the Admin Panel of Tachyon (?admin) at Domains => "YOUR DOMAIN" => SIEVE.
There you have to check "Allow sieve scripts" and enter the data of your server (normally your IMAP server).

After enabling filters in the Admin Panel, the users can enter in their settings and should see a new menu "Filters" where for example a vacation message can be activated.

# [105] Missing tachyon/v/x.x.x/include.php
When you upgrade, a lot of files are replaced.
If `/tachyon/v/x.x.x/` exists, open `/index.php` and check the value of `APP_VERSION`.
When they are the same, your PHP OPcache does not reload the files and has the old file in cache and uses that.
Reload your PHP-FPM or FastCGI to get this solved.

# Nextcloud "App with id tachyon has invalid signature"
Sometimes a new version of the release is uploaded due to "built release" mistakes.<br>
But apps.nextcloud.com doesn't allow you to do anything (remove, revoke, special version numbers, etc.).<br>
So the result is that you can only overwrite an existing release and wait a few hours.<br>
Then Nextcloud updates to the signature and invalid becomes valid.<br>
It would have been good if NextCloud allowed version numbers like '3.0.12.0' and '3.0.12.1' but it marks them as "Unstable"

# 2FA
Everyone loves it, so we support TOTP.
Hardware keys are not supported yet, but with WebAuthn this could be possible.

# OAuth2 / OAUTHBEARER
This login mechanism is used by Gmail, Outlook and some others.
It is not fully supported by Tachyon due to a few reasons:
1. You must register your Tachyon instance (and domain name) at the OAuth provider (try it, and find the horror process)
2. Access and Refresh tokens expire randomly so there's no clue when operations fail and user must login again
3. User experience is off as you leave the website to a different one and come back later (hopefully)
4. There's no guarantee that the login response contains a valid email address to use
5. OpenID Connect (OIDC) is better, but not perfect yet.

# Gmail
For App Passwords, read: https://support.google.com/mail/answer/185833

v3.0.12+ supports Gmail OAuth2 as extension:
1. Go to https://console.cloud.google.com/apis/dashboard
2. Create a project
 ![create](https://github.com/the-djmaze/snappymail/assets/3752035/696a12a2-88e7-4878-834d-409f9f5df5d6)
3. Create OAuth credentials 
 ![credentials](https://github.com/the-djmaze/snappymail/assets/3752035/bbf30618-fc0d-46b0-bb02-8f72bb65eb77)
 ![credentials-clients](https://github.com/the-djmaze/snappymail/assets/3752035/604f214c-e53d-4bf3-97b3-f0824f35d5e0)
4. Setup the credentials in the Tachyon extension
 ![afbeelding](https://github.com/the-djmaze/snappymail/assets/3752035/292f7e27-2110-42d5-a4d0-9ab7a90c59fa)
