# T.E.G Carpet Steam Cleaning — Full Website + Backend

Premium multi-page site for **T.E.G Carpet & Furniture Steam Cleaning** (Milwaukee, WI) with a **Node.js backend**.

**Live:** https://tegcarpetfurniturecleaning.com

## Backend features
- **POST /api/contact** — quote form saves to `data/submissions.json`
- **GET/PUT /api/admin/content** — SEO, media, services, location, contact
- **GET /api/admin/submissions** — view quote requests in admin
- **POST /api/admin/upload** — file upload to `/uploads`
- Serves all static HTML/CSS/JS
- Analytics event tracking

## Run locally
```bash
npm install
npm start
```
Open: **http://localhost:3000**

Admin: **http://localhost:3000/admin.html**  
Set the admin password via environment variable (required for production):

```bash
ADMIN_PASSWORD=your-secure-password PORT=3000 npm start
```

## Deploy (Hostinger / Node)
1. Connect the GitHub repo in Hostinger (or upload files)
2. Set `ADMIN_PASSWORD` in the hosting environment / Node app settings
3. `npm install && npm start` (or let Hostinger handle the start command)
4. Point the domain to the app

**Important:** Backend must be running for form save + admin. Without the server, the form falls back to `mailto:contact@tegcarpetsteamcleaning.com`.

## Contact email (canonical)
**contact@tegcarpetsteamcleaning.com**

Used in:
- Form mailto fallback (`script.js`)
- `content.json` / `data/content.json`
- Schema / `site-config.js`
- Footers and contact pages
- `llms.txt`

Forms post to `/api/contact` (saved in `data/submissions.json`). No third-party form service (Formspree/FormSubmit) is used on the live frontend.

## Pages
| File | Description |
|------|-------------|
| `index.html` | Homepage |
| `services.html` | All services |
| `service-*.html` | Individual service detail pages |
| `about.html` / `contact.html` / `areas.html` / `faq.html` / `reviews.html` | Inner pages |
| `admin.html` | Admin panel |

## API summary
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/health` | — |
| GET | `/api/content` | — |
| POST | `/api/contact` | — |
| POST | `/api/admin/login` | password body |
| GET/PUT | `/api/admin/content` | header `x-admin-key` |
| GET | `/api/admin/submissions` | header `x-admin-key` |
| POST | `/api/admin/upload` | header `x-admin-key` + multipart file |
| GET | `/api/admin/analytics` | header `x-admin-key` |

## Business
- Phone: +1 (414) 775-3705
- WhatsApp: +1 (618) 434-0858
- Email: contact@tegcarpetsteamcleaning.com
- Address: 4111 N Port Washington Rd suite 1, Milwaukee, WI 53217
