"use client";

import { useSession } from "next-auth/react";
import { BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import RevisionData from "@/types/RevisionData";
import axios from "axios";
import toast from "react-hot-toast";
import Note from "@/types/Note";
import SearchBar from "@/components/SearchBar";
import AddRevisionEntry from "@/components/AddRevisionEntry";
import ScheduleTable from "@/components/ScheduleTable";

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

  const handleSearchQuery = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const handleSetNoteData = (e: any) => {
    if (e?.target?.localName === "input") {
      setNoteData({ title: e.target.value, entryDate: noteData.entryDate });
    } else {
      setNoteData({ title: noteData.title, entryDate: e });
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

        <SearchBar
          searchQuery={searchQuery}
          handleSearchQuery={handleSearchQuery}
        />
      </div>
      <div className="w-full flex justify-center items-center p-2">
        <AddRevisionEntry
          noteData={noteData}
          handleSetNoteData={handleSetNoteData}
          isSavingNote={isSavingNote}
          handleSaveRevision={handleSaveRevision}
        />
      </div>
      <div className="w-full">
        <ScheduleTable
          revisionData={revisionData}
          searchQuery={searchQuery}
          handleNotification={handleNotification}
          handleDeleteEntry={handleDeleteEntry}
          isDeleting={isDeleting}
          isDeletingId={isDeletingId}
        />
      </div>
    </div>
  );
}
