import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { Overlay } from './components';
import './index.css';

console.log("Subscription Shield auto-scanner loaded and analyzing page...");

// 1. Maintain the session sync listener for the main web app
window.addEventListener('message', (event) => {
  if (event.source !== window || !event.data || event.data.type !== 'SYNC_SUPABASE_SESSION') return;

  if (event.data.session) {
    chrome.storage.local.set({ supabaseSession: event.data.session });
    console.log("Subscription Shield synced session from page.");
  } else {
    chrome.storage.local.remove('supabaseSession');
    console.log("Subscription Shield removed session.");
  }
});

// 2. Heuristic Detection Logic
const SUBSCRIPTION_TRIGGERS = [
  "start free trial",
  "subscribe now",
  "auto-renew",
  "recurring billing",
  "credit card information",
  "cancel anytime",
  "cancel anytime",
  "terms of service",
  "checkout",
  "pricing"
];

const IGNORED_DOMAINS = [
  "google.com",
  "bing.com",
  "yahoo.com",
  "duckduckgo.com",
];

function analyzePageForSubscription() {
  const hostname = window.location.hostname.toLowerCase();
  for (const domain of IGNORED_DOMAINS) {
    if (hostname.includes(domain)) {
      console.log(`Subscription Shield: Ignoring search engine domain (${hostname}).`);
      return;
    }
  }

  const pageText = document.body.innerText.toLowerCase();

  // Count how many trigger phrases appear on the page
  let triggerCount = 0;
  for (const trigger of SUBSCRIPTION_TRIGGERS) {
    if (pageText.includes(trigger)) {
      triggerCount++;
    }
  }

  // If we find at least 2 triggers, we assume it's a checkout/trial page
  if (triggerCount >= 2) {
    console.log(`Subscription Shield: Detected ${triggerCount} subscription triggers. Injecting overlay.`);
    injectOverlay();
  } else {
    console.log("Subscription Shield: No significant subscription triggers found.");
  }
}

// 3. UI Injection Logic
function injectOverlay() {
  // Prevent double injection
  if (document.getElementById('subscriptos-root')) return;

  // Create a container div
  const overlayRoot = document.createElement('div');
  overlayRoot.id = 'subscriptos-root';

  if (!document.getElementById('subscriptos-fonts')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'subscriptos-fonts';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const styleBlock = document.createElement('style');
    styleBlock.id = 'subscriptos-styles-override';
    styleBlock.textContent = `
      #subscriptos-root, #subscriptos-root * {
        font-family: 'Space Grotesk', system-ui, sans-serif !important;
      }
      #subscriptos-root .font-mono, #subscriptos-root .font-mono * {
        font-family: 'JetBrains Mono', ui-monospace, monospace !important;
      }
    `;
    document.head.appendChild(styleBlock);
  }

  // To ensure the overlay renders on top of everything and doesn't push page content
  overlayRoot.style.position = 'fixed';
  overlayRoot.style.bottom = '0';
  overlayRoot.style.right = '0';
  overlayRoot.style.width = '100%';
  overlayRoot.style.height = '100%';
  overlayRoot.style.zIndex = '2147483647';
  overlayRoot.style.pointerEvents = 'none'; // Let clicks pass through to the page where our UI isn't

  document.body.appendChild(overlayRoot);

  // Mount the React component
  const root = createRoot(overlayRoot);

  root.render(
    <React.StrictMode>
      <AuthProvider>
        <Overlay />
      </AuthProvider>
    </React.StrictMode>
  );
}

// Wait for the page to be fully loaded before scanning
if (document.readyState === 'complete') {
  analyzePageForSubscription();
} else {
  window.addEventListener('load', analyzePageForSubscription);
}
