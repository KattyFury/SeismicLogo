/* ─────────────────────────────────────────────────────────────
   SeismicLogo — default asset config
   Edit this file to change what shows up in "Seismic logo & PFP" mode.

   kind: 'image' → local file in logos/
   kind: 'x'     → an X (Twitter) account. The avatar is cached locally in
                   logos/x/ so the app never depends on a third party at
                   runtime; if the cached file is missing it falls back to
                   the live unavatar.io lookup.

   Slots fill top→bottom then left→right across the two PFP rows:
       1  3  5  7  9
       2  4  6  8  10
   Fewer than 10 entries → the remaining slots render as empty grey cells.
   ───────────────────────────────────────────────────────────── */

/* Live avatar lookup for an X handle (CORS-enabled, safe for canvas export) */
function xAvatarUrl(handle) {
  return 'https://unavatar.io/x/' + encodeURIComponent(handle);
}

const SEISMIC_ASSETS = [
  { kind: 'image', src: 'logos/1.png', label: 'Seismic logo 1' },
  { kind: 'image', src: 'logos/2.png', label: 'Seismic logo 2' },
  { kind: 'image', src: 'logos/3.png', label: 'Seismic logo 3' },
  { kind: 'image', src: 'logos/4.png', label: 'Seismic logo 4' },
  { kind: 'image', src: 'logos/5.png', label: 'Seismic logo stylised' },
  { kind: 'image', src: 'logos/6.png', label: 'Rocky head stylised' },
  { kind: 'image', src: 'logos/7.png', label: 'Lyron PFP' },
  { kind: 'x', handle: 'NoxxW3',   src: 'logos/x/noxxw3.png',   label: 'Noxx' },
  { kind: 'x', handle: 'xealistt', src: 'logos/x/xealistt.png', label: 'Xealist' },
  /* slot 10 intentionally empty */
];

/* Minimum number of cells drawn in the PFP grid (2 rows × 5) */
const PFP_MIN_SLOTS = 10;

/* The brand mark, also used as the app / favicon icon */
const BRAND_MARK = 'logos/0.png';
