# T.E.G Carpet & Furniture Steam Cleaning

Website and backend for T.E.G Carpet & Furniture Steam Cleaning (Milwaukee, WI).

**Live site:** [tegcarpetfurniturecleaning.com](https://tegcarpetfurniturecleaning.com)

## Stack

- Static HTML/CSS/JS site
- Express backend (`server.js`) for contact form, CMS content API, media uploads, analytics. Runtime CMS data and uploaded media are stored outside the deploy directory so redeploys do not erase them.
- Admin panel at `/admin.html`

## Contact

- Phone: +1 (414) 775-3705
- Email: contact@tegcarpetsteamcleaning.com
- Address: 4111 N Port Washington Rd suite 1, Milwaukee, WI 53217

## Local development

```bash
npm install
export ADMIN_PASSWORD=your-secret
# Optional: SMTP for lead emails
# export SMTP_HOST=... SMTP_USER=... SMTP_PASS=... NOTIFY_EMAIL=contact@tegcarpetsteamcleaning.com
node server.js
```

Open http://localhost:3000

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PASSWORD` | Yes | Admin panel password |
| `NOTIFY_EMAIL` | No | Owner email for form leads (default: contact@tegcarpetsteamcleaning.com) |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | No | Enable outbound email for leads |
| `PORT` | No | Default 3000 |
| `TEG_PERSIST_DIR` | No | Persistent root for CMS data and uploads. Defaults to `$HOME/.teg-carpet-persistent`. |
| `TEG_DATA_DIR` | No | Optional override for persistent JSON data directory. |
| `TEG_UPLOADS_DIR` | No | Optional override for persistent media directory. |

## Forms

Estimate forms (`#quoteForm`, `#homeContactForm`) POST to `/api/contact`. Leads are stored in `data/submissions.json` and emailed to `NOTIFY_EMAIL` when SMTP is configured.


## Persistent CMS data and media

**Do not point the CMS storage at the Git/deploy directory on production.** The server now uses a persistent directory outside the application release folder by default:

- CMS content: `$HOME/.teg-carpet-persistent/data/content.json`
- Leads: `$HOME/.teg-carpet-persistent/data/submissions.json`
- Analytics: `$HOME/.teg-carpet-persistent/data/analytics.json`
- Uploaded media: `$HOME/.teg-carpet-persistent/uploads/`

On first startup, existing `data/content.json`, `submissions.json`, `analytics.json`, and any existing files in `uploads/` are copied into the persistent location **only when the persistent copy does not already exist**. Existing persistent data is never replaced by a redeploy.

For Hostinger, set `TEG_PERSIST_DIR` (or the two more specific directory variables) to a directory outside the folder Hostinger replaces during deployment, for example:

```text
TEG_PERSIST_DIR=/home/<your-hosting-user>/teg-carpet-persistent
```

The public URL remains `/uploads/<filename>`; only the physical storage location changes. Admin-uploaded logos, hero images, posters, OG images and before/after media therefore keep working after a GitHub/Hostinger redeploy.

The CMS save endpoint also writes JSON atomically (temporary file + rename), reducing the chance of a partially-written content file after a restart or interrupted write.
