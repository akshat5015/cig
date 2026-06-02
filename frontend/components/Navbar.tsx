"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/events", label: "Events" },
  { href: "/search", label: "Search" },
  { href: "/find-photos", label: "Find Me" },
  { href: "/favorites", label: "Favorites" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const hideNav = pathname === "/" || pathname === "/login" || pathname === "/signup";

  if (hideNav) return null;

  return (
    <header className="sticky top-0 z-50 px-4 py-3">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3">
        <Link href="/events" className="text-lg font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-[#7c9cff] to-[#5eead4] bg-clip-text text-transparent">
            EventSphere
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                pathname.startsWith(link.href)
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {!loading && user ? (
            <>
              <span className="hidden text-sm text-white/50 sm:inline">
                {user.username}
              </span>
              <button type="button" onClick={logout} className="btn-ghost rounded-lg px-3 py-1.5 text-sm">
                Log out
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary rounded-lg px-4 py-1.5 text-sm">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
