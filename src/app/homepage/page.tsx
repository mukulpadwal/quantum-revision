"use client";

import { IoIosSearch } from "react-icons/io";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SlCalender } from "react-icons/sl";
import { MdNoteAdd } from "react-icons/md";
import toast from "react-hot-toast";
import { title } from "process";

const notes = [
  {
    title: "INV001",
    firstDate: "Paid",
    secondDate: "$250.00",
    thirdDate: "Credit Card",
  },
];

interface User {
  username?: string;
}

interface Note {
  title: string;
  date: Date | undefined;
}

interface RevisionData {
  title: string;
  firstDate: string;
  secondDate: string;
  thirdDate: string;
}

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User>({
    username: "",
  });
  const [noteData, setNoteData] = useState<Note>({
    title: "",
    date: new Date(),
  });
  const [revisionData, setRevisionData] = useState<Array<RevisionData>>([
    {
      title: "",
      firstDate: "",
      secondDate: "",
      thirdDate: "",
    },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/api/users/me");

        if (response.data.success) {
          setCurrentUser({ ...response.data.data });
        } else {
        }
      } catch (error: any) {}
    })();
  }, []);

  const handleSaveRevision = async () => {
    try {
      if (noteData.title.trim().length > 0 && noteData.date !== undefined) {
        const response = await axios.post("", noteData);

        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.error("Please provide all the fields.");
      }
    } catch (error: any) {
      console.log(`Some error occured while creating entry.`);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col justify-normal items-center gap-y-4">
      <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-y-4 md:gap-y-0 p-2">
        <h1 className="text-center sm:text-left text-3xl">
          Welcome <strong>{currentUser.username}</strong>
        </h1>
        <div className="w-full relative sm:ml-auto flex-1 md:grow-0">
          <IoIosSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex flex-row justify-center items-center gap-x-2"
            >
              <MdNoteAdd className="h-4 w-4" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Revision Entry</DialogTitle>
              <DialogDescription>
                Add the title for your note and select the date. Click save when
                you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={noteData.title}
                  onChange={(e) =>
                    setNoteData({ ...noteData, title: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !noteData.date && "text-muted-foreground"
                      )}
                    >
                      <SlCalender className="mr-2 h-4 w-4" />
                      {noteData.date ? (
                        format(noteData.date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={noteData.date}
                      onSelect={(e) => setNoteData({ ...noteData, date: e })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSaveRevision}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>1st Revision Date</TableHead>
              <TableHead>2nd Revision Date</TableHead>
              <TableHead>3rd Revision Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {revisionData.map((data, index) => (
              <TableRow key={`${index}-${data.title}`}>
                <TableCell>{data.title}</TableCell>
                <TableCell>{data.firstDate}</TableCell>
                <TableCell>{data.secondDate}</TableCell>
                <TableCell>{data.thirdDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="absolute bottom-0 w-full my-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
