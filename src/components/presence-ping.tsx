"use client";
import { useEffect } from "react";

export function PresencePing() {
  useEffect(() => {
    fetch("/api/presence", { method: "POST" });

    const interval = setInterval(() => {
      fetch("/api/presence", { method: "POST" });
    }, 60000); // 1 min

    return () => clearInterval(interval);
  }, []);

  return null;
}
