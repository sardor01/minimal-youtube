/// <reference types="chrome" />

/* This runs after a web page loads */
let oldHref = document.location.href;
let isEnabled = true;

// Get initial state from background script
chrome.runtime.sendMessage({ type: 'getStateForCurrentTab' }, (response) => {
  isEnabled = response?.enabled ?? true;
  applyMinimalMode();
  displayBody();
  init();
});

// Listen for state changes from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'stateChanged') {
    isEnabled = message.enabled;
    // Reload to apply/remove minimal mode cleanly
    window.location.reload();
  }
});

function init() {
  const bodyList = document.querySelector('body');
  const headList = document.querySelector('head');

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (oldHref != document.location.href) {
        oldHref = document.location.href;
        applyMinimalMode();
      }
      if (mutation.target.tagName == 'TITLE') {
        removeUnreadCountFromTitle();
      }
    });
  });

  const titleObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.target.tagName == 'TITLE') {
        removeUnreadCountFromTitle();
      }
    });
  });

  const config = {
    childList: true,
    subtree: true,
  };

  observer.observe(bodyList, config);
  titleObserver.observe(headList, config);
  removeUnreadCountFromTitle();
}

function applyMinimalMode() {
  if (isEnabled && isWatchPage()) {
    addMinimalYoutubeClassToHtml();
  } else {
    removeMinimalYoutubeClassFromHtml();
  }
}

function isWatchPage() {
  return window.location.pathname === '/watch';
}

function removeUnreadCountFromTitle() {
  const title = document.title;
  if (title.match(/^\(\d+\)\s*/) === null) {
    return;
  }
  const newTitle = title.replace(/^\(\d+\)\s*/, '');
  document.title = newTitle;
}

function addMinimalYoutubeClassToHtml() {
  const root = document.documentElement;
  if (!root.classList.contains('minimal-youtube')) {
    root.classList.add('minimal-youtube');
  }
}

function removeMinimalYoutubeClassFromHtml() {
  const root = document.documentElement;
  root.classList.remove('minimal-youtube');
}

function displayBody() {
  document.body.style.display = 'block';
}
