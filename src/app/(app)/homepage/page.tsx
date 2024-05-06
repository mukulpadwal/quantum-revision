"use client";

import { useSession } from "next-auth/react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IoIosSearch } from "react-icons/io";

export default function HomePage() {
  const { data: session } = useSession();

  const [noteData, setNoteData] = useState<Note>({
    title: "",
    entryDate: undefined,
  });
  const [revisionData, setRevisionData] = useState<RevisionData[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDeletingId, setIsDeletingId] = useState<string>("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
    setIsSavingNote(true);
    try {
      if (
        noteData.title.trim().length > 0 &&
        noteData.entryDate !== undefined
      ) {
        const response = await axios.post("/api/notes/create", noteData);

        if (response.data.success) {
          await fetchNoteData();
          toast.success(response.data.message);
          setNoteData({
            title: "",
            entryDate: undefined,
          });
          setSearchQuery("");
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.error("Please provide all the fields.");
      }
    } catch (error: any) {
      console.log(`Some error occured while creating entry.`);
    } finally {
      setIsSavingNote(false);
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

      const updatedRevisionData = revisionData.map((rData) => {
        if (rData._id === data._id) {
          return data;
        } else {
          return rData;
        }
      });

      const response = await axios.post("/api/novu/notification/trigger", data);

      if (response.data.success) {
        setRevisionData(updatedRevisionData);
        toast.success(response.data.message);
      } else {
        setRevisionData(revisionData);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(`Some error occured while turning on the notification.`);
    }
  };

  useEffect(() => {
    fetchNoteData();
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-normal items-center gap-y-4">
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
        <div className="w-full relative sm:ml-auto flex-1 md:grow-0">
          <IoIosSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                        date < new Date(new Date().toDateString()) ||
                        date > new Date()
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter className="flex flex-row space-x-4 place-content-evenly">
              {isSavingNote ? (
                <Button className="w-full" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </Button>
              ) : (
                <Button
                  className="w-full"
                  type="submit"
                  onClick={handleSaveRevision}
                >
                  Save
                </Button>
              )}
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
              {revisionData
                .filter((data) =>
                  searchQuery === ""
                    ? data
                    : data.title
                        ?.trim()
                        .toLowerCase()
                        .includes(searchQuery.trim().toLowerCase())
                )
                .map((data) => (
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-[400px] sm:max-w-[425px]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your note and and the
                              notifications will be switched off.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            <Button
                              variant={"destructive"}
                              onClick={() => handleDeleteEntry(data._id || "")}
                              disabled={isDeleting}
                            >
                              {isDeleting && isDeletingId === data._id ? (
                                <>
                                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />{" "}
                                  Deleting...
                                </>
                              ) : (
                                <>Delete</>
                              )}
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Suspense>
      </div>
    </div>
  );
}
