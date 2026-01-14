Hide 'For you' tab on X

This small Chrome extension hides the "For you" tab on X (formerly Twitter).

Install (Developer mode):

1. Open Chrome and go to `chrome://extensions`.
2. Enable "Developer mode" (top-right).
3. Click "Load unpacked" and select this repository folder.
4. Visit https://x.com or https://twitter.com and the extension will hide the "For you" tab.

Notes:
- The extension uses a content script that observes DOM changes and hides nav items whose text contains "For you".
- If X updates its UI or localizes the label, you may need to adapt the matching logic in `content.js`.
