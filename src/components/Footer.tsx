import React from "react";

export default function Footer() {
  return (
    <footer className="border border-x-0 border-b-0 relative bottom-0 w-full p-4 flex justify-between items-center">
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-full flex flex-col justify-center items-center md:flex-row md:justify-between my-2 gap-y-2 md:gap-0">
          <div>SOCIAL ICONS</div>
          <div>LINKS</div>
        </div>
        <div className="flex items-center justify-center text-sm">
          &copy; {new Date().getFullYear()} QuantumRevision. All Rights
          Reserved.
        </div>
      </div>
    </footer>
  );
}
