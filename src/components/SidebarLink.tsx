import Link from "next/link";

interface SidebarLinkProps {
    icon: React.ReactElement;
    name: string;
    link: string;
}

export default function SidebarLink({ icon, name, link }: SidebarLinkProps) {
    return (
        <Link href={link} className="flex gap-2 border-primary text-primary border-2 px-2 py-2 rounded-md hover:bg-primary hover:text-background font-semibold">
            {icon}
            {name}
        </Link>
    );
}