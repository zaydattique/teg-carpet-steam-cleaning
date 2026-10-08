# T.E.G Carpet Steam Cleaning — Project Plan

## Goal
Full multi-page website + Node backend for T.E.G Carpet & Furniture Steam Cleaning (Milwaukee, WI).

## Stack
- Static HTML/CSS/JS frontend
- Express Node.js backend (contact form, admin CMS, uploads, analytics)
- Hostinger Node hosting + GitHub deploy

## Business info
| Field | Value |
|-------|-------|
| Name | T.E.G Carpet & Furniture Steam Cleaning |
| Phone | +1 (414) 775-3705 |
| WhatsApp | +1 (618) 434-0858 |
| Email | contact@tegcarpetsteamcleaning.com |
| Address | 4111 N Port Washington Rd suite 1, Milwaukee, WI 53217 |
| Domain | tegcarpetfurniturecleaning.com |
| Hours | 24/7 |

## Pages
- index.html — homepage
- services.html + service-*.html — 10 services
- areas.html + area-*.html — service areas
- about, contact, faq, reviews, how-it-works
- admin.html — CMS panel

## Backend API
- POST /api/contact — save lead + FormSubmit notify to owner email
- GET/PUT /api/admin/content — CMS
- GET /api/admin/submissions — inbox
- POST /api/admin/upload — media
- Analytics events

## Deploy notes
- Set `ADMIN_PASSWORD` and optionally `NOTIFY_EMAIL` on Hostinger
- FormSubmit sends owner email without SMTP
- Lead always saved to data/submissions.json even if email fails
