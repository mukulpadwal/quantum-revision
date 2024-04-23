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
import { useSession } from "next-auth/react";
import { Switch } from "@/components/ui/switch";

interface Note {
  title: string;
  createdAt: Date | undefined;
}

interface RevisionData {
  _id?: string;
  title?: string;
  entryDate?: Date | undefined;
  firstDate?: Date | undefined;
  secondDate?: Date | undefined;
  thirdDate?: Date | undefined;
  notification?: boolean;
}

export default function HomePage() {
  const { data: session } = useSession();

  const [noteData, setNoteData] = useState<Note>({
    title: "",
    createdAt: undefined,
  });

  const [revisionData, setRevisionData] = useState<Array<RevisionData>>([
    {
      _id: "",
      title: "",
      entryDate: undefined,
      firstDate: undefined,
      secondDate: undefined,
      thirdDate: undefined,
      notification: false,
    },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/api/notes/all");

        if (response.data.success) {
          setRevisionData(response.data.data.user_notes);
          console.log(response.data.message);
        } else {
          console.log(response.data.message);
        }
      } catch (error: any) {
        console.error(`Error while fetching notes : ERROR : ${error}`);
      }
    })();
  }, [noteData]);

  const handleSaveRevision = async () => {
    try {
      if (
        noteData.title.trim().length > 0 &&
        noteData.createdAt !== undefined
      ) {
        const response = await axios.post("/api/notes/create", noteData);

        if (response.data.success) {
          toast.success(response.data.message);
          setTimeout(() => {
            window.location.reload();
          }, 500);
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

  const handleDeleteEntry = async (noteId: string | undefined) => {
    try {
      const response = await axios.delete("/api/notes/delete", {
        data: JSON.stringify({ noteId }),
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.log(`Some error occured while deleting entry.`);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col justify-normal items-center gap-y-4">
      <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-y-4 md:gap-y-0 p-2 sm:my-4">
        <h1 className="text-center sm:text-left text-3xl">
          Welcome <strong>{session?.user?.username}</strong>
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
      <div className="w-full flex justify-center items-center p-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex flex-row justify-center items-center gap-x-2"
            >
              <MdNoteAdd className="h-4 w-4" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[400px] sm:max-w-[425px]">
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
                  Topic
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
                        !noteData.createdAt && "text-muted-foreground"
                      )}
                    >
                      <SlCalender className="mr-2 h-4 w-4" />
                      {noteData.createdAt ? (
                        format(noteData.createdAt, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={noteData.createdAt}
                      onSelect={(e) =>
                        setNoteData({ ...noteData, createdAt: e })
                      }
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
              <TableHead>Topic</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>1st Revision Date</TableHead>
              <TableHead>2nd Revision Date</TableHead>
              <TableHead>3rd Revision Date</TableHead>
              <TableHead>Notification</TableHead>
              <TableHead>Delete Entry</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {revisionData.map((data) => (
              <TableRow key={data._id}>
                <TableCell>{data.title}</TableCell>
                <TableCell>
                  {new Date(data?.entryDate!).toDateString()}
                </TableCell>
                <TableCell>
                  {new Date(data?.firstDate!).toDateString()}
                </TableCell>
                <TableCell>
                  {new Date(data?.secondDate!).toDateString()}
                </TableCell>
                <TableCell>
                  {new Date(data?.thirdDate!).toDateString()}
                </TableCell>
                <TableCell>
                  <Switch
                    id={data._id}
                    checked={data.notification}
                    onCheckedChange={(e) => {
                      console.log(e);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteEntry(data._id)}>
                    Delete
                  </Button>
                </TableCell>
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
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
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
