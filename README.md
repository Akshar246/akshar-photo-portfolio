# Akshar — Photograph Archive

A responsive, screen-reader-friendly static photography portfolio. It uses plain HTML, CSS, and JavaScript; no framework, backend, tracking, account, or API key is needed.

## Add your photographs

1. Put web-sized JPG or WebP copies in `photos/`. Keep original/private files elsewhere: anything deployed in this folder is public and may be downloaded.
2. Open `gallery.js` and add image records in the example format. Each record supports:
   - `src`: path to the image, such as `photos/coast.webp`
   - `title`: short display title
   - `alt`: a concise description of the visible photograph for screen-reader users
   - `series`: album/filter name, such as `Coast` or `Street`
   - `caption`: optional note shown below the image
3. Set `coverImage` and descriptive `coverAlt` if you want a cover photograph. Leave `coverImage` blank for the designed cover panel. For social previews, also set the `og:image` meta tag in `index.html` to the cover's public URL after deployment.
4. Preview from this folder with `python3 -m http.server 8000`, then open `http://localhost:8000`.
5. When ready, redeploy the project so the new photos appear for everyone.

## Free hosting

GitHub Pages is a static host that publishes HTML, CSS, and JavaScript from a GitHub repository. To publish, create and control your own GitHub account, put this folder in a repository, and enable Pages in that repository's settings. GitHub Pages can provide a `github.io` address; a custom domain is optional and may cost money. Check the provider's current terms and limits before uploading a large photo library.

No hosting account has been created for you. Never send passwords or access tokens in chat or put them in this project. A static site does not need secret credentials. This portfolio intentionally has no public server-side upload form: adding files to the project and redeploying is safer and means the public site cannot overwrite or store arbitrary uploads.

## Accessibility and privacy

The layout supports keyboard focus, skip navigation, reduced-motion preferences, responsive viewing, image alt text, and an accessible photograph viewer. The share button uses your device's share sheet when available. There are no analytics or third-party image requests. Photos you publish are public, so export resized copies rather than private originals.
