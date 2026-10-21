# Spam protection

## Already on

* **Email addresses are hidden from scrapers.** In the page's raw HTML an address reads `sales [at] alanyogroup [dot] com`;
  a visitor's browser turns it into a normal clickable link as soon as the page loads (`ProtectedEmail`). Addresses are
  held as two parts, never one string.
* **The contact form cannot be used to spam other people.** Enquiries are saved and emailed to staff only, never to the
  visitor. It also has a hidden honeypot field, input checks, and a limit of 5 messages a minute per visitor.
* **Checkout** has the same honeypot, validation and rate limits.

## Switch on the human check (optional, free)

Cloudflare Turnstile is a privacy-friendly "are you human" check. Visitors rarely see more than a tick.

1. Create a free Cloudflare account and open **Turnstile**, then **Add widget**. Add the site's domain.
2. Cloudflare gives you a **site key** (public) and a **secret key** (private).
3. In Vercel, add two environment variables, then redeploy:

   | Name | Value | Where it is used |
   | --- | --- | --- |
   | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | the site key | the storefront (shows the check) |
   | `TURNSTILE_SECRET_KEY` | the secret key | the API (verifies it) |

4. The check then appears on the contact form's email option. WhatsApp does not need it.

Until both are set, nothing changes. If Cloudflare is ever unreachable, the email option says so and suggests WhatsApp.

## Mail provider and domain (not in this code)

* Keep the provider's spam filter on, and do not use a catch-all mailbox.
* Turn on two-step sign-in for every mailbox.
* Ask whoever manages the domain to publish **SPF**, **DKIM** and **DMARC** records. They stop others from forging mail
  "from" `alanyogroup.com`, and help receipts and order alerts reach inboxes.

## Staff habits

* Never mark an order paid from an email. Check the order in the admin: it only becomes **Paid** after Paystack verifies it.
* Do not open unexpected attachments, or links in emails claiming to be Paystack, a bank or a courier.
