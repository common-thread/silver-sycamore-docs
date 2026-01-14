"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="text-sm text-[#586069] mb-4">
      <Link href="/" className="hover:underline">
        Home
      </Link>
      {segments.map((seg, i) => (
        <span key={i}>
          {" / "}
          <Link
            href={"/" + segments.slice(0, i + 1).join("/")}
            className="hover:underline capitalize"
          >
            {seg.replace(/-/g, " ")}
          </Link>
        </span>
      ))}
    </nav>
  );
}
