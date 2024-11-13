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
    <nav className="w-64 bg-black border-r border-gray-200 p-4">
      <div className="space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-3 py-2 rounded-md text-sm font-bold text-white ${
                isActive
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
