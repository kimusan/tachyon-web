Tachyon does support custom CSS themes.

The place where the theme should be is `[root]/themes` where `[root]` is the root of your Tachyon installation (see below for Nextcloud).

So if you have something like `/home/webmail/public_html/tachyon/v/3.0.12/`
The custom themes should be in `/home/webmail/public_html/themes/`.

In there create a theme folder with file `styles.css`.<br>
Like: `[root]/themes/[themename]/styles.css`.<br>
You can copy the content of https://github.com/kimusan/Tachyon/blob/master/tachyon/v/3.0.12/themes/example.css as a start for your custom theme. Or copy from https://github.com/kimusan/Tachyon/blob/master/tachyon/v/3.0.12/themes/Default/styles.css

You can also use images like:
```css
	--main-bg-image: url("images/background.jpg");
```
And store the image as `[root]/themes/[themename]/images/background.jpg`

Every other modification of the Tachyon UI that can't be done in CSS has to be realized with a plugin. Plugins allow you for example to inject JS Code at the right time. Have a look at the [Developer Documentation](https://github.com/kimusan/Tachyon/wiki/Developer-Documentation#javascript-inside-your-plugin) for more information about this topic.

# Add a custom image to the login page
RainLoop had "premium features" like branding options. If you would like to use your company logo on the login page you can create your own custom theme and add something like this to your .css file:
```css
#V-Login .descWrapper {
	background: url('/path/to/custom/logo.png');
	overflow: hidden;
	text-indent: -100em;
}
```

# Problems with caching
Because Tachyon caches your images and stylesheet, you need to clear up caches to be able to see changes immediately after editing `styles.css` as well as any other resources of your custom theme.
Example if you are using apache:
```bash
rm -rf /home/webmail/public_html/data/_data_/_default_/cache && apachectl reload
```

# Nextcloud

Place your custom theme at /var/www/html/themes/{YOUR_THEME}/tachyon/

`tachyon` folder should contain

    style.css
    preview.png

In the admin settings of tachyon, and in a user's `settings_local`, you can refer to this theme as `YOUR_THEME@custom`

Read https://github.com/kimusan/Tachyon/issues/875, https://github.com/kimusan/Tachyon/pull/629#issuecomment-1752025230


# Modify HTML templates
This is not possible due to how templates are created and your theme will crash when there are modifications in the core.

Instead, you could write a plugin/extension that modifies templates using the JavaScript `rl-view-model.create` event.
For examples you can look at the:
* Avatars extension modifies the MessageList and Message view templates to inject graphics.
  https://github.com/kimusan/Tachyon/blob/master/plugins/avatars/avatars.js#L189
* Nextcloud extension modifies menus and composer window.
  https://github.com/kimusan/Tachyon/blob/master/plugins/nextcloud/js/composer.js
