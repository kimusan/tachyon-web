_This project is a fork of RainLoop and aims to apply hardening, modernization and a more lightweight experience._

# Installation

For a detailed overview on installing Tachyon, please see the [installation instructions](https://github.com/kimusan/Tachyon/wiki/Installation-instructions).

Tachyon is also available as a **Nextcloud app** on the [Nextcloud App Store](https://apps.nextcloud.com/apps/tachyon).

# Development

To learn how to contribute code to Tachyon, please see the [contributing instructions](https://github.com/kimusan/Tachyon/blob/master/CONTRIBUTING.md).

# Changes

_This fork implements the following changes in comparison to upstream:_

* **Privacy/GDPR friendly** (removed Sentry, Gravatar, Facebook, Google, Twitter, DropBox, OwnCloud and X-Mailer links/inclusion)
* **More secure admin hashing algorithm** (uses password_hash/password_verify)
* **Added features/functionality:**
  * Auth failed attempts written to syslog (for fail2ban and others)
  * Option to remove background/font colors from messages for real "dark mode"
  * Modified [Squire](https://github.com/kimusan/Squire/tree/tachyon) HTML editor as replacement for CKEditor
  * Better memory garbage collection management
  * Advanced Sieve filter scripts editor
  * No user-agent detection (use device width)
  * Split Admin specific JavaScript code from User code
* **More modern PHP approach:**
  * Requires PHP 8.2+ with the mbstring extension
  * Replaced pclZip with PharData and ZipArchive
  * Prefer the yaml extension, fallback to the old Spyc
* **Removed features/functionality:**
  * Background video support
  * BackwardCapability (class \Tachyon\Account)
  * ChangePassword (re-implemented as plugin)
  * OAuth support
  * POP3 support (this fork supports only IMAP)
* **Ongoing removal of old JavaScript code**
* **Dropped gulp-uglify in favor of gulp-terser**
* **Replaced webpack with rollup**

# Removal of old JavaScript

This fork uses downsized/simplified versions of scripts and has no support for Internet Explorer, resulting in increased performance and a smaller pageload, which benefits mobile devices. Things might work in Edge 15-18, Firefox 47-62 and Chrome 54-68 due to one polyfill for array.flat().

* Removed pikaday
* Removed underscore
* Removed polyfills
* Removed Modernizr
* Removed nanoscroll
* Removed lightgallery
* Removed jQuery
* Removed matchmedia-polyfill
* Removed momentjs (use Intl)
* Removed opentip (use CSS)

RainLoop 1.15 vs Tachyon

|js/*           	|RainLoop 	|Tachyon   	|
|---------------	|--------:	|--------:	|
|admin.js        	|2.170.153	|   80.366	|
|app.js          	|4.207.787	|  408.484	|
|boot.js         	|  868.735	|    4.142	|
|libs.js         	|  658.812	|  192.289	|
|sieve.js         	|        0	|   85.085	|
|polyfills.js    	|  334.608	|        0	|
|serviceworker.js	|        0	|      285	|
|TOTAL           	|8.240.095	|  770.651	|

|js/min/*       	|RainLoop 	|Tachyon   	|RL gzip	|T gzip	|RL brotli	|T brotli	|
|---------------	|--------:	|--------:	|------:	|------:	|--------:	|--------:	|
|admin.min.js    	|  256.831	|   39.283	| 73.606	| 13.181	| 60.877  	| 11.803	|
|app.min.js      	|  515.367	|  186.270	|139.456	| 63.111	|110.485  	| 54.218	|
|boot.min.js     	|   84.659	|    2.084	| 26.998	|  1.202	| 23.643  	|  1.003	|
|libs.min.js     	|  584.772	|   93.758	|180.901	| 34.878	|155.182  	| 31.291	|
|sieve.min.js     	|        0	|   41.316	|      0	| 10.364	|      0  	|  9.352	|
|polyfills.min.js	|   32.837	|        0	| 11.406	|      0	| 10.175  	|      0	|
|TOTAL user      	|1.217.635	|  282.112	|358.761	| 99.191	|299.485  	| 86.512	|
|TOTAL user+sieve	|1.217.635	|  323.428	|358.761	|109.555	|299.485  	| 95.864	|
|TOTAL admin     	|  959.099	|  135.125	|292.911	| 49.261	|249.877  	| 44.097	|

For a user it is around 70% smaller and faster than traditional RainLoop.



|css/*       	|RainLoop	|Tachyon   	|RL gzip	|T gzip	|T brotli	|
|------------	|-------:	|------:	|------:	|------:	|--------:	|
|app.css     	| 340.331	| 84.484	| 46.946	| 17.627	| 15.110	|
|app.min.css 	| 274.947	| 67.910	| 39.647	| 15.541	| 13.547	|
|boot.css    	|       	|  1.326	|       	|    664	|    545	|
|boot.min.css	|       	|  1.071	|       	|    590	|    474	|
|admin.css    	|       	| 30.641	|       	|  7.028	|  6.111	|
|admin.min.css	|       	| 24.742	|       	|  6.352	|  5.599	|


## Replaced CKEditor with Squire
The [Squire](https://github.com/kimusan/Squire/tree/tachyon) implementation is not 100% compatible yet, but it shows the massive overhead of CKEditor.

Still TODO:

* support for tables (really needed?!?)
* support BIDI (really needed?!?)

|       	| normal	| min    	| gzip  	| min gzip	|
|--------	|-------:	|-------:	|------:	|--------:	|
|squire  	| 122.321	|  41.906	| 31.867	|   14.330	|
|ckeditor	|       ?	| 520.035	|      ?	|  155.916	|
