This article helps with the setup of Tachyon, it assumes a server that runs without a control panel (like cPanel, Plesk, DirectAdmin, etc.). Instructions for servers with a control panel will follow.

# Security considerations

Best practice would be to install webmail on a separate server, rather than on the mailserver. This creates service isolation and segmentation and tremendously benefits security. Despite the more hardened approach of this RainLoop fork, PHP doesn't have a perfect track record; hence, decreasing the attack surface through isolation/segmentation is considered best practice. Furthermore, this helps by increasing scalability and stability.

# Requirements

Tachyon requires PHP 8.2 (or a newer version) with the following extensions:
* mbstring
* Zlib
* json
* libxml
* dom

Optional extensions:
* cURL
* exif (when `image_exif_auto_rotate = On` and GD installed)
* gd, gmagick or imagemagick (for image resize and rotation)
* gnupg (encrypt/signed emails)
* iconv (is only used for `iconv_mime_encode` but not really needed either)
* intl (is used for IDN domain names, when not installed a PHP version is used)
* ldap (for contacts)
* openssl (for better encryption than XXTEA)
* PDO (MySQL/PostgreSQL/SQLite) (for contacts)
* redis (beta caching driver)
* Sodium (for even better encryption than XXTEA and OpenSSL)
* Tidy (tries to repair outgoing messages HTML structure)
* uuid (PECL)
* xxtea (PECL, to be faster than xxtea.php)
* zip (to download mail attachments as zip)

Supported Browsers: Google Chrome 69+, Firefox 78+, Opera 100+, Safari 12+, Edge 79+

## XXTEA, OpenSSL & Sodium

When OpenSSL and/or Sodium is detected, Tachyon will only use XXTEA for migrating from RainLoop.
After that it will use Sodium (best) or else OpenSSL to encrypt secure data.
It is advised to always have OpenSSL and Sodium installed.


# General instructions

## SSH
```sh
# Go to the directory where you want to install into
cd /var/www/webmail/tachyon
# Download and extract
wget https://github.com/kimusan/Tachyon/releases/latest/download/tachyon-latest.tar.gz
tar -xzf tachyon-latest.tar.gz
# Set permissions
find /var/www/webmail/tachyon -type d -exec chmod 755 {} \;
find /var/www/webmail/tachyon -type f -exec chmod 644 {} \;
chown -R www-data:www-data /var/www/webmail/tachyon
```

