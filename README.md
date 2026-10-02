# T.E.G Carpet & Furniture Steam Cleaning

Website and backend for T.E.G Carpet & Furniture Steam Cleaning (Milwaukee, WI).

**Live site:** [tegcarpetfurniturecleaning.com](https://tegcarpetfurniturecleaning.com)

## Stack

- Static HTML/CSS/JS site
- Express backend (`server.js`) for contact form, CMS content API, media uploads, analytics
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

## Forms

Estimate forms (`#quoteForm`, `#homeContactForm`) POST to `/api/contact`. Leads are stored in `data/submissions.json` and emailed to `NOTIFY_EMAIL` when SMTP is configured.
