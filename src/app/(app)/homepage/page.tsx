"use client";

import { useSession } from "next-auth/react";
import AddRevisionEntry from "@/components/AddRevisionEntry";
import ScheduleTable from "@/components/ScheduleTable";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="relative w-full h-screen flex flex-col justify-normal items-center gap-y-4">
      <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-y-4 md:gap-y-0 p-2 sm:my-4">
        <h1 className="text-center sm:text-left text-3xl">
          Welcome <strong>{session?.user?.username}</strong>
        </h1>
        <SearchBar />
      </div>
      <div className="w-full flex justify-center items-center p-2">
        <AddRevisionEntry />
      </div>
      <div className="w-full">
        <ScheduleTable />
      </div>
      <div className="absolute bottom-0 w-full my-2">
        Pagination to be added
      </div>
    </div>
  );
}