"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function switchTheme(setTheme: (theme: string) => void, newTheme: string) {
  document.documentElement.classList.add("theme-transitioning");
  setTheme(newTheme);
  setTimeout(() => {
    document.documentElement.classList.remove("theme-transitioning");
  }, 300);
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSetTheme = useCallback(
    (newTheme: string) => {
      switchTheme(setTheme, newTheme);
    },
    [setTheme]
  );

  if (!mounted) {
    return (
      <Button aria-label="Toggle theme" disabled size="icon" variant="ghost">
        <SunIcon className="size-4" />
      </Button>
    );
  }

  let icon = <MonitorIcon className="size-4" />;
  if (theme === "dark") {
    icon = <MoonIcon className="size-4" />;
  } else if (theme === "light") {
    icon = <SunIcon className="size-4" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Toggle theme" size="icon" variant="ghost">
          {icon}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          data-active={theme === "light"}
          onClick={() => handleSetTheme("light")}
        >
          <SunIcon className="size-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          data-active={theme === "dark"}
          onClick={() => handleSetTheme("dark")}
        >
          <MoonIcon className="size-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          data-active={theme === "system"}
          onClick={() => handleSetTheme("system")}
        >
          <MonitorIcon className="size-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
