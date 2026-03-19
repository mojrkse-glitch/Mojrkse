"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type ThemeMode = "dark" | "light";

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as ThemeMode | null) || "dark";
    setTheme(saved);
    applyTheme(saved);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleTheme}
      className={compact ? "h-10 w-10 rounded-xl px-0" : "gap-2"}
      aria-label={mounted && theme === "dark" ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
    >
      {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {compact ? null : <span>{mounted && theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}</span>}
    </Button>
  );
}
