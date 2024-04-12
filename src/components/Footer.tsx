import Link from "next/link";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="border border-x-0 border-b-0 relative bottom-0 w-full p-4 flex justify-between items-center">
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-full flex flex-col justify-center items-center md:flex-row md:justify-between my-2 gap-y-2 md:gap-0">
          <div className="flex justify-center items-center gap-x-4">
            <div className="text-sm sm:text-base">Connect with Developer </div>
            <div>
              <Link href={"https://github.com/mukulpadwal"} target="_blank">
                <FaGithub className="w-5 h-5" />
              </Link>
            </div>
            <div>
              <Link
                href={"https://www.linkedin.com/in/mukulpadwal"}
                target="_blank"
              >
                <FaLinkedin className="w-5 h-5" />
              </Link>
            </div>
            <div>
              <Link href={"https://twitter.com/padwalmukul"} target="_blank">
                <FaXTwitter className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="flex justify-center items-center gap-x-4">
            <div>
              <Link href={"/faqs"}>FAQs</Link>
            </div>
            <div>
              <Link href={"/privacypolicy"}>Privacy Policy</Link>
            </div>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-center text-sm text-center">
          &copy; {new Date().getFullYear()} QuantumRevision. All Rights
          Reserved.
        </div>
      </div>
    </footer>
  );
}
