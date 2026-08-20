```php
<?php

$_ENV['TACHYON_INCLUDE_AS_API'] = true;
require_once '/path/to/tachyon_root/index.php';
// or with specific version
//require_once '/path/to/tachyon_root/tachyon/v/3.0.12/include.php';

// returns instance of \Tachyon\Actions
\Tachyon\Api::Actions();

// returns instance of \Tachyon\Config\Application
\Tachyon\Api::Config();

// returns instance of \Tachyon\HTTP\CSP
\Tachyon\Api::getCSP(string $sScriptNonce = null);

// returns instance of \MailSo\Log\Logger
\Tachyon\Api::Logger();

// returns string or null
\Tachyon\Api::CreateUserSsoHash(
	string $sEmail,
	string $sPassword,
	array $aAdditionalOptions = array(),
	bool $bUseTimeout = true
)

// returns bool
\Tachyon\Api::ClearUserSsoHash(string $sSsoHash);

// returns bool
\Tachyon\Api::ClearUserData(string $sEmail);

// returns bool
\Tachyon\Api::LogoutCurrentLogginedUser();


// Handle the HTTP request
\Tachyon\Service::Handle();
exit;
```
