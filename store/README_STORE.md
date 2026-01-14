Chrome Web Store preparation

This folder contains guidance and assets for publishing the extension.

Required before publishing
- Convert the SVG icons in `icons/` to PNGs at sizes 128x128, 48x48, and 16x16. Chrome Web Store requires PNG icons for the listing and some platforms.

Recommended ImageMagick commands (on Windows with ImageMagick installed):

```powershell
magick convert icons/icon-128.svg -background none -resize 128x128 icons/icon-128.png
magick convert icons/icon-48.svg -background none -resize 48x48 icons/icon-48.png
magick convert icons/icon-16.svg -background none -resize 16x16 icons/icon-16.png
```

PowerShell native (Windows 11) using `rsvg-convert` if available:

```powershell
rsvg-convert -w 128 -h 128 icons/icon-128.svg > icons/icon-128.png
```

Publishing steps
1. Make sure your `manifest.json` has `icons` (done).
2. Prepare a developer account and the extension listing (screenshots, description, privacy policy URL if required).
3. Use `chrome://extensions` to load the unpacked extension for testing.
4. When ready, upload the zip created in the repo root named `hide-for-you-tab-x-webstore.zip`.

Notes
- The manifest currently references SVG icons. Replace those paths with PNG filenames after conversion if required.
- Include a clear privacy policy if you collect any data. This extension stores only a single local `enabled` flag via `chrome.storage.local`.
