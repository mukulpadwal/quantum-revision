"use client";

import { useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import Image from "next/image";

const mobileMenuItems = [
  {
    key: 1,
    title: "About",
    href: "/about",
  },
  {
    key: 2,
    title: "Contact",
    href: "/contact",
  },
  {
    key: 3,
    title: "Login",
    href: "/login",
  },
  {
    key: 4,
    title: "Sign Up",
    href: "/signup",
  },
];

const menuItems = [
  {
    key: 1,
    title: "About",
    href: "/about",
  },
  {
    key: 2,
    title: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const [isMobileMenuClicked, setIsMobileMenuClicked] = useState(false);
  return (
    <header>
      <nav className="md:border md:border-x-0 md:border-t-0 relative top-0 w-full h-full p-4 flex justify-between items-center">
        <div className="flex order-2 md:order-1">
          <Link href={"/"}>
            <Image
              src={"/images/three.jpeg"}
              height={50}
              width={50}
              alt="Quantum Revision Logo"
              className="rounded-full border p-1"
            />
          </Link>
        </div>
        <div className="hidden md:flex md:justify-center md:items-center md:gap-x-4  md:order-2">
          {menuItems?.map((item) => (
            <Link href={item.href} key={item.key}>
              {item.title}
            </Link>
          ))}
        </div>
        <div className="order-3 flex flex-row justify-center items-center gap-x-4">
          <Link
            href={"/login"}
            className={`hidden md:inline-block ${buttonVariants({
              variant: "link",
            })}`}
          >
            Login
          </Link>
          <Link
            href={"/signup"}
            className={`hidden md:inline-block ${buttonVariants({
              variant: "default",
            })}`}
          >
            SignUp
          </Link>

          <ThemeSwitcher />
        </div>
        <div className="h-full inline-block order-1 md:hidden">
          <div>
            {!isMobileMenuClicked ? (
              <Button
                onClick={() => setIsMobileMenuClicked((prev) => !prev)}
                variant="outline"
                size="icon"
              >
                <GiHamburgerMenu className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => setIsMobileMenuClicked((prev) => !prev)}
                variant="outline"
                size="icon"
              >
                <IoCloseSharp className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isMobileMenuClicked && (
            <div className="absolute my-2 rounded-md  w-11/12 h-fit bg-white border shadow-lg dark:bg-black z-10">
              {mobileMenuItems?.map((item) => (
                <Link
                  href={item.href}
                  className="block w-auto relative m-4"
                  key={item.key}
                  onClick={() => setIsMobileMenuClicked((prev) => !prev)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
