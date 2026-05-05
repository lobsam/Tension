# Release Regression Checklist

## Validation Run

- Date: 2026-04-20
- Workflow: `npm run smoke:release`
- Build: pass (`vite build`)
- Route smoke: pass (`/`, `/articles`, `/articles/1`, `/art`)
- Responsive smoke: pass (12/12 checks across mobile/tablet/desktop)
- Machine-readable report: `qa/reports/responsive-smoke.latest.json`
- Non-blocking note: Vite reports large bundle chunk warnings (>500 kB)

## Release Metadata Package

- [x] Favicon points to production asset (`/favicon.ico`)
- [x] `description` metadata added
- [x] `theme-color` metadata added
- [x] Open Graph metadata added (`og:type`, `og:title`, `og:description`, `og:image`, `og:site_name`)
- [x] Twitter metadata added (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)

## Route x Viewport Regression Matrix

| Route | 375x812 (Mobile) | 768x1024 (Tablet) | 1440x900 (Desktop) |
| --- | --- | --- | --- |
| `/` | PASS | PASS | PASS |
| `/articles` | PASS | PASS | PASS |
| `/articles/1` | PASS | PASS | PASS |
| `/art` | PASS | PASS | PASS |

## Re-run Commands

```bash
npm run build
npm run smoke:routes
npm run smoke:responsive
# or run all at once
npm run smoke:release
```

## Release Sign-off Checks

- [ ] Confirm metadata previews on deployed domain (Open Graph/Twitter)
- [ ] Verify route content with live Sheets data in production
- [ ] Validate PDF view/download behavior in production browser set
