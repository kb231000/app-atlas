# App Atlas

A portfolio of **12 fully-functional web apps** you can run right in the browser —
everyday mini tools, an image-video composer and a personal finance companion.
No accounts, no tracking, no server: everything runs client-side and everything
stays on the device.

## Run it

Static site — any web server works:

```bash
python -m http.server 8123
# then open http://127.0.0.1:8123/
```

(Or just open `index.html` — no build step required.)

## The apps

**The Cozy Toolbox** — vanilla JS mini tools (`cozy/apps/`):
BMI Calculator · Budget Manager · Coin Flipper · Notes · Pills Reminder ·
QR Reader · Quiz · To-Do · Unit Converter · Video Player

**TypeScript apps** (`apps/`, built with Vite):
- **Still Studio** — compose still scenes into videos (layers, motion, WebM export)
- **Her Nest** — personal finance companion (emergency fund, debt payoff simulator)

## Engineering notes

Every app was reviewed line-by-line and hardened before shipping here:
- storage failures surface to the user instead of silently vanishing,
- corrupt saved data is quarantined before it can be overwritten,
- tabs stay in sync via `storage` events,
- all user content is escaped on render (no XSS surface),
- locale-aware number/date handling.
