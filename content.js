(function() {
  const SELECTORS = 'a,div,span,li';
  let enabled = true;
  const hiddenSet = new Set();

  function hideForYouOnce() {
    if (!enabled) return;
    document.querySelectorAll(SELECTORS).forEach(n => {
      try {
        const raw = (n.textContent || '').trim();
        const text = raw.replace(/\s+/g, ' ');
        if (!text) return;
        // Match exact "For you" (case-insensitive) or aria-label exactly equal
        const isForYouText = /^for you$/i.test(text);
        const aria = (n.getAttribute && n.getAttribute('aria-label')) || '';
        const isForYouAria = /^for you$/i.test((aria || '').trim());
        if (isForYouText || isForYouAria) {
          // Prefer hiding the link/list item itself, not larger containers like nav/section
          const root = n.closest('a, [role="link"], li');
          const target = root || n;
          if (target && target.style.display !== 'none') {
            hiddenSet.add(target);
            target.style.display = 'none';
          }
        }
      } catch(e) {}
    });
  }

  function restoreHidden() {
    for (const el of Array.from(hiddenSet)) {
      try {
        if (el && el.style) el.style.display = '';
      } catch (e) {}
    }
    hiddenSet.clear();
  }

  function updateEnabled(v) {
    enabled = !!v;
    if (!enabled) restoreHidden();
    else hideForYouOnce();
  }

  // initialize from storage (default enabled)
  chrome.storage && chrome.storage.local && chrome.storage.local.get({enabled: true}, (res) => {
    updateEnabled(res.enabled);
  });

  // listen to changes from popup
  if (chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.enabled) updateEnabled(changes.enabled.newValue);
    });
  }

  const observer = new MutationObserver(hideForYouOnce);
  observer.observe(document.documentElement || document, {childList:true, subtree:true});
  hideForYouOnce();
  setInterval(hideForYouOnce, 1500);
})();
