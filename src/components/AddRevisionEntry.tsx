"use state";

import React, { useState } from "react";
import {
  Dialog,
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
import { Button } from "@/components/ui/button";
import { MdNoteAdd } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { SlCalender } from "react-icons/sl";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Note from "@/types/Note";

const AddRevisionEntry = ({
  handleSaveRevision,
}: {
  handleSaveRevision: Function;
}) => {
  const [noteData, setNoteData] = useState<Note>({
    title: "",
    createdAt: undefined,
  });

  return (
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
                  onSelect={(e) => setNoteData({ ...noteData, createdAt: e })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => handleSaveRevision(noteData)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRevisionEntry;
