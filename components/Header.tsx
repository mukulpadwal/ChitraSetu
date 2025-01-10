"use client";

import { signOut, useSession } from "next-auth/react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { LogIn, LogOut, Menu, SquareArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="p-4 border-b border-gray-200 bg-white">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div>
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              {/* Avatar and Dropdown for Desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      src={session.user.image?.toString()}
                      alt={session.user.email}
                    />
                    <AvatarFallback>
                      {session.user?.email
                        ?.slice(0, 1)
                        .toString()
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/orders")}>
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Logout Button */}
              <Button
                variant="link"
                onClick={() => signOut({ redirect: true, redirectTo: "/" })}
                className="flex items-center gap-1"
              >
                <LogOut /> Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="link"
                onClick={() => router.push("/login")}
                className="flex items-center gap-1"
              >
                <LogIn /> Login
              </Button>
              <Button
                variant="default"
                onClick={() => router.push("/signup")}
                className="flex items-center gap-1"
              >
                <SquareArrowRight /> Signup
              </Button>
            </div>
          )}
        </div>

        {/* Hamburger Menu Icon (Mobile) */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-800"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-white shadow-md border-t border-gray-200 flex flex-col gap-4 p-4">
            {session ? (
              <div className="flex flex-col gap-2">
                {/* Simple Links for Admin, Orders, Profile on Mobile */}
                <Button
                  variant="link"
                  onClick={() => router.push("/admin")}
                  className="flex items-center gap-1"
                >
                  Admin
                </Button>
                <Button
                  variant="link"
                  onClick={() => router.push("/orders")}
                  className="flex items-center gap-1"
                >
                  Orders
                </Button>
                <Button
                  variant="link"
                  onClick={() => router.push("/profile")}
                  className="flex items-center gap-1"
                >
                  Profile
                </Button>

                {/* Logout Button */}
                <Button
                  variant="link"
                  onClick={() => signOut({ redirect: true, redirectTo: "/" })}
                  className="flex items-center gap-1"
                >
                  <LogOut /> Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  variant="link"
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-1"
                >
                  <LogIn /> Login
                </Button>
                <Button
                  variant="default"
                  onClick={() => router.push("/signup")}
                  className="flex items-center gap-1"
                >
                  <SquareArrowRight /> Signup
                </Button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
