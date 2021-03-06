# WebVI Debugger

**Note: You are probably looking for the [DebugTools](https://bit.ly/debugtools) project instead of this one.**

This project is Incredibly experimental. Major security issues (see TODOs below). 🔥

Only supports NXG 5.

## Overview

1. Use the `WebVIDebugger` library to add `Inspect Panel Values VI` calls to your application.
2. Build the `WebVIDevTools` application and install it as an Extension in Firefox or Chrome (no Edge or Safari support).
3. Build and run your application in browser where the extension was installed, open DevTools to the WebVI tab, see inspect panel results.

## Data flow

1. The `Inspect Panel Values VI` uses the `window.postMessage()` api to send JSON to **ALL ORIGINS** (any open tab will be able to observe the values, this is a security risk).

   TODO: switch to events fired from the ni-web-application element? I think content scripts can access those.
2. The `WebVIDevTools` content script (`webvi-devtools-content.js`) that is injected by the extension into **ALL WEB PAGES** listens to the messages post to all origins.

   TODO: switch to the [activeTab api](https://developer.chrome.com/extensions/activeTab) so user can enable content script only on pages they want to

   The content script then uses `browser.runtime.sendMessage()` to send a message across the Extension's private message bus.

   TODO: switch to [connect api](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/connect) instead of extension message + element events so can tell which page instance is the event source.
3. The `WebVIDevTools` panel built from `webvi-devtools-panel.gviweb` listens for messages on the Extension's private message bus.
