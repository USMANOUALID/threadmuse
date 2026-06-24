# Trial Manager Installation Guide

This file covers local and first-time server installation for Trial Manager.

## 1. Requirements

- PHP 8.2+
- Composer 2+
- MySQL 8+ or MariaDB 10.6+
- Node.js 20+
- npm
- PHP extensions: `pdo_mysql`, `mbstring`, `xml`, `curl`, `zip`, `bcmath`, `tokenizer`, `fileinfo`, `gd`, `intl`

## 2. Install dependencies

From the Laravel app directory:

```bash
cd trial-manager
composer install
npm install
```

## 3. Environment file

Create `.env`:

```bash
cp .env.example .env
php artisan key:generate
```

Minimum local `.env`:

```env
APP_NAME="Trial Manager"
APP_ENV=local
APP_KEY=base64:GENERATED_KEY
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=trial_manager
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local

MAIL_MAILER=log
MAIL_FROM_ADDRESS="admin@example.com"
MAIL_FROM_NAME="${APP_NAME}"

ADMIN_NAME="Trial Manager Admin"
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password
```

## 4. MySQL database

Create the database:

```sql
CREATE DATABASE trial_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

If using a dedicated user:

```sql
CREATE USER 'trial_manager_user'@'localhost' IDENTIFIED BY 'strong-password';
GRANT ALL PRIVILEGES ON trial_manager.* TO 'trial_manager_user'@'localhost';
FLUSH PRIVILEGES;
```

Update `.env` accordingly.

## 5. Run migrations and seeders

```bash
php artisan migrate --seed
```

Default seeded admin credentials come from `.env`:

```text
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password
```

Change these before seeding production.

## 6. Start local development server

Terminal 1:

```bash
php artisan serve
```

Terminal 2:

```bash
npm run dev
```

Open:

```text
http://localhost:8000/login
```

## 7. Build assets for production

```bash
npm run build
```

## 8. Queue setup

Local default is:

```env
QUEUE_CONNECTION=sync
```

For production database queues:

```env
QUEUE_CONNECTION=database
```

Then run:

```bash
php artisan queue:table
php artisan migrate
php artisan queue:work
```

Use Supervisor in production. See `DEPLOYMENT.md`.

## 9. Scheduler / cron

Add this cron entry in production:

```cron
* * * * * cd /path/to/trial-manager && php artisan schedule:run >> /dev/null 2>&1
```

## 10. WhatsApp Cloud API setup

After logging in:

1. Go to Settings -> Integrations.
2. Add WhatsApp Access Token.
3. Add Phone Number ID.
4. Add Business Account ID.
5. Add Verify Token.
6. Add Test Number.
7. Save settings.
8. Click Send Test Message.

The app sends text messages through Meta Graph API:

```text
POST https://graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/messages
```

## 11. Telegram Bot setup

After logging in:

1. Go to Settings -> Integrations.
2. Add Bot Token.
3. Add Webhook URL.
4. Save settings.
5. Click Set Webhook.
6. Click Test Bot.

Webhook URL format:

```text
https://your-domain.com/api/telegram/webhook
```

## 12. Useful commands

Clear caches:

```bash
php artisan optimize:clear
```

Cache production config:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

List routes:

```bash
php artisan route:list
```

Run tests:

```bash
php artisan test
```

Format PHP code if Laravel Pint is installed:

```bash
./vendor/bin/pint
```

## 13. Troubleshooting

### Blank page or 500 error

Check logs:

```bash
tail -f storage/logs/laravel.log
```

Check permissions:

```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R ug+rw storage bootstrap/cache
```

### Assets not loading

Run:

```bash
npm install
npm run build
```

Confirm `public/build/manifest.json` exists.

### Database errors

Confirm `.env` database values and run:

```bash
php artisan migrate:status
```

### Route/view cache issues

Run:

```bash
php artisan optimize:clear
php artisan route:cache
php artisan view:cache
```
