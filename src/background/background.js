/// <reference types="chrome" />

'use strict';

// Track enabled state per tab
const tabStates = new Map();

// Default state for new tabs
const DEFAULT_ENABLED = false;

// Get state for a specific tab
function getTabState(tabId) {
  return tabStates.has(tabId) ? tabStates.get(tabId) : DEFAULT_ENABLED;
}

// Set state for a specific tab
function setTabState(tabId, enabled) {
  tabStates.set(tabId, enabled);
}

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  tabStates.delete(tabId);
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getState') {
    const tabId = message.tabId;
    sendResponse({ enabled: getTabState(tabId) });
    return true;
  }

  if (message.type === 'setState') {
    const tabId = message.tabId;
    setTabState(tabId, message.enabled);

    // Notify the content script in that tab
    chrome.tabs.sendMessage(tabId, {
      type: 'stateChanged',
      enabled: message.enabled,
    });

    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'getStateForCurrentTab') {
    // Called from content script - use sender.tab.id
    const tabId = sender.tab.id;
    sendResponse({ enabled: getTabState(tabId) });
    return true;
  }
});
