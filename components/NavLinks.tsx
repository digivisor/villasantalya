'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/emlaklistesi", label: "Emlak Listesi" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
];

export default function NavLinks({ isMobile = false, onLinkClick }: { isMobile?: boolean, onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <ul className={`flex ${isMobile ? "flex-col space-y-2" : "space-x-6"}`}>
      {links.map(link => (
        <li key={link.href}>
          <Link 
            href={link.href}
            onClick={onLinkClick}
            className={`transition-colors hover:text-orange-500 ${pathname === link.href ? "text-orange-500 font-semibold" : "text-gray-200"}`}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}