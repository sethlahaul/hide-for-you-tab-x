# Building "Hide 'For You' Tab on X" Chrome Extension

![Extension Mockup](extension_mockup_1768449014296.png)

In this post, I'll walk through the implementation of a simple yet powerful Chrome extension designed to declutter the X (formerly Twitter) experience by automatically hiding the "For you" tab.

## The Motivation

The "For you" tab on X often contains algorithmic recommendations that can be distracting and lead to "doomscrolling." While users can manually switch to the "Following" tab, the UI frequently defaults back or keeps the tab visible. This extension ensures the tab is hidden from view as soon as it appears, allowing for a more intentional social media experience.

## Project Structure

A clean, modular structure is key for even small projects. Here’s how this extension is organized:

```text
hide-for-you-tab-x/
├── manifest.json      # Extension metadata and permissions
├── content.js         # The main logic that interacts with the page
├── popup.html         # The extension's UI
├── popup.js           # UI logic and storage handling
├── popup.css          # Styling for the popup
├── icons/             # App icons (16, 48, 128px)
└── README.md          # Documentation
```

## Technical Architecture

The extension is built using standard Web Technologies (HTML, CSS, JavaScript) and follows the **Chrome Extension Manifest V3** standard.

### 1. The Manifest (`manifest.json`)
The manifest file is the blueprint. We use version 3 for better security and performance.
- **Permissions**: 
    - `storage`: To save whether the user wants the hiding feature enabled or disabled.
    - `scripting`: Required for running some of the automation.
- **Host Permissions**: Restricted to `twitter.com` and `x.com`. We only request access to what we actually need.
- **Content Scripts**: `content.js` is set to run at `document_idle` to ensure the core page structure is there before we start scanning.

### 2. The Brain: Content Script (`content.js`)
Since X is a Single Page Application (SPA), the content script needs to be highly reactive.

#### The MutationObserver
Instead of a simple "run once" script, we use the `MutationObserver` API. This watches for changes in the DOM tree in real-time. If a new navigation bar or tab is rendered, our script detects it immediately.

```javascript
const observer = new MutationObserver(hideForYouOnce);
observer.observe(document.documentElement || document, {
  childList: true, 
  subtree: true 
});
```

#### Selection Logic
We use a combination of tag selectors and attribute matching to find the "For you" tab. We don't just look for text; we look for the **context**.
1. **Tags**: We scan `a`, `div`, `span`, and `li` elements.
2. **Attributes**: We check for `aria-label="For you"`, which is often used for accessibility and is a more reliable selector than class names which are obfuscated by X.
3. **Regex Matching**: We use a case-insensitive regex `/^for you$/i` to ensure we get exact matches.

### 3. State Management & Restoration
The extension doesn't just hide elements; it manages them.
- **`hiddenSet`**: We keep a `Set` of elements we've hidden so we can quickly unhide them if the user toggles the extension off without needing to reload the page.
- **Storage Listeners**: The content script listens for `chrome.storage.onChanged`. When you flip the switch in the popup, the content script reacts instantly.

## UI/UX Design: The Popup

The popup provides a simple toggle switch. It was designed to be lightweight (220px wide) and user-friendly.

- **CSS Slider**: A custom-styled slider provides visual feedback. Green means active, grey means disabled.
- **Note**: A small note reminds users that changes apply immediately across all open X tabs.

```css
/* Styling the slider */
.slider {
  background: #ccc;
  border-radius: 24px;
  transition: .2s;
}
input:checked + .slider {
  background: #4caf50;
}
```

## How to Install (Developer Mode)

1. **Clone/Download** this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the folder containing these files.
5. Visit [x.com](https://x.com) to see it in action!

## Performance & Privacy

- **Minimal Footprint**: The script is optimized to run only on X domains.
- **No Data Collection**: Everything is stored locally on your machine via `chrome.storage.local`.
- **Latency**: The `MutationObserver` is very efficient, and the fallback `setInterval` runs at 1.5 seconds, ensuring no noticeable impact on browser performance.

## Conclusion

Building this extension highights the power of simple scripts to solve personal productivity issues. By mastering the `MutationObserver` and understanding SPA behavior, you can customize your web experience to fit your needs perfectly.

---
*Created by Lahaul Seth*
