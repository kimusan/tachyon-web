# What Tachyon is and what not
Tachyon is a web-based email client you can use to access your mails on an IMAP server and send mails using an SMTP server. You can also filter your mails using SIEVE rules (for example an automatic vacation responder) if the mail server you use supports this. \
As you can see Tachyon relies on mail servers to work; it does not bring an own IMAP/SMTP server with it nor will it be able to cache your mails.\
By configuring multiple domains in the admin panel you can enable the users of Tachyon to retrieve their mails directly from different IMAP servers inside one web-based mail client.

Tachyon has **no user management** where you can manage the users of Tachyon. Because Tachyon only acts as a mail client, the users need valid login credentials to authenticate against the IMAP server of their mail domain (like @example.com). If a user was able to authenticate, Tachyon will show his mails inside its user interface.\
While this is fine when you're using your own (or a company) mail server, this would maybe create problems when you configure Tachyon to connect to IMAP servers for mail addresses like `*@gmail.com` because everyone could use your Tachyon installation to retrieve his mails from Gmail. Therefore, in the configuration of Tachyon you can whitelist only some mail addresses to retrieve their mails through Tachyon.

If you experience **slow performance** inside of Tachyon, keep in mind that Tachyon only interacts with the servers you defined inside the "Domain" configuration. Specially on large mailboxes, the speed of the IMAP server is important and if it uses good indexes. \
As you can see, very often performance problems lay on the server side, but you can fine tune Tachyon with various settings to disable specific capabilities that cause slowdowns on some servers or set limits for the number of mails that gets fetched. We will see these options in the following menus.

Tachyon **does not store your login credentials to use it for automation** and also does not have **scheduled processes** running on the server. This means you can't for example schedule to send mails on a specific time. Tachyon will also not fetch automatically your mails from the IMAP servers when you're not logged in.

# Structure of the data directory
TBD: description of folders and files inside the data directory of Tachyon.

# The Tachyon Admin Panel
## How to access the Admin Panel
After installing Tachyon you can use the URL `https://example.com/?admin` to access the Admin Panel of Tachyon.

## Menu "General"
In this menu you can preset some settings for all Tachyon users and can also choose if the user will be able to change them.

