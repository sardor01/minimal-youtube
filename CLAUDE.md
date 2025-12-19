# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Minimal YouTube is a Chrome extension that provides a distraction-free YouTube experience. It only modifies the video watch page (`/watch`) - hiding recommendations, comments, and other distracting elements while preserving core video watching functionality. All other YouTube pages (homepage, search, channels) remain unchanged.

## Architecture

This is a Manifest V3 browser extension with a build step for distribution.

### Key Components

- **manifest.json** - Extension manifest (v3), defines content scripts, popup, and background service worker
- **src/content/content.js** - Content script injected into YouTube pages:
  - Only applies minimal styling on `/watch` pages
  - Uses MutationObserver to handle YouTube's SPA navigation
  - Removes notification counts from page titles
  - Adds `.minimal-youtube` class to enable CSS hiding rules
- **src/styles/styles.css** - CSS that hides distracting elements (sidebar, recommendations, comments, live chat)
- **src/popup/** - Extension popup with tab-specific enable/disable toggle
- **src/background/background.js** - Background service worker that manages per-tab enabled state

### How It Works

1. Background script tracks enabled/disabled state per tab (using tab IDs)
2. Content script only adds `.minimal-youtube` class on `/watch` pages when enabled
3. CSS rules scoped to `.minimal-youtube` hide unwanted elements
4. MutationObserver watches for URL changes (SPA navigation) and title changes
5. Toggling affects only the current tab, not all YouTube tabs

## Development

### Loading for Development

Load the **root folder** as an unpacked extension:
`chrome://extensions` → Enable developer mode → Load unpacked → Select project root

### Building for Distribution

Run `node scripts/build.cjs` to create a `dist/` folder with flattened structure.

**Important:** The build script (`scripts/build.cjs`) must be updated when adding new files:

1. Add new source files to the `copies` array
2. Update manifest path transformations if needed (e.g., `manifest.background.service_worker`)
3. Handle any path fixes for the flat dist structure (e.g., popup.html asset paths)

Load the **dist folder** for production testing:
`chrome://extensions` → Load unpacked → Select `dist/`

## Commands

```bash
npm run build       # Build dist/ for distribution
npm run lint        # Run ESLint
npm run format      # Check Prettier formatting
```

## Code Style

- 2-space indentation (see .prettierrc.js)
- Tab-specific state managed via background script messaging
