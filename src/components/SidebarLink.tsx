import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLinkProps {
    icon: React.ReactElement;
    name: string;
    link: string;
    exact?: boolean;
    collapsed?: boolean;
    disabled?: boolean;
}

function cn(...classes: Array<string | false | undefined | null>) {
    return classes.filter(Boolean).join(" ");
}

export default function SidebarLink({
    icon,
    name,
    link,
    exact = false,
    collapsed = false,
    disabled = false
}: SidebarLinkProps) {
    const pathname = usePathname();

    const isActive = exact
        ? pathname === link
        : link === "/"
        ? pathname === "/"
        : pathname.startsWith(link);

    if (disabled) {
        return (
            <div
                className="relative group flex items-center gap-3 rounded-xl px-3 py-2 cursor-not-allowed opacity-70"
                title="Coming soon..."
            >
                {/* Tooltip */}
                <span className="absolute left-9/12 -translate-x-1/2 whitespace-nowrap rounded-md bg-secondary text-light text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Coming soon...
                </span>

                <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-tertiary"
                >
                    {icon}
                </span>
                { !collapsed && (
                    <span className="flex-1 text-left truncate font-medium text-secondary">
                        {name}
                    </span>
                )}
            </div>
        );
    }

    return (
        <Link
            href={link}
            aria-current={isActive ? "page" : undefined}
            aria-label={collapsed ? name : undefined}
            title={collapsed ? name : undefined}
            className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl",
                collapsed ? "justify-center px-2 py-2" : "px-3 py-2",
                "transition focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-primary/40",
                isActive
                ? "border border-primary/30 bg-primary/10 text-primary shadow-sm"
                : "border border-transparent text-secondary hover:border-border hover:bg-background/60"
            )}
        >
            {/* Left accent bar */}
            <span
                aria-hidden
                className={cn(
                    "pointer-events-none absolute left-0 top-1/2 -translate-y-1/2",
                    "h-6 rounded-full bg-primary transition-all",
                    isActive
                        ? "w-1 opacity-100"
                        : "w-0 opacity-0 group-hover:w-1 group-hover:opacity-100"
                )}
            />

            {/* Icon pill */}
            <span
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    "border transition-colors",
                    isActive
                        ? "border-primary bg-primary text-light"
                        : "border-border bg-background text-tertiary group-hover:text-primary"
                )}
            >
                {icon}
            </span>

            {/* Label */}
            <span
                className={cn(
                    "flex-1 truncate font-medium",
                    collapsed
                        ? "sr-only"
                        : isActive
                        ? "text-primary"
                        : "group-hover:text-primary"
                )}
            >
                {name}
            </span>
        </Link>
    );
}