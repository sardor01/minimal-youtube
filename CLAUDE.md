# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Minimal YouTube is a Chrome extension that replaces the YouTube UI with a minimal, distraction-free design. It removes recommendations, shorts, comments, and other distracting elements while preserving core video watching functionality.

## Architecture

This is a Manifest V3 browser extension with no build step - plain JavaScript/CSS loaded directly by the browser.

### Key Components

- **manifest.json** - Extension manifest (v3), defines content scripts and popup
- **src/content/content.js** - Content script injected into YouTube pages:
  - Replaces the homepage with a minimal search interface
  - Uses MutationObserver to handle YouTube's SPA navigation
  - Removes notification counts from page titles
  - Adds `.minimal-youtube` class to enable CSS hiding rules
- **src/styles/styles.css** - CSS that hides distracting elements (sidebar, recommendations, comments, shorts) and restyling
- **src/popup/** - Extension popup with enable/disable toggle using `chrome.storage.local`

### How It Works

1. Content script adds `.minimal-youtube` class to `<html>` when enabled
2. CSS rules scoped to `.minimal-youtube` hide unwanted elements
3. Homepage is completely replaced with a custom search-only interface
4. MutationObserver watches for URL changes (SPA navigation) and title changes

## Development

Load as an unpacked extension in Chrome: `chrome://extensions` → Enable developer mode → Load unpacked

No build process or dependencies. Edit files and reload the extension.

## Code Style

- 4-space indentation (see .prettierrc.json)
- Uses `chrome.storage.local` API for persistence
