"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "./ui/button";

interface SidebarButtonProps {
  children: React.ReactNode;
  href: string; // string normal
}

const SidebarButton = ({ children, href }: SidebarButtonProps) => {
  const pathName = usePathname();

  return (
    <Button
      variant={pathName === href ? "secondary" : "ghost"}
      className="justify-start gap-2"
      asChild
    >
      <Link href={href as any}>{children}</Link>
    </Button>
  );
};

export default SidebarButton;
