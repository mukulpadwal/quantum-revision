"use client";

import React from "react";
import { IoIosSearch } from "react-icons/io";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  handleSearchQuery: (e: any) => void;
}

const SearchBar = ({ searchQuery, handleSearchQuery }: SearchBarProps) => {
  return (
    <div className="w-full relative sm:ml-auto flex-1 md:grow-0">
      <IoIosSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => handleSearchQuery(e)}
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      />
    </div>
  );
};

export default SearchBar;