💡 When accessing this menu, your installation will be automatically checked if the `data` folder is accessible from the internet. If this is true, a warning will displayed with [instructions](https://github.com/kimusan/Tachyon/wiki/Installation-instructions#secure-data-folder) how this problem can be solved. \
Also, if your admin password is too weak, a warning will be displayed. You can choose a better password and activate two factor authentication in [Menu "Security"](#menu-security).

| Name of setting | Description |
|---        |---          |
| Language  | The predefined language of the Tachyon user interface. Users can (if you allow this in the following settings) change this to their preferences. Changing this setting in a second moment will change the interface language of all users that have not modified their language |
| Language (admin) | The language of the Tachyon admin panel |
| Theme     | The theme/skin to use when a user opens Tachyon. Users can (if you allow this in the following settings) change this to their preferences. Changing this setting in a second moment will change the interface theme of all users that have not modified their theme |
| Allow language selection on settings screen | Allow the user to choose his preferred interface language inside the settings dialog |
| Allow theme selection on settings screen | Allow the user to choose his preferred theme inside the settings dialog |
| Allow background selection on settings screen | Allow the user to choose his preferred background inside the settings dialog. For design and performance reasons, when the width of the screen is less then `1000px`, the background image is not loaded and a color is shown instead |
| Show thumbnails (attachments) | When active, Tachyon will generate a preview thumbnail for some attachment file types |
| Attachment size limit | Here you can configure the maximum size of attachments the user will be able to send. This value can't be bigger than the setting inside your PHP configuration `php.ini` |
| Allow additional accounts | Allow the user to add additional mail accounts to his main account he used to log in at Tachyon. A requirement for those additional mail accounts is a valid configuration of the domain inside [Menu "Domains"](#menu-domains) |
| Allow multiple identities | Allow the user to connect additional identities to his mail account. Identities can change the sender mail address, sender name and signature to be used when sending a mail |

## Menu "Domains"
When a user logs in with the username `firstname@domain.tld`, then Tachyon should know how to connect to the IMAP & SMTP server of domain.tld. In the "Domains" section you can setup this IMAP/SMTP/SIEVE settings to use for different domains.

![grafik](https://user-images.githubusercontent.com/116441962/209198978-3f005f04-65eb-4096-9512-a99dd977cebb.png)

After opening this menu you will see a list of already configured domains and aliases. By clicking on the name of one entry you can open the configuration dialog for this domain. Beside the name of the domain you have also a garbage can symbol to delete a complete domain entry and a checkbox to disable domain settings temporarily. \
If you don't have any domain configured yet, you can click on `+ Add Domain` to create a new domain configuration.

### Add Domain
![grafik](https://user-images.githubusercontent.com/63400209/236821377-2d30ceb8-5b27-4e63-9161-e7a61cb40b88.png)

In this dialog you first need to insert into the `Name` input box the domain-part of the mail addresses you're going to use for logging in at Tachyon. Inserting `example.com` here will allow every user with a mail address at `example.com` to check his mails (you can limit the list of allowed users afterwards).

The different options available will be described in the following sections. After configuring everything you can test the connection to the servers you defined by clicking on the `Test` Button. You will be asked for credentials that Tachyon should use when trying to connect to the IMAP, SMTP and SIEVE server you eventually defined. If everything works you can save your settings by clicking the `+ Add` Button.

#### IMAP settings
| Name of setting | Description |
|---        |---          |
| Server    | The hostname of your IMAP server e.g. `imap.example.com`|
| Secure    | Setting on how the connection to the server has to be secured e.g. `SSL/TLS`|
| Port      | The port to use to connect to your IMAP server e.g. `993`|
| Timeout   | Time to wait for a response from your IMAP server |
| Use short login | Let the user login for example with `bob@example.com` at Tachyon but use only `bob` as username to authenticate at the IMAP server. See also the important information in [Menu "Login"](#menu-login) when you need to use this setting |
| Require verification of SSL certificate | Verify the certificate used by the IMAP server |
| Allow self signed certificates | Normally a connection to a server with self signed certificates is not allowed; check this box if your server is using a self signed certificate |
| Disable capabilities | Tachyon uses various IMAP capabilities defined in various RFC (e.g. SORT, LIST...). In this section you can disable some IMAP functions when you're expiring problems or slowdowns retrieving your mails from the IMAP server. This clearly has side effects on how Tachyon behaves but gives you more control. See also [this site for more information](https://github.com/kimusan/Tachyon/wiki/IMAP-capabilities) |
| Limits    | For speeding up loading very big mailboxes or other special situations you can define a limit of mails that gets loaded from the server. When the message count inside a folder is bigger than the value configured here, the system will not cache UID or use SORT for messages. Instead it will just fetch a range of messages based on index. This is faster but disables features like: threads, sort by date/size/subject |

#### SMTP settings

| Name of setting | Description |
|---        |---          |
| Server    | The hostname of your SMTP server e.g. `smtp.example.com`|
| Secure    | Setting on how the connection to the server has to be secured e.g. `SSL/TLS`|
| Port      | The port to use to connect to your SMTP server e.g. `587`|
| Timeout   | Time to wait for a response from your SMTP server |
| Use short login | Let the user login for example with `bob@example.com` at Tachyon but use only `bob` as username to authenticate at the SMTP server |
| Use authentication | Uncheck this box if your SMTP server doesn't ask for authentication when sending an email |
| Use login as sender | When checked the `Sender` header inside the mail will be set to the login of the Tachyon user also when the user sends a mail from an other identity (= `From` header). Example: Login as `john@example.com`. Send mail with identity `jane@example.com`. When this checkbox is checked `Sender: john@example.com` and `From: jane@example.com`. [More info](https://stackoverflow.com/questions/4367358/whats-the-difference-between-sender-from-and-return-path) |
| Require verification of SSL certificate | Verify the certificate used by the SMTP server |
| Allow self signed certificates | Normally a connection to a server with self signed certificates is not allowed; check this box if your server is using a self signed certificate |

#### SIEVE settings

SIEVE scripts enable you to filter incoming mails by different rules. One of the most common uses for this filters is the vacation auto responder. After activating and configuring this section, your users can define autonomously the filters they would like to enable in their preferences of Tachyon.
Your server has to support the "ManageSieve" protocol and must offer a service to manage the filters (for example at port 4190).

| Name of setting | Description |
|---        |---          |
| Allow sieve scripts | Check this box to enable the filtering of incoming mails |
| Server    | The hostname of your SIEVE server e.g. `imap.example.com`|
| Secure    | Setting on how the connection to the server has to be secured e.g. `SSL/TLS`|
| Port      | The port to use to connect to your SIEVE server e.g. `4190`|
| Timeout   | Time to wait for a response from your SIEVE server |

#### White List settings

When you have configured a domain inside the Tachyon Domains, everyone that can reach your server could use Tachyon using his credentials for that configured domain. Especially when you configure Tachyon to connect to a domain of a free email service provider (Microsoft, Google etc.), it's likely you would like to restrict the use of Tachyon to just some users. The list of users enabled to access their mails through Tachyon is configured inside the `White List` tab of the domain settings.

Simply insert a space delimited list of local parts of the email addresses you would like to enable to access. If for example you would like to allow the person behind user.name@example.com to access, just insert `user.name` in the text field.

### Add Alias
After creating a domain you can add aliases for this domain configuration. This enables the users of Tachyon to login with multiple mail addresses (the "main domain" and the alias). If you own two domains that share the same IMAP and SMTP configuration you don't need to reinsert the whole information twice.
The button `add alias` opens the following dialog:

![grafik](https://user-images.githubusercontent.com/63400209/236819902-96f677fb-f5e9-4d87-8cf9-158e98f0a47b.png)

| Name of setting | Description |
|---        |---          |
| Alias | the domain you would like to use with the same settings as an already configured domain |
| Domain | A drop down with all already configured domains. Here you choose the domain the alias should be connected to |

### Testing your configuration
Underneath the list of configured domains you find a textbox that can be used to test your configuration. If you insert a username here, Tachyon will simulate what would happen if this user will try to login. Afterwards it will show you a message box with the domain that Tachyon identified to be connected with that username.\
This function is especially useful in situations where multiple domains are defined and users are going to login without a complete email address (e.g. when using an integration like the Nextcloud Tachyon integration with auto-login).

## Menu "Login"
### Default domain
You can setup one domain that is automatically added to the username when the user tries to login by using a incomplete mail address (e.g. `example.com`). If for example only the username `bob` is passed to Tachyon, it would autocomplete the username to `bob@example.com`.

💡 If your IMAP server only accepts usernames without a domain (for example the ldap username of your user), the automatic addition of the "default domain" would block your users from logging in to your IMAP server; but on the other side, it is needed by Tachyon to determine the server settings to use. In such a case you must configure Tachyon to strip off the domain part before sending the credentials to your IMAP server. This is done by entering to the Tachyon Admin Panel -> Domains -> clicking on your default domain -> flagging the checkbox "Use short login" under IMAP and SMTP.

### Additional settings

| Name of setting | Description |
|---        |---          |
| Try to determine user domain | When enabled **and** when the user does not use a complete mail address to login, Tachyon tries to determine the domain to use by looking up the `HTTP_HOST` the browser of the user has sent |
| Allow language selection on login screen | Enables or disables the manual language selection on the login page |
| Try to determine user language | When the manual language selection is active, try to determine the language of the user sent by his browser |

## Menu "Branding"
In this menu you can change some texts shown on the user interface.

| Name of setting | Description |
|---        |---          |
| Page Title | Overwrite the page title shown in the browser with your custom text |
| Loading Description | Overwrite the text shown in the loading page (shown when the user gets logged in) |
| Favicon   | An URL to a favicon to show in the browser instead of the default Tachyon logo |

💡 To add your personal or company logo to the Tachyon UI please see [this topic](https://github.com/kimusan/Tachyon/wiki/Custom-Themes#add-a-custom-image-to-the-login-page)

## Menu "Contacts"
With Tachyon your users can manage their contacts in an address book accessible by the symbol beside the "New message" button. \
![grafik](https://user-images.githubusercontent.com/116441962/209465428-eec613ea-d628-4113-ba76-e12116364af5.png)

💡 The prerequisite to use the address book functionality of Tachyon is that on your server is installed a database driver (PDO extension) for one of the following databases:
- MySQL
- PostgreSQL
- SQLite. The use of SQLite is not recommended with a large number of active users. 

| Name of setting | Description |
|---              |---          |
| Enable contacts | Enables or disables the address book functionality for the users |
| Allow contacts sync (with external CardDAV server) | When active, the Tachyon user can setup a connection to an external CardDAV server inside his personal settings. Tachyon will then synchronize the Tachyon address book of the user with the address book on the CardDAV server (therefore the contacts from the external server will be imported into the local address book of Tachyon). |

### Storage configuration

💡 The availability of the following settings depends on the database type. 

| Name of setting | Description |
|---              |---          |
| Type            | Choose the database type you would like to use to save the contacts |
| DSN             | `Data Source Name` of your database. This string tells Tachyon where the database to use for saving the address books is located. Example: `mysql:host=127.0.0.1;port=3306;dbname=tachyon` |
| User            | Username to use when connecting to the DB |
| Password        | Password to use when connecting to the DB |

After setting up everything you can check the correctness of your DB settings with the `Test` button.

💡 Inside the database, Tachyon connects the contact entries of a single user with his username. Keep this in mind when you're experimenting with different login extensions/plugins: if your users first log in with `user@example.com` and create some contacts, these addresses are connected to `user@example.com`. If you later change the username of the users to something like `user` (e.g. when using ldap authentication or Nextcloud autologin), the same user that now will login with `user` will not see his contacts saved before with username `user@example.com`. You will have to update the database tables in this case to substitute `user@example.com` with `user`.

## Menu "Security"

| Name of setting | Description |
|---              |---          |
| Use local proxy for external images | If enabled, the images inside an email will be downloaded by the server Tachyon is hosted on and therefore the server acts as a proxy. This way, when downloading images only the IP address of the Tachyon server will be visible to the remote server where the image is hosted. The IP of the Tachyon user is not communicated because the user downloads the images from the local proxy. If not activated, Tachyon will behave like configured inside the `application.ini`/[Menu Config](#menu-config) at `content_security_policy`. The server will, in this case, refuse to download external images because this Content Security Policy rules will eventually be violated |
| Allow OpenPGP   | **TODO** |
| Require verification of SSL certificate | **TODO** |
| Allow self signed certificates | **TODO** |

### Admin Panel Access Credentials
In this section you can change your admin password by inserting the actual password and by repeating the new password twice.
**TODO: add description for TOTP**

## Menu "Extensions" (Plugins)
Plugins extend the functionality of Tachyon. Administrators can activate extensions by checking the checkbox "Enable extensions" inside this menu. For more details on how extensions work, please see the [developer documentation](https://github.com/kimusan/Tachyon/wiki/Developer-Documentation#the-tachyon-extensions-system-plugins).

After activating the extensions functionality you will see a list of available extensions inside the public Tachyon plugin repository and can install the different extensions by clicking on the download symbol (📥).

Once an extension is installed the new functionalities are available to the users. If the plugin lets you configure some settings, you can open a configuration dialog by clicking on the cogwheel symbol (⚙) beside the name of the installed plugin. An extension that connects for example to an LDAP will ask you for the server name and credentials to be used.

Tachyon automatically checks if newer versions of extensions are available inside the public repository. If true, it will offer you the possibility to update the installed plugin to the latest version.

## Menu "Config"
A main part of the configuration of Tachyon is saved inside a file `application.ini`. When you edit settings inside the appropriate menus of the Admin Panel, these settings may be saved directly to this file. \
As there are some settings that only can be set directly in `application.ini`, the menu "Config" gives you the possibility to access the complete file with an experimental editor.

The following settings are available to edit.

### Section "Webmail"

| Name of setting | Default value         | Equivalent setting in Admin Panel   | Description                                | 
|---              |---                    | ---                                 | ---                                        |
| `title`         | `Tachyon Webmail`     | see [Menu Branding](#menu-branding) | Text displayed as page title.              |
| `loading_description` | `Tachyon`         | see [Menu Branding](#menu-branding) | Text displayed on startup                  |
| `favicon_url`   | `empty`               | see [Menu Branding](#menu-branding) | An URL to a favicon you would like to show instead the default Tachyon favicon |
| `app_path`      | `empty`               |                                     | **TODO**                                   |

## Menu "About"
This menu shows you some credits about Tachyon. \
You can also see the version you are using at the moment and if there exists a newer release of Tachyon that could be installed.
