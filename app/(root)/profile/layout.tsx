"use client";

import { Button } from "@/components/ui/button";
import { BookLock, DeleteIcon, Pencil } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarMenuItems = [
  {
    id: 1,
    label: "Update Information",
    href: "/profile",
    icon: <Pencil />,
  },
  {
    id: 2,
    label: "Change Password",
    href: "/profile/change-password",
    icon: <BookLock />,
  },
  {
    id: 3,
    label: "Delete Account",
    href: "/profile/delete",
    icon: <DeleteIcon />,
  },
];

function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full md:min-h-screen grid grid-cols-1 md:grid-cols-12 gap-4 bg-gradient-to-r from-gray-100 to-white">
      {/* Sidebar */}
      <aside className="h-auto w-full md:col-span-4 lg:col-span-2 p-6 md:border-r bg-white shadow-lg rounded-lg">
        <ul className="flex flex-row flex-wrap justify-around md:justify-normal md:flex-col md:space-y-4">
          {sidebarMenuItems.map((item) => (
            <li key={item.id}>
              <Link href={item.href}>
                <Button
                  variant={`${pathname === item.href ? "outline" : "link"}`}
                  className="w-full flex flex-row justify-start items-center gap-2 p-3 text-sm font-semibold rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-300"
                >
                  {item.icon}
                  <span
                    className={`${pathname !== item.href && "hidden"} md:block`}
                  >
                    {item.label}
                  </span>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="md:col-span-8 lg:col-span-10 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-center text-3xl font-bold my-4 text-gray-800">
          Profile Section
        </h1>
        {children}
      </main>
    </div>
  );
}

export default ProfileLayout;
