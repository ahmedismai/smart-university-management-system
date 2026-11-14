"use client";

import { useEffect, useState } from "react";
import { Download, Share, PlusSquare, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "sums-install-dismissed";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** Registers the service worker and shows an "Install app" button when the browser allows it. */
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch(() => {});
    }

    if (isStandalone()) return;

    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    } catch {}

    const ios =
      /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(ios);
    if (ios && !dismissed) setVisible(true);

    const w = window as Window & { __sumsInstallPrompt?: BeforeInstallPromptEvent };
    const onPrompt = (e?: Event) => {
      e?.preventDefault();
      const ev = (e as BeforeInstallPromptEvent | undefined) ?? w.__sumsInstallPrompt;
      if (!ev || typeof ev.prompt !== "function") return;
      setDeferred(ev);
      if (!dismissed) setVisible(true);
    };
    // The event may already have fired before hydration (captured in app/layout.tsx).
    if (w.__sumsInstallPrompt) onPrompt();
    const onCaptured = () => onPrompt();
    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("sums-installable", onCaptured);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("sums-installable", onCaptured);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (isIOS) {
      setShowIOSHelp(true);
      return;
    }
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    (window as Window & { __sumsInstallPrompt?: unknown }).__sumsInstallPrompt = undefined;
    if (outcome === "accepted") setVisible(false);
  };

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  if (!visible) return null;

  return (
    <>
      <div className="no-print fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-full bg-secondary pl-4 pr-1.5 py-1.5 shadow-xl shadow-black/30 ring-2 ring-white/70" data-keep-colors>
        <button
          onClick={install}
          className="flex items-center gap-2 text-sm font-bold text-primary whitespace-nowrap cursor-pointer"
        >
          <Download className="h-4 w-4" />
          Install App
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="ml-1 rounded-full p-1.5 text-primary/70 hover:bg-primary/10 hover:text-primary cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {showIOSHelp && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setShowIOSHelp(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-slate-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary">Install on iPhone / iPad</h3>
              <button onClick={() => setShowIOSHelp(false)} aria-label="Close" className="cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ol className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                1. Tap the <Share className="h-4 w-4 text-primary" /> <b>Share</b> button in Safari
              </li>
              <li className="flex items-center gap-2">
                2. Choose <PlusSquare className="h-4 w-4 text-primary" /> <b>Add to Home Screen</b>
              </li>
              <li>3. Tap <b>Add</b></li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
