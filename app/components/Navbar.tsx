// Remove unused imports
import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="relative">
      <div className="bg-[#C1FF9B] rounded-full mx-4 mt-4 px-8 py-4 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-2xl font-black">WEB POTENSI</div>
          <div className="flex gap-12 text-xl font-bold">
            <Link href="/Map" className="hover:opacity-70">
              Map
            </Link>
            <a href="#data" className="hover:opacity-70">
              Data
            </a>
            <a href="#about" className="hover:opacity-70">
              About
            </a>
<Link href="/About" className="hover:opacity-70">
              About
            </Link>          </div>
        </div>
      </div>
    </nav>
  );
}
