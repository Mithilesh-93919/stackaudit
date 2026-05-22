"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-lg border border-transparent text-muted-foreground"
        disabled
      >
        <span className="h-4 w-4 rounded-full bg-muted/40 animate-pulse" />
      </Button>
    );
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4 text-amber-500 transition-transform group-hover:rotate-45 duration-300" />;
      case "dark":
        return <Moon className="h-4 w-4 text-violet-400 transition-transform group-hover:-rotate-12 duration-300" />;
      default:
        return <Laptop className="h-4 w-4 text-indigo-400" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="group relative h-9 w-9 flex items-center justify-center overflow-hidden rounded-lg border border-border/40 bg-background/50 hover:bg-accent/80 hover:text-accent-foreground shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer outline-none"
        aria-label="Toggle theme"
      >
        <span className="flex items-center justify-center transition-all duration-300">
          {getThemeIcon()}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 border-border/80 bg-background/95 backdrop-blur-md animate-in fade-in-50 slide-in-from-top-1 duration-200">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            theme === "light" ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            theme === "dark" ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Moon className="h-3.5 w-3.5 text-violet-400" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            theme === "system" ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Laptop className="h-3.5 w-3.5 text-indigo-400" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
