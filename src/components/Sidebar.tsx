"use client"
import { Building2, ChartColumnIncreasing, House, Package, Settings, UserCircle2, X } from "lucide-react";
import SidebarLink from "./SidebarLink";
import { useEffect, useState } from "react";

export default function Sidebar() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const setTheme = (theme: string) => {
        if (theme === "light") {
            // Adds the new theme
            document.documentElement.classList.remove('dark');

            // Saves in localStorage
            localStorage.setItem("@business-game:theme", "light");
        }
        else {
            // Adds the new theme
            document.documentElement.classList.add('dark');

            // Saves in localStorage
            localStorage.setItem("@business-game:theme", "dark");
        }
    };

    // Apllies the localStorage's saved theme
    useEffect(() => {
        const savedTheme = localStorage.getItem("@business-game:theme") || "light";

        if(savedTheme === "light") {
            document.documentElement.classList.remove("dark");
        }
        else {
            document.documentElement.classList.add("dark");
        }
    }, []);
    
    const setAccent = (color: string) => {
        // Remove previous accents
        document.documentElement.classList.remove("accent-red", "accent-blue", "accent-green", "accent-black");

        // Adds the new accent
        document.documentElement.classList.add(`accent-${color}`);

        // Saves in localStorage
        localStorage.setItem("@business-game:accent", color);
    };

    // Apllies the localStorage's saved accent
    useEffect(() => {
        const savedAccent = localStorage.getItem("@business-game:accent");

        if(savedAccent !== "red" && savedAccent !== "blue" && savedAccent !== "green" && savedAccent !== "black") {
             document.documentElement.classList.add(`accent-red`);
        }
        else {
            document.documentElement.classList.add(`accent-${savedAccent}`);
        }
    }, []);

    return (
        <aside className="flex flex-col items-center min-w-64 bg-background h-screen px-3 shadow-[6px_0_20px_-2px_rgba(0,0,0,0.2)] relative z-10">
            <h1 className="text-center py-6 font-bold text-2xl text-primary">Business Game</h1>

            <hr className="w-9/10 h-[2px] border-0 bg-primary" />

            <nav className="flex flex-1 flex-col gap-4 py-6 w-full">
                <SidebarLink icon={<House />} name="House" link="/" />
                <SidebarLink icon={<Building2 />} name="Businesses" link="/businesses" />
                <SidebarLink icon={<ChartColumnIncreasing />} name="Investments" link="/investments" />
                <SidebarLink icon={<Package />} name="Items" link="/items" />
                <SidebarLink icon={<UserCircle2 />} name="Profile" link="/profile" />
            </nav>

            {/* Settings Button */}
            <button
                onClick={() => setIsSettingsOpen(true)}
                className="mb-6 flex items-center gap-2 w-full px-4 py-3 rounded-lg font-semibold transition-colors bg-primary hover:bg-primary-variation text-light cursor-pointer"
            >
                <Settings className="w-5 h-5" />
                Settings
            </button>

            { isSettingsOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-background rounded-2xl max-w-lg w-full overflow-hidden shadow-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <div>
                            <h2 className="text-2xl font-bold text-secondary">Settings</h2>
                            <p className="text-tertiary text-sm">Customize your experience</p>
                        </div>
                        <button
                            onClick={() => setIsSettingsOpen(false)}
                            className="cursor-pointer p-2 hover:bg-background rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-tertiary" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Tema */}
                        <div>
                            <h3 className="text-lg font-semibold text-secondary mb-3">Theme</h3>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={`px-4 py-2 rounded-lg font-medium border`}
                                >
                                    Light
                                </button>
                                <button
                                    onClick={() => setTheme("dark")}
                                    className={`px-4 py-2 rounded-lg font-medium border`}
                                >
                                    Dark
                                </button>
                            </div>
                        </div>

                        {/* Accent Color */}
                        <div>
                            <h3 className="text-lg font-semibold text-secondary mb-3">Accent Color</h3>
                            <div className="flex gap-3">
                                {["red", "blue", "green", "black"].map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setAccent(color)}
                                    className={`w-9 h-9 rounded-full border-2 transition`}
                                    style={{ backgroundColor: color }}
                                />
                                ))}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            )}
        </aside>
    );
}