## FTP
1. Grab the latest release [from the releases page](https://github.com/kimusan/Tachyon/releases).
2. Extract the release in an empty directory.
3. Upload the directory content to the document root of the (sub)domain that is serving webmail
4. You can then set correct permissions and owner through shell, like:
```
find /home/user/public_html/tachyon -type d -exec chmod 755 {} \;
find /home/user/public_html/tachyon -type f -exec chmod 644 {} \;
chown -R user:user /home/user/public_html/tachyon
```

## Now access the admin page
Open the admin UI `https://example.com/?admin` to configure your mail server settings.

First time login?
1. Open `/?admin` so that it can create `admin_password.txt`
2. Login with the user "admin" and the passphrase from the file `data/_data_/_default_/admin_password.txt`.
3. After login change the username and passphrase at `Admin => Security`

If you have problems to call the admin UI, please try it in private mode of your browser. This way cookies and other cached data of previous installations are ignored.

## Admin password
:heavy_exclamation_mark: The password-file is created after first opening the admin UI!

:heavy_exclamation_mark: Be sure to immediately change the default password!

:heavy_exclamation_mark: after changing the default password the `admin_password.txt` is deleted.
```
www.yourdomain.com/webmail?admin
```

## Secure `data` folder
You can move the `data` folder outside public HTTP access for security.
1. Rename /var/www/webmail/_include.php to /var/www/webmail/include.php
2. Edit include.php and in there set the new APP_DATA_FOLDER_PATH. Like:
```php
/**
 * Custom 'data' folder path
 */
//define('APP_DATA_FOLDER_PATH', dirname(__DIR__) . '/tachyon-data/');
//define('APP_DATA_FOLDER_PATH', '/var/external-tachyon-data-folder/');
define('APP_DATA_FOLDER_PATH', '/var/lib/tachyon/');
```

## GPG verify
The GPG key to verify a package can be found at several places:
* https://keyserver.ubuntu.com Hockeypuck OpenPGP keyserver
https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x1016e47079145542f8ba133548208ba13290f3eb
* https://github.com/kimusan/Tachyon/blob/master/build/Tachyon.asc

# Upgrade
To upgrade the installation, you simply need to upload files from the new package overwriting existing files. Directory structure is organized to have each new version installed to a different directory. Only a few files will be actually overwritten (/index.php and /data/VERSION).

All the additional reconfiguration will be done by the product on next run.

Then when everything works, you may remove any old version that resides in /tachyon/v/.

# Migration/Upgrade from RainLoop
Tachyon is a semi-drop-in replacement for RainLoop. Due to changes in the plugin/extension management code, most plugins from RainLoop are not compatible, so you will need to replace them with equivalents from this Tachyon repository, or if they're custom plugins, modify the code for compatibility with Tachyon. See the plugins directory in this repository for samples to determine how best to modify your custom plugins to work with Tachyon.

If you have very few plugins activated, you can expect minimal downtime from this migration. If there are many, it may take several hours to replace them all with compatible code.

For domain name files, the .INI file format has been upgraded to JSON, but comparing examples should make this fairly straight-forward since the keywords used in the .INI files are named the same as the keys in the corresponding .JSON files.

1. Backup your RainLoop directory and database (this is essential in case of issues with the migration)
2. In the RainLoop admin, make note of each plugin you have which is activated and check to be sure a [Tachyon equivalent exists here](https://github.com/kimusan/Tachyon/tree/master/plugins). If you have plugins for which there is no equivalent, you'll need to write that code or hire a dev to do so before proceeding.
3. Extract the latest Tachyon release over top of your RainLoop folder structure (the data folder is not touched)
4. Navigate to `data/_data_/_default_/plugins` and backup the contents (`tar -cvzf rainloop_plugins.tgz *`) then erase the folder contents.
5. Ensure file and folder permissions are set correctly by running the commands above under "Set the correct permissions"
5. Visit the Tachyon admin URL and attempt logging in as the admin. If admin login fails, with an unknown error, edit `data/_data_/_default_/configs/application.ini` and comment out the admin_password line (`;admin_password=`) then try your admin login again using the newly generated password that Tachyon placed in `data/_data_/_default_/admin_password.txt`
6. Once you have successfully logged in as admin, remove that admin_password.txt file and either save or change the password to another secure value
7. Install each Tachyon replacement plugin for the plugins you noted in step (2)




# Migration/Upgrade from SnappyMail

Tachyon is a drop-in replacement for SnappyMail. The data directory and configuration files are fully compatible.

1. Backup your SnappyMail directory and the `data/` folder.
2. Extract the latest Tachyon release over your SnappyMail installation, overwriting files. The `data/` directory is not touched.
3. Delete the old `snappymail/` directory once you have confirmed Tachyon is working:
   ```sh
   rm -rf /var/www/webmail/snappymail
   ```
4. Plugins written for SnappyMail are compatible with Tachyon. Third-party plugins using the `RainLoop\` namespace will continue to work via the compatibility alias built into Tachyon.

# Integrations

## Email providers
* https://mxroute.com/
* https://openmbox.net/
* https://xyamail.com/

## Arch Linux

https://aur.archlinux.org/packages/tachyon

## Debian / Devuan

Download the `.deb` package from the [releases page](https://github.com/kimusan/Tachyon/releases/latest) and install it:
```sh
dpkg -i tachyon-*.deb
```


## Cloudron

https://www.cloudron.io/store/eu.tachyon.cloudronapp.html

## cPanel
1. Download `tachyon-*-cpanel.tar.gz` from https://github.com/kimusan/Tachyon/releases/latest
2. Extract file
3. Upload the content to your server root (`/`)
4. Open a webmail account from WHM and choose Tachyon

Data will be stored at:
* `/home/<username>/var/tachyon` contains user and application settings
* `/home/<username>/logs/tachyon` contains logs (when active)
* `/home/<username>/tmp/tachyon` contains the cache


## CyberPanel

An install script is available at `integrations/cyberpanel/install.php` in the repository.

1. Install Tachyon files to `/usr/local/CyberCP/public/tachyon`
2. Run `php integrations/cyberpanel/install.php` as root to configure the data folder and enable required plugins

Data will be stored at `/usr/local/lscp/cyberpanel/tachyon/data/`.

## FreeBSD

TODO

## HestiaCP

See installation script at https://github.com/kimusan/Tachyon/tree/master/integrations/hestiacp

## Nextcloud

Information how to install the Nextcloud App for Tachyon can be found here https://github.com/kimusan/Tachyon/blob/master/integrations/nextcloud/tachyon/README.md.

The app itself can also be found in the Nextcloud App Directory at https://apps.nextcloud.com/apps/tachyon.

## OwnCloud

Information how to install the OwnCloud App for Tachyon can be found here https://github.com/kimusan/Tachyon/blob/master/integrations/owncloud/tachyon/README.md.

## NixOS
TODO

## YunoHost

https://github.com/YunoHost-Apps/tachyon_ynh (Coming Soon)

## QNAP

https://www.myqnap.org/?s=Tachyon&post_type=product (coming soon)

## Virtualmin

An install script is available at `integrations/virtualmin/tachyon.pl` in the repository. Copy it to your Virtualmin scripts directory to make Tachyon available as an installable script in the Virtualmin web interface.

# Webserver configuration
## Nginx
```
###
# Redirect non-secure (unencrypted) HTTP to the more secure (encrypted) HTTPS
server {
	listen 80 default_server;
	listen [::]:80 default_server;
	server_name _;
	return 301 https://$host$request_uri;
}

###
# Actual domain configuration
server {
	###
	# TLS for the win!
	listen 443 ssl http2;
	listen [::]:443 ssl http2;

	###
	# Domain name
	server_name webmail.example.com;

	###
	# SSL configuration
	ssl_certificate /etc/letsencrypt/live/webmail.example.com/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/webmail.example.com/privkey.pem;
	ssl_protocols TLSv1.2 TLSv1.3;
	ssl_ciphers "ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-CHACHA20-POLY1305:AES-256-GCM-SHA384:EECDH+AESGCM:EDH+AESGCM";
	ssl_ecdh_curve secp521r1:secp384r1;
	ssl_session_timeout  10m;
	ssl_session_cache    shared:SSL:10m;
	ssl_session_tickets off;
	ssl_prefer_server_ciphers on;

	###
	# Security headers
	add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
	add_header X-Content-Type-Options "nosniff" always;
	add_header X-XSS-Protection "1; mode=block" always;
	add_header X-Robots-Tag "none" always;
	add_header X-Download-Options "noopen" always;
	add_header X-Permitted-Cross-Domain-Policies "none" always;
	add_header Referrer-Policy "no-referrer" always;
	add_header X-Frame-Options "SAMEORIGIN" always;
	fastcgi_hide_header X-Powered-By;

	###
	# GZIP / compression settings
	gzip on;
	gzip_vary on;
	gzip_comp_level 4;
	gzip_min_length 256;
	gzip_proxied expired no-cache no-store private no_last_modified no_etag auth;
	gzip_types application/atom+xml application/javascript application/json application/ld+json application/manifest+json application/rss+xml application/vnd.geo+json application/vnd.ms-fontobject application/x-font-ttf application/x-web-app-manifest+json application/xhtml+xml application/xml font/opentype image/bmp image/svg+xml image/x-icon text/cache-manifest text/css text/plain text/vcard text/vnd.rim.location.xloc text/vtt text/x-component text/x-cross-domain-policy;

	###
	# Define the document root
	root /var/www/webmail;
	index index.php;

	client_max_body_size 50M;

	###
	# Forbid access to dotfiles
	location ~ (^|/)\. {
		return 403;
	}

        location ~ ^/data/ {
            deny all;
        }

	###
	# The actual root location
	location / {
                try_files $uri $uri/ /index.php?$args;
	}

	###
	# Last but not least, the PHP-FPM settings
	location ~* \.php$ {
		fastcgi_pass    unix:/run/php-fpm.sock;
		include         fastcgi_params;
		fastcgi_param   SCRIPT_FILENAME    $document_root$fastcgi_script_name;
		fastcgi_param   SCRIPT_NAME        $fastcgi_script_name;
	}

}
```
**Note** if you use the preload setting in your Strict-Transport-Security, you need to support the domain to https://hstspreload.org/ (read the page carefully as it can lock out the page several month)
## Apache + PHP-FPM
```
Listen 2096
<Macro VHWebMail $host>
	<VirtualHost *:2096>
		ServerName $host
		ServerAdmin webmaster@$host
		DocumentRoot /home/tachyon/public_html

# Security headers
Header always set Strict-Transport-Security "max-age=31536000"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Xss-Protection "1; mode=block"
Header always set Referrer-Policy "no-referrer"
Header always set X-Frame-Options "SAMEORIGIN"
	
#		RemoveHandler cgi-script .cgi .pl .plx .ppl .perl
		UseCanonicalName Off
		<Directory /home/tachyon/public_html>
			Options -ExecCGI -Includes -Indexes
#			DirectoryIndex index.html index.php
			AllowOverride All
			Require all granted
		</Directory>
	
		<IfModule userdir_module>
			<IfModule !mpm_itk.c>
				<IfModule !ruid2_module>
					<IfModule !mod_passenger.c>
						UserDir disabled
						UserDir enabled tachyon
					</IfModule>
				</IfModule>
			</IfModule>
		</IfModule>
		<IfModule mpm_itk.c>
			AssignUserID tachyon tachyon
		</IfModule>
	
		<IfModule include_module>
			<Directory "/home/tachyon/public_html">
				SSILegacyExprParser On
			</Directory>
		</IfModule>

		<IfModule mod_expires.c>
			ExpiresActive On
			ExpiresByType text/css A15768000
			ExpiresByType text/html A15768000
			ExpiresByType application/javascript A15768000
			ExpiresByType image/gif A15768000
			ExpiresByType image/jpeg A15768000
			ExpiresByType image/png A15768000
			ExpiresByType image/svg+xml A15768000
			ExpiresByType image/webp A15768000
			ExpiresByType image/vnd.microsoft.icon A15768000
			ExpiresByType font/woff A15768000
		</IfModule>

		<IfModule mod_deflate.c>
			<IfModule mod_headers.c>
				# Serve gzip compressed CSS and JS files if they exist
				# and the client accepts gzip.
				RewriteCond "%{HTTP:Accept-encoding}" "gzip"
				RewriteCond "%{REQUEST_FILENAME}\.gz" -s
				RewriteRule "^(.*)\.(css|js)"         "$1\.$2\.gz" [QSA]

				# Serve correct content types, and prevent mod_deflate double gzip.
				RewriteRule "\.css\.gz$" "-" [T=text/css,E=no-gzip:1]
				RewriteRule "\.js\.gz$"  "-" [T=text/javascript,E=no-gzip:1]

				<FilesMatch "(\.js\.gz|\.css\.gz)$">
					# Serve correct encoding type.
					Header append Content-Encoding gzip
					# Force proxies to cache gzipped &
					# non-gzipped css/js files separately.
					Header append Vary Accept-Encoding
				</FilesMatch>
			</IfModule>

			AddOutputFilterByType DEFLATE text/css text/html text/plain text/xml application/xml text/javascript application/javascript
			AddOutputFilterByType DEFLATE font/opentype font/otf font/ttf font/woff
		</IfModule>
	
		# With this approach, you can't check for the existence of the resource.
#		ProxyPassMatch "^/([^.]+\.php(/.*)?)$" "unix:/run/php-fpm/tachyon.sock|fcgi://127.0.0.1/home/tachyon/public_html/" enablereuse=on flushpackets=on
		# With this approach, you can check for the existence of the resource prior to proxying to the php-fpm backend.
		<Proxy "fcgi://tachyon/" enablereuse=on flushpackets=on>
		</Proxy>
		<FilesMatch \.(php|phar)$>
			AcceptPathInfo On
			SetEnvIfNoCase ^Authorization$ "(.+)" HTTP_AUTHORIZATION=$1
			SetHandler "proxy:unix:/run/php-fpm/tachyon.sock|fcgi://tachyon/"
		</FilesMatch>

		ErrorLog /home/tachyon/logs/$host-https_error.log
		TransferLog /home/tachyon/logs/$host-https_access.log
		LogLevel warn

		SSLEngine on
		SSLCertificateFile /etc/letsencrypt/live/$host/fullchain.pem
		SSLCertificateKeyFile /etc/letsencrypt/live/$host/privkey.pem
	</VirtualHost>
</Macro>

use VHWebMail webmail.example.com
```
