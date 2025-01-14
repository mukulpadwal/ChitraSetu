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
    <div className="w-full md:min-h-screen grid grid-cols-1 md:grid-cols-12">
      {/* Sidebar */}
      <aside className="h-auto w-full md:col-span-4 lg:col-span-2 bg-gray-100 p-4 md:border-r">
        <ul className="flex flex-row flex-wrap justify-around md:justify-normal md:flex-col md:space-y-4">
          {sidebarMenuItems.map((item) => (
            <li key={item.id}>
              <Link href={item.href}>
                <Button
                  variant={`${
                    pathname === item.href ? "outline" : "link"
                  }`}
                  className="w-full flex flex-row justify-start items-center"
                >
                  {item.icon}
                  <span
                    className={`${
                      pathname !== item.href && "hidden"
                    } md:block`}
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
      <main className="md:col-span-8 lg:col-span-10 p-4">
        <h1 className="text-center text-3xl font-bold my-4">
          Profile Section
        </h1>
        {children}
      </main>
    </div>
  );
}

export default ProfileLayout;
