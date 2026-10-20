# Payments setup

How checkout works, what is protected, and the steps to switch it on.

## How an order is paid

1. The customer fills in the checkout form. The browser sends only **product slugs, quantities and delivery
   details**. It never sends a price.
2. The API (`POST /api/v1/checkout`) prices every line from its **own database**, rejects anything out of stock,
   unpriced or unknown, saves the order, and asks Paystack for a payment page for that exact amount.
3. The customer pays on **Paystack's hosted page**. Card and mobile money details never touch our site, so the
   shop stays out of PCI card-data scope.
4. Paystack sends the customer back to `/order/confirmation?reference=...`, and sends our server a **webhook**.
5. Our server asks Paystack directly (`/transaction/verify`) and only then marks the order paid, and only if the
   reference, amount and currency all match the order. The redirect and the browser are never trusted.
6. A receipt goes to the customer and an alert to staff, once.

## What is protected

| Risk | Defence |
| --- | --- |
| Price tampering in the browser | Prices come only from the server database; any price sent is ignored |
| Forged "payment succeeded" webhook | HMAC-SHA512 signature check on the raw body; the server also re-verifies with Paystack |
| Replayed or retried webhook | Each event stored once (unique key); settlement is locked and idempotent |
| Double-click or retry creating two orders | `Idempotency-Key` header returns the same order |
| Wrong amount or currency paid | Order moves to **Needs review**, is never marked paid, and no receipt is sent |
| Fake order references | 96-bit random references; the status endpoint returns no personal data |
| Bots | Honeypot field, input validation, per-IP rate limits on checkout and lookups |
| Secrets leaking | Secret key lives only in server environment variables; `.env` is git-ignored |
| Clickjacking, sniffing, injected content | Security headers and a Content-Security-Policy on the storefront |
| Order pages cached or indexed | `no-store`, `noindex`, `no-referrer` on `/order/*` and `/checkout` |
| Admin tampering with money | Orders are read-only in the admin except status; payments and webhook logs are view-only |

## Switch it on

### 1. A database
Orders need PostgreSQL. In Vercel: **Storage / Marketplace, add Neon (Postgres)** to this project. It sets
`DATABASE_URL`.

### 2. Environment variables (Vercel, Production and Preview)
| Name | Value |
| --- | --- |
| `SECRET_KEY` | a long random string (not the one used for local development) |
| `DATABASE_URL` | set by the Postgres integration |
| `SITE_URL` | `https://alanyogroup.vercel.app` (your real domain later) |
| `ALLOWED_HOSTS` | your custom domain, once you have one |
| `PAYSTACK_SECRET_KEY` | `sk_test_...` for testing, `sk_live_...` when live |
| `ORDER_NOTIFY_EMAILS` | comma-separated staff addresses that should receive paid orders |
| `EMAIL_BACKEND`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` | your SMTP provider, so receipts are really sent |

The Paystack **public** key is not needed: customers are redirected to Paystack, so nothing in the browser holds a key.

### 3. Create the tables and load the products (once, from your computer)
```bash
cd api
# PowerShell:  $env:DATABASE_URL="postgres://..."   (the Neon URL)
python manage.py migrate
python manage.py import_catalog
python manage.py createsuperuser
```
Run `import_catalog` again after any price or stock change in `tools/import_woocommerce.py` output; it updates in place.

### 4. Paystack dashboard
**Settings, API Keys & Webhooks**:
* Test webhook URL: `https://alanyogroup.vercel.app/api/v1/paystack/webhook`
* (Later, with live keys) set the same URL as the live webhook URL.

### 5. Test it
Use the test cards and mobile-money numbers in Paystack's documentation. After paying, the order should move to
**Paid** in the admin (`/admin/`), and the confirmation page should say so.

## Going live
* Complete Paystack business verification, then switch to the **live** secret key.
* Rotate keys: a test secret key was shared in a chat during setup, so generate a fresh pair for live use and never
  paste live keys anywhere.
* Replace the local `SECRET_KEY` and set a real email provider.

## Known limits
* Delivery fees are not charged online; our team confirms delivery with the customer (see the Shipping Policy).
* Stock is a simple in-stock flag, not a quantity.
* Rate limits are per server instance unless `REDIS_URL` is set.
