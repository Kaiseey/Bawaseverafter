# #Bawaseverafter wedding website

A responsive Next.js wedding website for Nkasire & Emmanuel, designed in burgundy, crimson, blush and gold. The RSVP backend uses Google Apps Script + Google Sheets + Gmail/MailApp so the setup can remain on free tiers.

## What is included

- Responsive wedding landing page, countdown, story, event schedule and travel information.
- RSVP form with validation.
- Server-side forwarding to a private Google Apps Script endpoint.
- Google Sheet RSVP register created automatically in the Google account that deploys the Apps Script.
- RSVP confirmation email sent from that Google account using MailApp.

## Zero-cost services

- Vercel Hobby hosting: $0 for eligible personal, non-commercial projects. Hobby is subject to Vercel's fair-use rules and usage limits.
- Google Apps Script + Google Sheets + MailApp: no separate hosting or email-provider subscription required; Google applies usage quotas. A consumer Gmail account currently has a 100-recipient/day MailApp quota, which Google may change.
- The `.vercel.app` address is free. A `.com` domain registration is not free; because `bawaseverafter.com` has not been purchased, it cannot be used without registering it with a domain registrar.

## Set up the RSVP service (Google Apps Script)

1. Sign in to the Gmail/Google account you want confirmations to come from.
2. Open https://script.google.com and create a new project named `Bawaseverafter RSVP`.
3. Replace the starter code with the contents of `google-apps-script/Code.gs`.
4. In `Code.gs`, replace `REPLACE_WITH_A_LONG_RANDOM_SECRET` with a long random secret (at least 32 characters). Keep it private.
5. Save the project. From the function selector, run `setup` once and approve Google's requested permissions. This creates the RSVP spreadsheet in your Google Drive. You can find its URL in the execution log.
6. Choose **Deploy → New deployment → Web app**.
7. Set **Execute as** to **Me**. Set **Who has access** to **Anyone**. Deploy and authorise it. Copy the Web App URL ending in `/exec`.
8. In the website's Vercel project settings, add these environment variables for Production (and Preview if desired):
   - `GOOGLE_APPS_SCRIPT_URL` = the `/exec` URL you copied.
   - `GOOGLE_APPS_SCRIPT_SECRET` = the exact same secret you placed in `Code.gs`.
9. Redeploy the website after setting the variables.

The Apps Script endpoint is public so the website can reach it, but it rejects requests without the private shared secret. The secret is only used by the server-side API route and is not sent to visitors' browsers.

## Run locally

1. Install Node.js 20.9+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in the two Apps Script values.
4. Run `npm run dev` and open http://localhost:3000.

## Deploy to Vercel for free

1. Create a GitHub account if you do not already have one, then create a new private or public repository named `bawaseverafter`.
2. Upload the contents of this project to the repository (the files inside this folder, not the parent folder).
3. Sign in to https://vercel.com with GitHub and choose **Add New → Project**.
4. Import the `bawaseverafter` repository. Vercel should detect Next.js automatically.
5. Add the two Apps Script environment variables before deploying.
6. Keep the account on the **Hobby** plan. Do not start a Pro trial or enter payment details.
7. Deploy. Vercel will provide a free `*.vercel.app` address.

## Domain

The requested `bawaseverafter.com` has not been purchased. A `.com` registration costs money, so it is excluded from this zero-cost setup. Use the free Vercel address for now. If the domain is purchased later, add it under Vercel Project → Settings → Domains and follow the DNS instructions.

## Before sharing with guests

- Replace the decorative hero/story artwork with the couple's approved photographs. Add image files to `public/` and update `app/page.tsx`.
- Confirm the welcome mixer, Jos tour, reception and thanksgiving times/addresses.
- Add travel and accommodation recommendations and the correct contact person.
- Submit test RSVPs and confirm both the Google Sheet row and guest confirmation email arrive.
- Keep the shared secret private. Never paste it into `app/page.tsx` or any other client-side file.

## Notes

- The RSVP spreadsheet belongs to the Google account that deploys the Apps Script. Keep access to that account secure.
- MailApp uses the account's daily email quota. For consumer Gmail accounts, Google's published quota is currently 100 recipients/day; quotas can change.
- The site will not claim an email was sent if the Apps Script reports a send failure. The RSVP itself is still recorded if the email service is temporarily unavailable.
- This project does not require Supabase, a paid email provider, a paid template or a custom domain.
