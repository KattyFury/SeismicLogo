# HANDOFF — SeismicLogo

Web app to drop Seismic-community logos/PFPs (or your own) onto a photo: drag, pinch-zoom/rotate, add text, save/share the result.

## Stack

- Static site — single `index.html` (HTML+CSS+JS inline, no build step, no framework) + `assets.js` for default asset config.
- No backend, no secrets.
- Fonts via Google Fonts CDN link.

## Architecture

- `index.html` — everything: 10-row layout (CSS Grid, modeled as 30 sub-rows so "1/3 of a row" spec boundaries land exactly), i18n (EN/VI) via a `STRINGS` table, canvas overlay editor, save/export.
- `assets.js` — `SEISMIC_ASSETS` config: the 10 default PFP/logo slots for "Seismic logo & PFP" mode. Edit this file to change the defaults.
- `logos/0.png` — brand mark (rocky icon), source for all generated favicons/app icons.
- `logos/1-7.png` — 6 static Seismic logos + Lyron's PFP (owner-supplied files, not links).
- `logos/x/*.png` — cached avatars for the 2 X-handle-based default PFPs (Noxx, Xealist), fetched once via unavatar.io and committed so the app doesn't depend on a third party at runtime. Falls back to a live unavatar.io lookup if the cached file ever goes missing.
- `icon*.png`, `favicon.ico`, `apple-touch-icon.png`, `manifest.json` — generated from `logos/0.png` (see the one-off script pattern used in this session: crop white margin → resize/pad per target size).

## Data flow

1. User picks a background photo → drawn onto `#photo-canvas` sized to fit `#image-area`.
2. User taps a PFP/logo (from the grid) or "Add text" → an absolutely-positioned overlay `<div>` is created and pushed into `overlayItems[]`. Drag/pinch-zoom/rotate/delete all operate on these overlay items in screen space.
3. "Save image" composites the original full-resolution photo + all overlay items (scaled back up from screen coords to natural photo resolution) onto an offscreen canvas, exports as JPEG, and shares/downloads it.
4. Custom PFPs added via "Add more PFP" (X handle or gallery picks) are stored in `localStorage` per mode (`seismiclogo_custom_pfps_seismic` / `_personal`) and merged on top of the mode's defaults every time that mode is selected. Gallery picks are downscaled to a 400px JPEG before storing to stay well under the localStorage quota.

## Deploy — NOT what you'd assume

- **Domain**: `seismiclogo.xyz`
- **This is a Cloudflare Worker (name `seismiclogo`), not Cloudflare Pages.** It's a static-assets Worker with a custom domain attached, `has_assets: true`, no `main` script.
- **Pushing to GitHub does NOT deploy it.** There is no CI/CD wired between the `KattyFury/seismiclogo` repo and this Worker. Every deploy in this session was a manual `wrangler deploy`.
- **How to deploy** (token lives in `D:\Files\Claude\build_on_arc\ezwallet\.env.txt`, keys `CF_API_TOKEN`/`CF_ACCOUNT_ID` — see memory `cloudflare-api-access`):
  1. Copy only the public files (`index.html`, `assets.js`, `manifest.json`, `favicon.ico`, `icon*.png`, `logos/`) into a **clean directory outside the repo** — do NOT run `wrangler deploy` from inside the repo itself.
  2. Add a minimal `wrangler.toml` (`name = "seismiclogo"`, `[assets] directory = "./"`) and a `.assetsignore` excluding `wrangler.toml`/`.assetsignore`/`.wrangler`.
  3. `npx wrangler@latest deploy` with `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` exported.
  4. Verify: `curl -o /dev/null -w "%{http_code}" https://seismiclogo.xyz/` → 200, and `.../wrangler.toml` → 404 (confirms it wasn't published).
  - **Why not deploy straight from the repo**: on Windows, `wrangler deploy` walks the whole asset directory including `.git` before applying `.assetsignore`, so running it in-repo risks trying to publish `.git` internals. Deploying from a clean staging copy sidesteps this entirely.

## Decisions log

- 2026-08-02: Rebuilt UI to the spec's 10-row layout with a mode-selection popup (Seismic / Personal) — reason: full spec handoff from the user.
- 2026-08-02: Header title made into a live toggle (`Seismic logo & PFP | Personal` ⇄ `Seismic | Personal logo & PFP`) instead of a static label — reason: user wanted to switch modes without reopening the picker popup.
- 2026-08-02: Custom-added PFPs persisted to `localStorage` per mode, gallery picks downscaled before storing — reason: user found added PFPs vanished on reload; original in-memory-only design was a gap, not intentional.
- 2026-08-02: Removed the "Added N PFP ✓" success toast after Add — reason: user found it redundant since the grid already visibly updates; kept the storage-quota-failure toast since that's non-obvious info.
- 2026-08-02: "Add more PFP" X-handle input accepts multiple space-separated handles (e.g. `@lecter @bescient`) instead of one at a time — reason: explicit user ask; each token is parsed/verified independently, invalid ones are skipped rather than blocking the whole add.
- 2026-08-02: Deployed manually via `wrangler deploy` from a clean staging copy (see Deploy section) — reason: this Worker has no GitHub auto-deploy, discovered mid-session when the user asked why pushed code wasn't live.

## Failed approaches

- 2026-08-02: PFP grid (`#pfp-grid`) used `margin: auto` for centering when it fit in 10 slots → broke/misaligned once custom adds pushed it past 10 and it started overflowing the scroller (auto-margin fights `overflow-x`) → removed the auto margin entirely.
- 2026-08-02: Assumed removing `margin:auto` fully fixed the "layout explodes past 10 PFPs" bug → it didn't; root cause was `#pfp-wrap` (a CSS Grid item) missing `min-width: 0` — its child's `width: max-content` content was bubbling up and blowing out the *entire* single-column `#app` grid, not just the PFP row → fixed by forcing `min-width: 0` on all direct children of `#app`. This is the classic CSS Grid "blowout" gotcha — worth remembering for any future scrollable content inside a grid item.
- 2026-08-02: Gave the PFP row (rows 8-9) its own dedicated 40px side gutter (`--pfp-gutter`) so swipe arrows wouldn't overlap the grid content → user reverted this; wanted the shared 20px `--side-margin` back for design consistency, with arrows floating over the edge PFPs instead. Removed `--pfp-gutter` entirely rather than leaving it as dead CSS.
- 2026-08-02: PFP delete-badge (the small X for removing custom PFPs) was positioned poking 6px outside the cell (`top:-6px; right:-6px`) → got clipped on the top grid row because `#pfp-scroller` has `overflow-y: hidden` (needed to avoid an unwanted vertical scrollbar) → moved the badge fully inside the cell bounds (`top:2px; right:2px`, smaller) instead of trying to work around the clip.
- 2026-08-02: Interpreted the written spec literally for the header title ("fixed text, doesn't change with mode") → user directly corrected this mid-session to want it mode-dependent, then further upgraded it into a toggle control. Lesson: live user corrections override the written spec doc — don't re-litigate against the spec once the user has spoken.
