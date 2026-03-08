"use client";

import * as React from "react";

const STORAGE_KEY = "vt-threads-skin";

export type Skin = "default" | "principia";

interface SkinContextValue {
  skin: Skin;
  setSkin: (skin: Skin) => void;
}

const SkinContext = React.createContext<SkinContextValue | undefined>(
  undefined,
);

function applySkin(skin: Skin) {
  const html = document.documentElement;
  if (skin === "principia") {
    html.classList.add("theme-principia");
  } else {
    html.classList.remove("theme-principia");
  }
}

export function SkinProvider({ children }: { children: React.ReactNode }) {
  const [skin, setSkinState] = React.useState<Skin>("default");
  const mounted = React.useRef(false);

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Skin | null;
    const value = stored === "principia" ? "principia" : "default";
    setSkinState(value);
    applySkin(value);
    mounted.current = true;
  }, []);

  const setSkin = React.useCallback((newSkin: Skin) => {
    setSkinState(newSkin);
    localStorage.setItem(STORAGE_KEY, newSkin);
    applySkin(newSkin);
  }, []);

  return (
    <SkinContext.Provider value={{ skin, setSkin }}>
      {children}
    </SkinContext.Provider>
  );
}

export function useSkin() {
  const ctx = React.useContext(SkinContext);
  if (ctx === undefined) {
    throw new Error("useSkin must be used within SkinProvider");
  }
  return ctx;
}
