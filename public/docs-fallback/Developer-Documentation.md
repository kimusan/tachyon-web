# General overview about Tachyon

⚠ Please note that this documentation is not complete yet; any help is appreciated. ⚠

## History of Tachyon

Tachyon is a fork of the [RainLoop Webmail Project](https://github.com/RainLoop/rainloop-webmail). RainLoop was initially written by Timur Usenko who worked at the company AfterLogic and who wrote the MailSo library. In RainLoop and Tachyon, MailSo is used to handle the main part of the IMAP communication.
The Tachyon fork was initiated by Kim Schulz because RainLoop did not seem to be maintained regularly and had multiple security issues. Tachyon therefore contains the code of RainLoop, but has been modified a lot to bring it to a next level.

## Logging and debugging
Please have a look to https://github.com/kimusan/Tachyon/wiki/FAQ#how-do-i-enable-logging on how you can enable logging inside of Tachyon.\
Developers should additionally know that the logs normally do not contain passwords and other sensitive data because `MailSo\Log\Logger::Write` replaces those words by `*******`.\
If you really have to log passwords you can set the parameter `bool $bSearchSecretWords` of the function `Logger::Write` to `false` or modify the configuration of Tachyon by changing the switch `hide_passwords` inside of `application.ini`.

## Tachyon front-end
The current front-end of Tachyon is written in KnockoutJS and communicates with the back-end by JSON-format data. Tachyon tries to render the most on the clients side to reduce server load on big installations. More details on why at the moment KnockoutJS is used can be read [here](https://github.com/kimusan/Tachyon/issues/441#issuecomment-1159723815).

# The Tachyon Extensions System (Plugins)
## General information

Plugins extend the functionality of Tachyon. Administrators of a Tachyon installation can activate extensions by entering in the Admin Panel of Tachyon -> menu "Extensions" and checking the checkbox "Enable extensions". \
On the same menu you can find a list of plugins available for installation. The source code of these plugins can be found [here](https://github.com/kimusan/Tachyon/tree/master/plugins). \
The source code of installed extensions is placed on your webserver inside the Tachyon folder under `_data_/_default_/plugins/`. Therefore you can also install "non official" extensions or plugins in development by copying their code into a subfolder of this folder; keep in mind to set the correct access rights on these new files.

## How Tachyon initializes the plugins

The following shall describe how Tachyon initializes the activated extensions. All files can be found in the Tachyon repository under [tachyon/v/3.0.12/](https://github.com/kimusan/Tachyon/tree/master/tachyon/v/3.0.12) and the following paths are relative to that folder.

1. `include.php` calls `Tachyon\Service::Handle()` inside of `app/libraries/Tachyon/Service.php`
2. `Service.php` calls `Api::Actions()` inside of `app/libraries/Tachyon/Api.php`.
    * Additional info: Service.php afterwards goes ahead initializing for example the caching functions etc. and ends with a launch of the function BootEnd() in Actions.php
3. `Api.php` creates the object `$oActions` by the class `app/libraries/Tachyon/Actions.php`.
4. The constructor of `Actions.php` creates an object `$oPlugins` by the class `app/libraries/Tachyon/Plugins/Manager.php`.
5. The constructor of `Manager.php` searches for active plugins. It then calls the `Init()` function of every active plugin.

Because the `Init()` function of every plugin is called by `Manager.php` inside this function, each plugin can register itself to be launched (=callback function) at various points in the code of Tachyon (=**hooks**).
Hooks and therefore your registered functions of the plugin are called on multiple points inside the source of Tachyon by launching the function `RunHook` of `app/libraries/Tachyon/Plugins/Manager.php`.

## Getting started with your plugin
Plugins always extend the [AbstractPlugin class](https://github.com/kimusan/Tachyon/blob/master/tachyon/v/3.0.12/app/libraries/Tachyon/Plugins/AbstractPlugin.php).
To get an idea what is possible see the [example plugin](https://github.com/kimusan/Tachyon/blob/master/plugins/example/index.php) and the other plugins in the plugin repository. \
Your plugin class inside the `index.php` of your plugin first should declare some information about it. This info will be shown inside the Admin Panel -> Extensions Menu and lets the user know what the plugin is intended for or if a new version of your plugin is available.
```
	const
		NAME     = 'Avatars',
		AUTHOR   = 'Tachyon',
		URL      = 'https://github.com/kimusan/Tachyon',
		VERSION  = '1.5',
		RELEASE  = '2022-12-15',
		REQUIRED = '2.23.0',
		CATEGORY = 'Contacts',
		LICENSE  = 'MIT',
		DESCRIPTION = 'Show graphic of sender in message and messages list (supports BIMI, Gravatar and identicon, Contacts is still TODO)';
```
In many cases your plugin will also need some configuration. For example the administrator could insert credentials for a database connection that your plugin needs to work properly. All these text fields, dropdown etc. are defined inside your plugin class inside `protected function configMapping(): array`. See for example [this plugin](https://github.com/kimusan/Tachyon/blob/d1263802826013f8da0d17c8bc763c0a4aa1e1b8/plugins/ldap-mail-accounts/index.php#L56) to get an idea what you need to define inside `configMapping()`. Tachyon will take this definitions and create a configuration dialog that is reachable inside the Extensions menu of the Admin Panel (little cogwheel beside the name of your plugin). \
The list of available `PluginPropertyType` (text fields, dropdown boxes...) can be found [here](https://github.com/kimusan/Tachyon/blob/master/tachyon/v/3.0.12/app/libraries/Tachyon/Enumerations/PluginPropertyType.php).

## Hooks

### Register your plugin to a specific hook
The `Init()` function of a plugin can register one or more functions to be called when Tachyon hits a specific hook inside the code. This can happen for example when a user inserts his credentials, an IMAP connection was successful or a message is going to be saved.

To register the function `myCallbackFunction` inside of your index.php of your extension to the hook `login.success` you have to add the following to your `Init()` function:

```PHP
$this->addHook('login.success', 'myCallbackFunction');
```

If in Tachyon the hook `login.success` is executed, Tachyon will pass an array with parameters to the function `RunHook` defined in `tachyon/v/3.0.12/app/libraries/Tachyon/Plugins/Manager.php`. The length and content of the array with parameters depends on the specific hook. The function `RunHook` takes the array and passes the content as single parameters to your function `myCallbackFunction`; it will not hand over the array.

Therefore the example function `myCallbackFunction` should be defined to handle one parameter `Account $oAccount` because `login.success` passes you over the object of the account that was logged on.

#### Finding the best hook for your plugin
A possible way to find an ideal hook for your extension is to do a fulltext search for the string `RunHook(` over the Tachyon source code. This returns every active hook and his circumstances like parameters that are passed to your callback function.\
Also, this is the only way to make sure that your plugin is called at the moment you need.

## Available hooks
For a complete list of available hooks inside of Tachyon see https://github.com/kimusan/Tachyon/blob/master/plugins/README.md#hooks. Here we will describe some hooks to let you get an idea what in detail is described inside the README.md.

### Example: login.credentials.step-1

Hook will run before the checks if the given username (=mail address) of a user is valid and contains a domain-part. This hook can modify the mail address before other checks are done if this is necessary.

Parameters passed to the plugins:
```PHP
	string &$sEmail
```

### Example: login.credentials.step-2

Hook will run after the checks described in [login.credentials.step-1](#logincredentialsstep-1) when also the password of the users who tries to log in is available.

Parameters passed to the plugins:
```PHP
	string &$sEmail
	string &$sPassword
```

## JavaScript inside your plugin
Your plugin can use the function `addJs` ([definition](https://github.com/kimusan/Tachyon/blob/d1263802826013f8da0d17c8bc763c0a4aa1e1b8/tachyon/v/3.0.12/app/libraries/Tachyon/Plugins/AbstractPlugin.php#L193)) to inject JavaScript to Tachyon. Inside this JavaScript code you could for example react on [JavaScript Events](https://github.com/kimusan/Tachyon/tree/master/plugins#javascript-events).

### Modify the UI of Tachyon at runtime
Tachyon uses [templates](https://github.com/kimusan/Tachyon/tree/master/tachyon/v/3.0.12/app/templates) to define how for example the `SystemDropDown` menu (see image below) has to look like. \
![grafik](https://user-images.githubusercontent.com/116441962/208305562-c24c2c3f-5d4e-44b3-9676-6799dfcff801.png) \
If your plugin needs to modify something inside this templates (for example add an additional button to the UI or modify the list of available functions inside the `SystemDropDown`) you can add JavaScript code to your plugin that modifies this template in the right moment. Detailed information on this topic can be found here: https://github.com/kimusan/Tachyon/issues/733#issuecomment-1333725216.
