# Trial Manager

Trial Manager is a Laravel 12 SaaS admin dashboard for receiving IPTV free trial requests from a Telegram bot and managing them in a premium dark admin panel.

## Features

- Laravel 12 backend configured for MySQL
- TailwindCSS + Vite dark responsive admin UI
- Admin login/logout and role-protected routes
- Dashboard statistics: total, pending, approved, rejected, today, recent requests
- Full trial request CRUD with search, filters, pagination, details, approve, reject, delete, and mark processed actions
- Telegram bot token/webhook settings and webhook receiver at `/api/telegram/webhook`
- Telegram webhook logs
- WhatsApp admin number, notification template settings, send notification button, and WhatsApp logs
- Seeded admin user and realistic sample trial request data

## Local setup

```bash
cp .env.example .env
composer install
npm install
php artisan key:generate
php artisan migrate --seed
npm run dev
php artisan serve
```

Default seeded admin credentials are controlled by `.env`:

- Email: `admin@example.com`
- Password: `password`

## Telegram webhook payloads

The webhook supports direct JSON fields:

```json
{
  "name": "Ali Ali",
  "email": "amalaoui37@gmail.com",
  "whatsapp": "+212648883065",
  "country": "Morocco",
  "dial_code": "+212",
  "device": "Smart TV",
  "plan": "Free Trial",
  "message": "",
  "ip_address": "41.140.174.78"
}
```

It also parses Telegram message text with labels such as `Name:`, `Email:`, `WhatsApp:`, `Country:`, `Dial Code:`, `Plan:`, `Message:`, and `IP:`.
