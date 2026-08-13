"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, TreePine } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems);

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/products", label: "المنتجات" },
    { href: "/custom-order", label: "طلب مخصص" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  return (
    <nav className="bg-[#3d2b1f] text-[#f5e6d3] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <TreePine className="w-7 h-7 text-[#c4a574]" />
            <span>
              Arlo <span className="text-[#c4a574]">Wood</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-[#c4a574] transition-colors ${
                  pathname === link.href ? "text-[#c4a574] font-semibold" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Cart + Mobile menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 hover:bg-[#5a4030] rounded-full transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c4a574] text-[#3d2b1f] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#4a3528] border-t border-[#5a4030]">
          <div className="px-4 py-3 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block py-2 px-3 rounded-lg ${
                  pathname === link.href
                    ? "bg-[#5a4030] text-[#c4a574]"
                    : "hover:bg-[#5a4030]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
