// hooks/useEnterKey.js
import { useEffect } from "react";

export function useEnterKey(callback) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Enter") callback(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [callback]);
}