# Nail-Rich Studio — press-on shop (prototype implementation)

Responsive, static implementation of the `Nail-Rich Studio - Prototype.dc.html` design
handoff from Claude Design. Plain HTML/CSS/JS, no build step.

## Run

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

- `index.html` — all screens (home, shop, product, sizing, custom, cart drawer, checkout, confirmation)
- `css/styles.css` — design tokens + responsive styles ("Editorial Nail Atelier" direction)
- `js/app.js` — state machine, navigation, filters, product config, sizing, cart, checkout
- `assets/` — logo and sample product photography

## Design notes

- Mobile-first, scales to tablet/desktop (breakpoints at 680px and 900px).
- Palette: ink `#241A1D`, ivory `#FBF6F1`, shell `#F3E5E0`, berry-cerise CTA `#8C2350`, brass accent `#A9895C`.
- Type: Cormorant Garamond (display) + Manrope (UI), with serif/sans fallbacks.
- `prefers-reduced-motion` respected; 44px minimum touch targets; keyboard/Esc support on drawers.

## Scenario A (implemented end-to-end)

Home → Shop → filter → Product (shape/length) → "Jag vet inte min storlek" → Sizing-kit →
Cart → Checkout → Confirmation. Choosing the sizing kit adds it (149 kr) as a cart line so
the flow completes; all prices/VAT are sample placeholders pending Pat's confirmation
(see the Strategi & Research doc).

Content is sample-only Swedish copy; no shipping, VAT, or product-material claims are asserted as final.
