"use client";

import { useSession } from "next-auth/react";
import SearchBar from "@/components/SearchBar";
import { BadgeCheck } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RevisionData from "@/types/RevisionData";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdNoteAdd } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { SlCalender } from "react-icons/sl";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Note from "@/types/Note";

export default function HomePage() {
  const { data: session } = useSession();

  const [noteData, setNoteData] = useState<Note>({
    title: "",
    entryDate: undefined,
  });
  const [revisionData, setRevisionData] = useState<Array<RevisionData>>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDeletingId, setIsDeletingId] = useState<string>("");

  const fetchNoteData = async () => {
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
  };

  const handleSaveRevision = async () => {
    try {
      if (
        noteData.title.trim().length > 0 &&
        noteData.entryDate !== undefined
      ) {
        const response = await axios.post("/api/notes/create", noteData);

        if (response.data.success) {
          await fetchNoteData();
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

  const handleDeleteEntry = async (noteId: string) => {
    setIsDeletingId(noteId);
    setIsDeleting(true);

    try {
      const response = await axios.delete(`/api/notes/delete/${noteId}`);

      if (response.data.success) {
        setRevisionData(revisionData.filter((data) => data._id !== noteId));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.error(`Some error occured while deleting entry.`);
    } finally {
      setIsDeletingId("");
      setIsDeleting(false);
    }
  };

  const handleNotification = async (e: any, data: RevisionData) => {
    try {
      data.notification = e;

      const response = await axios.post("/api/novu/notification/trigger", data);

      if (response.data.success) {
        // setRevisionData({...revisionData});
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(`Some error occured while turning on the notification.`);
    }
  };

  useEffect(() => {
    fetchNoteData();
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col justify-normal items-center gap-y-4">
      <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-y-4 md:gap-y-0 p-2 sm:my-4">
        <h1 className="text-center sm:text-left text-3xl flex flex-row items-center justify-center space-x-2">
          <div>
            Welcome <strong>{session?.user.username} </strong>
          </div>
          <div title="Verified Badge">
            {session?.user.isVerified && (
              <BadgeCheck className="text-green-500" />
            )}
          </div>
        </h1>
        <SearchBar />
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
                        !noteData.entryDate && "text-muted-foreground"
                      )}
                    >
                      <SlCalender className="mr-2 h-4 w-4" />
                      {noteData.entryDate ? (
                        format(noteData.entryDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={noteData.entryDate}
                      onSelect={(e) =>
                        setNoteData({ ...noteData, entryDate: e })
                      }
                      disabled={(date) =>
                        date < new Date(new Date().toDateString())
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter className="flex flex-row space-x-4 place-content-evenly">
              <Button className="w-full" type="submit" onClick={handleSaveRevision}>
                Save
              </Button>
              <DialogClose className="w-full" asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full">
        <Suspense fallback={"Loading..."}>
          <Table className="border w-full">
            <TableHeader className="border">
              <TableRow className="border">
                <TableHead className="border text-center">Topic</TableHead>
                <TableHead className="border text-center">Created At</TableHead>
                <TableHead className="border text-center">
                  1st Revision Date
                </TableHead>
                <TableHead className="border text-center">
                  2nd Revision Date
                </TableHead>
                <TableHead className="border text-center">
                  3rd Revision Date
                </TableHead>
                <TableHead className="border text-center">
                  Notification
                </TableHead>
                <TableHead className="border text-center">
                  Delete Entry
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border">
              {revisionData.map((data) => (
                <TableRow className="border" key={data._id}>
                  <TableCell className="border text-center">
                    {data.title}
                  </TableCell>
                  <TableCell className="border text-center">
                    {new Date(data?.entryDate!).toDateString()}
                  </TableCell>
                  <TableCell className="border text-center">
                    {new Date(data?.firstDate!).toDateString()}
                  </TableCell>
                  <TableCell className="border text-center">
                    {new Date(data?.secondDate!).toDateString()}
                  </TableCell>
                  <TableCell className="border text-center">
                    {new Date(data?.thirdDate!).toDateString()}
                  </TableCell>
                  <TableCell className="border text-center">
                    <Switch
                      id={data._id}
                      checked={data.notification}
                      onCheckedChange={(e) => handleNotification(e, data)}
                    />
                  </TableCell>
                  <TableCell className="border text-center">
                    <Button
                      onClick={() => handleDeleteEntry(data._id || "")}
                      disabled={isDeleting}
                    >
                      {isDeleting && isDeletingId === data._id ? (
                        <>
                          <Loader2 className="mr-1 h-4 w-4" /> Deleting...
                        </>
                      ) : (
                        <>Delete</>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Suspense>
      </div>
      <div className="absolute bottom-0 w-full my-2">
        {/* Pagination to be added */}
      </div>
    </div>
  );
}
