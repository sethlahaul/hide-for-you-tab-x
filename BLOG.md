**Title:** Building a Minimal Chrome Extension to Hide the "For you" Tab on X

**Published:** January 14, 2026

**Summary**
This post walks through a small, focused Chrome extension that hides the "For you" tab on X (formerly Twitter). You’ll learn the architecture, implementation details, why certain choices were made, and how to test and publish the extension.

**Repository files**
- Manifest: [manifest.json](manifest.json)
- Content script: [content.js](content.js)
- Popup UI: [popup.html](popup.html), [popup.js](popup.js), [popup.css](popup.css)
- Icons: `icons/` (SVGs included)
- Packaging guidance: [store/README_STORE.md](store/README_STORE.md)
- Install instructions: [README.md](README.md)

**Motivation**
Some users prefer a chronological or following-first timeline. X’s default UI includes a prominent “For you” tab that surfaces algorithmic recommendations. The goal of this extension is strictly to hide the visible tab element labeled "For you" while leaving the rest of the interface intact (especially the adjacent `Following` tab).

Design goals:
- Target only the visible tab element labeled exactly "For you" to avoid collateral removal of sibling tabs.
- React to dynamic client-side navigation and DOM updates (X is a single-page app).
- Provide a simple on/off toggle persisted locally.
- Keep the extension minimal and privacy-friendly.

**High-level architecture**
- `manifest.json` (MV3): Declares a content script that runs on X/Twitter hosts, requests `storage` permission, and provides a popup UI (`action.default_popup`). See [manifest.json](manifest.json).
- `content.js`: Observes the page DOM, finds the element(s) that represent the "For you" tab, hides only the link/list item itself, and restores hidden elements when the user toggles off.
- Popup UI (`popup.html` + `popup.js` + `popup.css`): Simple toggle that stores `enabled` in `chrome.storage.local` and updates the content script in real time.
- `icons/`: SVG assets used by the extension UI. Guidance to convert to PNGs for Web Store is in [store/README_STORE.md](store/README_STORE.md).

**Key implementation details (content script)**
The important file is [content.js](content.js). The relevant responsibilities are:
1. Determine whether hiding is enabled via `chrome.storage.local`.
2. Observe DOM changes with a `MutationObserver` and periodically re-scan as fallback.
3. Identify elements that correspond exactly to the label "For you" (case-insensitive), including checking `aria-label`.
4. Hide the smallest logical tab element (prefer `a`, `[role="link"]`, or `li` ancestors) — do not hide `nav` or `section` parents.
5. Track hidden elements in a `Set` so they can be restored when the user disables the feature.
6. Listen to `chrome.storage.onChanged` for immediate updates when the popup toggles the preference.

Why this approach prevents the `Following` tab from disappearing
- Early attempts frequently hid parent containers (`nav`, `section`) which contained both `For you` and `Following`. That caused `Following` to vanish as a side effect. The current code finds the nearest clickable/list ancestor (`a`, `[role="link"]`, `li`) and hides that instead. This isolates the change to the single tab element.

Example of the exact-match logic used (conceptual snippet):

```js
const text = (el.textContent || '').trim().replace(/\s+/g, ' ');
const aria = (el.getAttribute && el.getAttribute('aria-label')) || '';
if (/^for you$/i.test(text) || /^for you$/i.test(aria.trim())) {
  const tab = el.closest('a, [role="link"], li') || el;
  tab.style.display = 'none';
  hiddenSet.add(tab);
}
```

This exact-match prevents accidental matching of longer phrases that contain "for you" and avoids hiding elements that merely include that substring.

**Popup UI and state sync**
The popup provides a single toggle that persists the boolean `enabled` in `chrome.storage.local`:
- On popup load: `chrome.storage.local.get({enabled: true}, cb)` to initialize the toggle.
- On change: `chrome.storage.local.set({enabled: checkbox.checked})`.
- The content script calls `chrome.storage.local.get(...);` during initialization and listens on `chrome.storage.onChanged` to apply changes immediately.

Files to inspect for this behavior: [popup.js](popup.js) and [content.js](content.js).

**Manifest details**
Important manifest notes (see [manifest.json](manifest.json)):
- `manifest_version: 3`
- `permissions`: `storage` (to persist toggle); `scripting` included for potential future use.
- `content_scripts`: runs `content.js` on `https://*.twitter.com/*` and `https://*.x.com/*` at `document_idle`.
- `action.default_popup`: set to `popup.html` for the toggle UI.
- `icons`: references SVG icons in `icons/`.

**Install & test locally**
1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this repository folder.
4. Visit `https://x.com` (or `https://twitter.com`).
5. Click the extension icon and toggle the switch. The `For you` tab should hide or reappear immediately.

Testing tips:
- Test client-side navigation (e.g., switching tabs in X) and ensure the mutation observer hides the tab after navigation.
- Confirm `Following` remains visible.
- Disable the extension or toggle off to verify the hidden elements are restored.

**Publishing guidance**
- Web Store prefers PNG icons for some fields; see [store/README_STORE.md](store/README_STORE.md) for ImageMagick example commands to create PNGs.
- Prepare listing assets: descriptions, screenshots, and a privacy policy if needed. The extension stores a single local boolean and does not transmit any data.
- Build a webstore-ready zip (`hide-for-you-tab-x-webstore.zip`) — note the repo already contains a webstore zip; replace SVGs with PNGs if required.

**Privacy & security considerations**
- The extension stores only a local boolean `enabled` in `chrome.storage.local`.
- No network communication, analytics, or telemetry is performed.
- Manifest host permissions are restricted to X/Twitter to limit script injection surface.

**Future improvements**
- Add localized label variants (e.g., translate "For you" into target locales) and provide an options page to manage locale matches.
- Create an opt-in logging mode (local only) for debugging if users report issues.
- Add unit or integration tests using a headless browser like Puppeteer to validate behavior across UI updates.
- Add screenshots and a short privacy policy file for the Chrome Web Store listing.

**Full code references**
- [manifest.json](manifest.json)
- [content.js](content.js)
- [popup.html](popup.html)
- [popup.js](popup.js)
- [popup.css](popup.css)
- `icons/` (SVG files included)
- [store/README_STORE.md](store/README_STORE.md)

**Closing / call to action**
If you’d like, I can:
- Add localized matches for common languages and update `content.js` accordingly.
- Convert the SVG icons to PNGs automatically and update `manifest.json` to reference PNGs for Web Store compatibility.
- Draft a short privacy policy file tailored for the Web Store listing.

Tell me which of the above you'd like next and I’ll proceed.
