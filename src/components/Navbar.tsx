"use client";

import { useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const { data: session } = useSession();

  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuClicked, setIsMobileMenuClicked] =
    useState<boolean>(false);

  const handleUserLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      toast.success("Successfully logged out...");
    } catch (error: any) {
      console.error(
        `Error while logging out the user : ERROR : ${error.message}`
      );
    } finally {
      setIsMobileMenuClicked((prev) => !prev);
    }
  };

  return (
    <header>
      <nav className="md:border md:border-x-0 md:border-t-0 relative top-0 w-full h-full p-4 flex justify-between items-center">
        <div className="hidden md:flex md:justify-center md:items-center md:gap-x-6  md:order-1">
          {session ? (
            <Link
              href={"/"}
              className={`${
                pathname === "/homepage"
                  ? "active underline underline-offset-4"
                  : "no-underline"
              }`}
            >
              Home
            </Link>
          ) : (
            <Link
              href={"/"}
              className={`${
                pathname === "/"
                  ? "active underline underline-offset-4"
                  : "no-underline"
              }`}
            >
              Home
            </Link>
          )}

          <Link
            href={"/about"}
            className={`${
              pathname === "/about" ? "active underline underline-offset-4" : ""
            }`}
          >
            About
          </Link>
          <Link
            href={"/how-to-use"}
            className={`${
              pathname === "/how-to-use"
                ? "active underline underline-offset-4"
                : ""
            }`}
          >
            How to Use
          </Link>
          <Link
            href={"/contact"}
            className={`${
              pathname === "/contact"
                ? "active underline underline-offset-4"
                : ""
            }`}
          >
            Contact
          </Link>
        </div>

        <div className="flex order-2">
          <Link href={"/"}>
            <Image
              src={"/logo.jpeg"}
              height={50}
              width={50}
              alt="Quantum Revision Logo"
              className="rounded-full border p-1"
            />
          </Link>
        </div>

        <div className="order-3 flex flex-row justify-center items-center gap-x-4">
          {session ? (
            <>
              <Avatar
                className="cursor-pointer"
                onClick={() => router.replace("/myaccount/profile")}
              >
                <AvatarImage src={session.user.image} alt="User Avatar" />
                <AvatarFallback>
                  {String(session?.user?.username).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                onClick={handleUserLogout}
                className={`hidden md:inline-block`}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}

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
              <Link
                href={"/"}
                className="block w-auto relative m-4"
                onClick={() => setIsMobileMenuClicked((prev) => !prev)}
              >
                Home
              </Link>
              <Link
                href={"/about"}
                className="block w-auto relative m-4"
                onClick={() => setIsMobileMenuClicked((prev) => !prev)}
              >
                About
              </Link>
              <Link
                href={"/how-to-use"}
                className="block w-auto relative m-4"
                onClick={() => setIsMobileMenuClicked((prev) => !prev)}
              >
                How to Use
              </Link>
              <Link
                href={"/contact"}
                className="block w-auto relative m-4"
                onClick={() => setIsMobileMenuClicked((prev) => !prev)}
              >
                Contact
              </Link>
              {session ? (
                <Button
                  onClick={handleUserLogout}
                  className="block w-auto relative m-4"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Link
                    href={"/login"}
                    className="block w-auto relative m-4"
                    onClick={() => setIsMobileMenuClicked((prev) => !prev)}
                  >
                    Login
                  </Link>
                  <Link
                    href={"/signup"}
                    className="block w-full relative m-4"
                    onClick={() => setIsMobileMenuClicked((prev) => !prev)}
                  >
                    SignUp
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
