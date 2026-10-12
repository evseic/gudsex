# GUDSEX · The first expression

The original standalone homepage is kept in `index.html`, including its photo, fonts, layout, form and animations. Its headline is now JOIN US. React mounts the post-signup experience separately, with scoped shop styles.

## Run locally

- `npm run dev:api` — email API on port 3001.
- `npm run dev` — Vite website on http://localhost:3000, proxying `/api` to the API server.
- `npm test` — six tests covering confirmed signup, duplicate retry, database/provider failures, input validation.
- `npm run build` — production assets in `dist`.
- `npm start` — serves `dist` and the email API together on http://localhost:3001. Use `PORT` and `HOST` for your deployment environment.

## Email gate

The existing Supabase subscribers table and Omnisend v3 contacts integration are retained. The Omnisend credential has been moved out of the public HTML and into the ignored, owner-readable `.env.local`; the server also accepts deployment environment variables. `.env.example` lists the required names without secrets. Do not deploy `.backups` or `.env.local` as public files. The previously public Omnisend credential should be rotated in Omnisend, then replaced in server configuration.

The server checks both provider responses before granting access. A database failure does not call Omnisend; a provider failure displays a retry message. A Supabase unique-email conflict can retry Omnisend. Tracker events are retained after confirmed success. Live provider writes have not been tested with a real subscriber. Verify existing key validity, Supabase insert permissions, welcome automation and duplicate-email behavior in your account before launching.

Deploy the Node server (or port the `/api/subscribe` handler to your host's serverless function). Uploading only `dist` to a static host will display the site but will not run the email API. No change has been published to gudsex.com.

## Experience

Successful signup displays ACCESS GRANTED, opens two burgundy fabric curtains and reveals the model. The cap and T-shirt hotspots open a focused preview; the image or VIEW ITEM opens a product screen. After ten idle seconds the model slides aside and fades, revealing two shoppable pieces within the same charcoal studio scene. There is no separate collection landing page. Interacting with a hotspot pauses the automatic exit. VIEW THE PIECES allows an immediate transition. THE LOOK returns to the model without replaying the gate or curtains. Product screens, previews and the bag share the homepage’s white typography, charcoal lighting, grain and glass controls.

The model exit is a restrained transition of a still portrait, not generated walking video. Reduced-motion preferences disable movement. Native modal dialogs trap focus, close with Escape and restore focus. Products have keyboard-accessible options and quantity controls. Access and bag contents persist on the current device; the email gate is a brand experience, not authentication or authorization for private content.

## Products and Shopify

Edit names, descriptions, prices, images and Shopify variant IDs in `src/shop/products.js`. No prices or inventory claims have been invented. White/black T-shirts have S, M, L and XL variants; caps have One Size. Bag lines remain distinct by product, color and size; quantities are limited to 10 per variant.

`src/shop/commerce.js` isolates Shopify integration. Add your store's `VITE_SHOPIFY_STORE_DOMAIN` and public Storefront API token, fill in real variant IDs and prices, then rebuild. Never use an Admin API token. The adapter creates a Shopify cart and redirects to its returned checkout URL. Until configured, checkout is disabled and clearly marked as coming soon. No payment is simulated.

Reference: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage
Email reference: https://api-docs.omnisend.com/v3/reference/post-contacts

## Assets

The four latest supplied product renders are optimized as WebP in `public/products`; originals remain in their supplied locations. The latest model reference is `public/model-street-reference.webp`. `public/model-street-cutout.webp` was made with the built-in imagegen tool and optimized to WebP. Prompt: remove only the background and floor from the supplied full-body model portrait; preserve identity, standing pose, clothing, small burgundy chest logo and lighting; output a transparent full-body cutout. The generated cutout may have small differences from the reference and is used for the stage only. The original homepage photograph is unchanged.

## QA preview

`node tests/preview-server.mjs` serves the production build at http://localhost:3002 using simulated provider responses. Any valid email succeeds; `failure@example.com` tests the error state. This is a local testing entry point, never production. Its HTML omits the Omnisend tracking script so test identities are not transmitted. No demo bypass is present in the production gate.

Model update: uses the supplied street-style portrait. Built-in imagegen prompt: remove only background and floor; preserve this model’s face, hair, pose, clothing, small chest logo and lighting; transparent square full-body canvas, cap at 5% and shoes at 95%. Curtains glide for 4.2 seconds; discovery labels appear after the opening completes. Cap label has a longer leader on desktop and mobile.

Reveal update: photoreal velvet curtain asset is `public/curtain-velvet.webp`, generated with built-in imagegen. Prompt: full-frame deep oxblood velvet curtain, natural broad folds, subtle pile and grazing warm light, near-black shadows, no stripes, gold, text or objects. Curtains have been removed from the reveal. At one second after confirmed signup, the smaller centered burgundy “SEE IT. WANT IT. FUCK IT.” appears for two seconds, then the model fades in. REPLAY SHOW manually repeats the intro without resubmitting email. Reduced-motion mode presents the statement without curtain movement.
