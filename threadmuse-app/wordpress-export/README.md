# SeusyTV WordPress Import Package

This folder contains a ready-to-import WordPress version of the premium IPTV website.

## Included artifacts

- `dist/seusytv-premium.wpress` - All-in-One WP Migration style archive containing `database.sql`, `package.json`, theme files, and importer plugin files.
- `dist/seusytv-premium-theme.zip` - Installable WordPress theme ZIP.
- `dist/seusytv-site-importer-plugin.zip` - Optional importer plugin ZIP that creates pages, menu, front-page settings, and Elementor-friendly content.
- `source/wp-content/themes/seusytv-premium` - Full WordPress theme source.
- `source/wp-content/plugins/seusytv-site-importer` - WordPress importer plugin source.
- `elementor-templates/*.json` - Elementor-compatible starter section/page templates.

## Recommended import

1. Install a fresh WordPress site.
2. Install and activate the All-in-One WP Migration plugin.
3. Import `dist/seusytv-premium.wpress`.
4. Visit the site once while logged in. The included importer plugin ensures pages, menus, and front-page settings exist.
5. Go to Appearance > Customize > SeusyTV Business Settings to edit WhatsApp URL, support email, guarantee text, and plan prices.

## Admin note

The SQL backup includes a fallback admin user for local imports:

- Username: `admin`
- Password: `seusytvadmin`

Change this password immediately after import. Some hosts preserve the importing user through All-in-One WP Migration; if so, use your existing administrator account.

## Pages generated

- Homepage
- Pricing
- Free Trial
- Reseller
- Tutorial
- Contact
- FAQ

All pages use standard WordPress page content and shortcodes, so they can be edited in the block editor or opened in Elementor. The theme includes a full-width page template for page builders.
