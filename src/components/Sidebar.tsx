"use client";

import {
  Building2,
  ChartColumnIncreasing,
  House,
  Moon,
  Package,
  Settings,
  Sun,
  UserCircle2,
  X,
  Check,
  ChevronLeft,
} from "lucide-react";
import SidebarLink from "./SidebarLink";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ACCENTS = [
  {
    key: "red",
    name: "Red",
    hex: "#ef4444",
    gradient: "linear-gradient(135deg, #f43f5e, #f59e0b)",
  },
  {
    key: "blue",
    name: "Blue",
    hex: "#3b82f6",
    gradient: "linear-gradient(135deg, #60a5fa, #06b6d4)",
  },
  {
    key: "green",
    name: "Green",
    hex: "#22c55e",
    gradient: "linear-gradient(135deg, #34d399, #84cc16)",
  },
  {
    key: "black",
    name: "Onyx",
    hex: "#111827",
    gradient: "linear-gradient(135deg, #0f172a, #374151)",
  },
];

function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function Sidebar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [accentSelected, setAccentSelected] = useState<
    "red" | "blue" | "green" | "black"
  >("red");
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(
          "@business-game:sidebar-collapsed",
          next ? "1" : "0",
        );
      } catch {}
      return next;
    });
  };

  const setTheme = (theme: string) => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("@business-game:theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("@business-game:theme", "dark");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("@business-game:theme") || "light";
    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }

    const savedCollapsed =
      localStorage.getItem("@business-game:sidebar-collapsed") === "1";
    setCollapsed(savedCollapsed);
  }, []);

  const setAccent = (color: string) => {
    document.documentElement.classList.remove(
      "accent-red",
      "accent-blue",
      "accent-green",
      "accent-black",
    );
    document.documentElement.classList.add(`accent-${color}`);
    localStorage.setItem("@business-game:accent", color);
  };

  useEffect(() => {
    const savedAccent = localStorage.getItem("@business-game:accent");
    if (
      savedAccent !== "red" &&
      savedAccent !== "blue" &&
      savedAccent !== "green" &&
      savedAccent !== "black"
    ) {
      document.documentElement.classList.add("accent-red");
      localStorage.setItem("@business-game:accent", "red");
      setAccentSelected("red");
    } else {
      document.documentElement.classList.add(`accent-${savedAccent}`);
      setAccentSelected(savedAccent as "red" | "blue" | "green" | "black");
    }
  }, []);

  // Close modal on Esc
  useEffect(() => {
    if (!isSettingsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSettingsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSettingsOpen]);

  return (
    <aside
      aria-hidden={isSettingsOpen ? true : undefined}
      className={[
        "flex h-screen shrink-0 flex-col",
        "border-r border-border/60 bg-background/95",
        "backdrop-blur supports-[backdrop-filter]:bg-background/80",
        "transition-[width] duration-300 ease-in-out",
        "relative z-10",
        collapsed ? "w-20" : "w-64",
      ].join(" ")}
    >
      {/* Header */}
      {collapsed ? (
        <div className="flex items-center justify-center px-3 py-4">
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label="Expand sidebar"
            title="Expand"
            className={[
              "inline-flex h-10 w-10 items-center justify-center rounded-lg",
              "border border-border bg-background text-tertiary",
              "hover:text-primary hover:border-primary",
              "transition focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-primary/40",
            ].join(" ")}
          >
            <ChevronLeft className="h-5 w-5 rotate-180" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-4">
          <div className="flex-1 truncate text-left">
            <h1 className="font-bold text-xl text-primary">Business Game</h1>
          </div>
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label="Collapse sidebar"
            title="Collapse"
            className={[
              "ml-auto inline-flex h-10 w-10 items-center justify-center",
              "rounded-lg border border-border bg-background",
              "text-tertiary hover:text-primary hover:border-primary",
              "transition focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-primary/40",
            ].join(" ")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="mx-3 mb-3 border-b border-border/60" />

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-2 px-3">
        <SidebarLink
          icon={<House />}
          name="Home"
          link="/"
          collapsed={collapsed}
        />
        <SidebarLink
          icon={<Building2 />}
          name="Businesses"
          link="/businesses"
          collapsed={collapsed}
        />
        <SidebarLink
          icon={<ChartColumnIncreasing />}
          name="Investments"
          link="/investments"
          collapsed={collapsed}
          disabled
        />
        <SidebarLink
          icon={<Package />}
          name="Items"
          link="/items"
          collapsed={collapsed}
          disabled
        />
        <SidebarLink
          icon={<UserCircle2 />}
          name="Profile"
          link="/profile"
          collapsed={collapsed}
          disabled
        />
      </nav>

      <div className="mt-auto px-3 pb-3">
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          aria-label={collapsed ? "Settings" : undefined}
          title={collapsed ? "Settings" : undefined}
          className={[
            "group relative flex w-full items-center gap-3 rounded-xl",
            collapsed ? "justify-center px-2 py-2" : "px-3 py-2",
            "transition focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-primary/40",
            "border border-transparent text-secondary",
            "hover:border-border hover:bg-background/60",
          ].join(" ")}
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg
                       border border-border bg-background text-tertiary
                       group-hover:text-primary"
          >
            <Settings className="h-5 w-5" aria-hidden />
          </span>
          <span
            className={
              collapsed ? "sr-only" : "flex-1 text-left truncate font-medium"
            }
          >
            Settings
          </span>
        </button>
      </div>

      { isSettingsOpen && (
        <Portal>
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center
                       bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsSettingsOpen(false);
            }}
          >
            <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-background shadow-lg">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-6">
                <div>
                  <h2
                    id="settings-title"
                    className="text-2xl font-bold text-secondary"
                  >
                    Settings
                  </h2>
                  <p className="text-sm text-tertiary">
                    Customize your experience
                  </p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-background
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  aria-label="Close settings"
                >
                  <X className="h-6 w-6 text-tertiary" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6 p-6">
                {/* Theme */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    className="relative cursor-pointer"
                    onClick={() => setTheme("light")}
                  >
                    <div className="rounded-xl border-2 border-border p-3 transition hover:border-primary hover:bg-background/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4 text-tertiary" />
                          <span className="font-medium text-secondary">
                            Light
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 rounded-lg border border-border bg-white p-3">
                        <div className="mb-2 h-2 w-1/3 rounded bg-gray-200" />
                        <div className="mb-1 h-2 w-2/3 rounded bg-gray-200" />
                        <div className="h-2 w-1/2 rounded bg-gray-200" />
                      </div>
                    </div>
                  </button>
                  <button
                    className="relative cursor-not-allowed group"
                    onClick={() => setTheme("dark")}
                    disabled
                  >
                    {/* Tooltip */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-secondary text-light text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Coming soon...
                    </span>

                    <div className="rounded-xl border-2 border-border p-3 opacity-70">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4 text-tertiary" />
                          <span className="font-medium text-secondary">
                            Dark
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                        <div className="mb-2 h-2 w-1/3 rounded bg-zinc-700" />
                        <div className="mb-1 h-2 w-2/3 rounded bg-zinc-700" />
                        <div className="h-2 w-1/2 rounded bg-zinc-700" />
                      </div>
                    </div>
                  </button>
                </div>

                {/* Accent Color - Palette Cards */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-secondary">
                    Accent Color
                  </h3>

                  <div
                    role="radiogroup"
                    aria-label="Accent Color"
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                  >
                    {ACCENTS.map((opt) => {
                      const checked = accentSelected === opt.key;
                      return (
                        <label
                          key={opt.key}
                          className="group relative block cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="accent"
                            value={opt.key}
                            checked={checked}
                            onChange={() => {
                              setAccent(opt.key);
                              setAccentSelected(
                                opt.key as "red" | "blue" | "green" | "black",
                              );
                            }}
                            className="peer sr-only"
                            aria-label={opt.name}
                          />
                          <div className="rounded-xl border-2 border-border p-3 transition hover:border-primary hover:bg-background/50 peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/40">
                            <div
                              className="h-14 w-full rounded-lg"
                              style={{ background: opt.gradient }}
                            />
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className="inline-block h-4 w-4 rounded-full border"
                                  style={{
                                    backgroundColor: opt.hex,
                                    borderColor: "rgba(0,0,0,0.15)",
                                  }}
                                />
                                <span className="font-medium text-secondary">
                                  {opt.name}
                                </span>
                              </div>
                              <Check
                                className={`h-4 w-4 text-tertiary transition-opacity ${
                                  checked ? "opacity-100" : "opacity-0"
                                }`}
                              />
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <span
                                className="rounded-md px-2 py-1 text-xs font-medium shadow"
                                style={{
                                  backgroundColor: opt.hex,
                                  color: "#fff",
                                }}
                              >
                                Button
                              </span>
                              <span
                                className="text-xs font-medium"
                                style={{ color: opt.hex }}
                              >
                                Link
                              </span>
                              <span className="ml-auto flex items-center gap-1">
                                <span className="text-[10px] text-tertiary">
                                  UI
                                </span>
                                <span
                                  className="relative inline-flex h-4 w-7 items-center rounded-full"
                                  style={{
                                    backgroundColor: opt.hex + "22",
                                    boxShadow:
                                      "inset 0 0 0 1px rgba(0,0,0,0.08)",
                                  }}
                                >
                                  <span
                                    className="inline-block h-3.5 w-3.5 translate-x-0.5 rounded-full transition"
                                    style={{ backgroundColor: opt.hex }}
                                  />
                                </span>
                              </span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </aside>
  );
}
