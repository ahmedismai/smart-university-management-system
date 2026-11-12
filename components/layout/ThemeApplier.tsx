"use client";

import { useEffect } from "react";
import { applyTheme } from "@/lib/theme";

/** Applies the saved theme on load and follows the OS setting while the choice is "system". */
export default function ThemeApplier() {
  useEffect(() => {
    applyTheme();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return null;
}
