// app/components/Navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();

  const navigationItems = [
    { name: "Dates", path: "/dates" },
    { name: "Cartographic", path: "/cartographic" },
    { name: "Facet", path: "/facet" },
  ];

  return (
    <nav className="w-64 bg-gray-900 border-r border-gray-700/50 p-4">
      <div className="space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-gray-800 text-emerald-400 border border-emerald-500/20"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-emerald-300"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
