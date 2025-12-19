'use strict';

let enabled = true;
let currentTabId = null;
const toggleSwitch = document.querySelector('#toggle');

// Get current tab and its state
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    currentTabId = tabs[0].id;

    // Get state for this specific tab from background
    chrome.runtime.sendMessage({ type: 'getState', tabId: currentTabId }, (response) => {
      enabled = response?.enabled ?? true;
      setToggleState();
    });
  }
});

toggleSwitch.addEventListener('change', () => {
  enabled = toggleSwitch.checked;

  if (currentTabId) {
    // Set state for this specific tab
    chrome.runtime.sendMessage({
      type: 'setState',
      tabId: currentTabId,
      enabled,
    });
  }
});

function setToggleState() {
  toggleSwitch.checked = enabled;
}
