"use client";

import { useSession } from "next-auth/react";
import { BadgeCheck, BellDot } from "lucide-react";
import { useEffect, useState } from "react";
import RevisionData from "@/types/RevisionData";
import axios from "axios";
import toast from "react-hot-toast";
import Note from "@/types/Note";
import SearchBar from "@/components/SearchBar";
import AddRevisionEntry from "@/components/AddRevisionEntry";
import ScheduleTable from "@/components/ScheduleTable";
import requestNotificationPermission from "@/helpers/requestNotificationPermission";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "@/helpers/firebase";
import Image from "next/image";
import ReminderDrawer from "@/components/ReminderDrawer";
import Reminder from "@/types/Reminder";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { data: session } = useSession();

  const [noteData, setNoteData] = useState<Note>({
    title: "",
    entryDate: new Date(),
    time: "",
  });
  const [revisionData, setRevisionData] = useState<RevisionData[]>([]);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDeletingId, setIsDeletingId] = useState<string>("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isEnablingNotification, setIsEnablingNotification] =
    useState<boolean>(false);
  const [isEnablingNotificationId, setIsEnablingNotificationId] =
    useState<string>("");
  const [reminderData, setReminderData] = useState<Reminder[]>([]);

  const fetchNoteData = async () => {
    setIsFetchingData(true);
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
    } finally {
      setIsFetchingData(false);
    }
  };

  const handleSaveRevision = async () => {
    setIsSavingNote(true);
    try {
      if (
        noteData.title.trim().length > 0 &&
        noteData.entryDate !== undefined &&
        noteData.time !== ""
      ) {
        const response = await axios.post("/api/notes/create", noteData);

        if (response.data.success) {
          await fetchNoteData();
          toast.success(response.data.message);
          setNoteData({
            title: "",
            entryDate: new Date(),
            time: "",
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
      fetchReminderData();
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
      fetchReminderData();
    }
  };

  const handleNotification = async (
    e: any,
    data: RevisionData,
    noteId: string
  ) => {
    setIsEnablingNotification(true);
    setIsEnablingNotificationId(noteId);
    try {
      // Let's ask the user for notification permission
      const permission = await requestNotificationPermission();

      if (permission === "granted") {
        // Let us check if service worker is supported or not
        if ("serviceWorker" in navigator) {
          try {
            // Now we need to register firebase service worker
            const messaging = getMessaging(app);
            const swUrl = `/firebase-messaging-sw.js?apiKey=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}&authDomain=${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}&projectId=${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}&storageBucket=${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}&messagingSenderId=${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}&appId=${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}&measurementId=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`;

            const serviceWorkerRegistration =
              await navigator.serviceWorker.register(swUrl);

            if (!serviceWorkerRegistration.active) {
              await serviceWorkerRegistration.update();
              // Wait for activation (similar to using 'installing' property)
            }

            let token;
            if (e) {
              token = await getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                serviceWorkerRegistration,
              });
            } else {
              token = "";
            }

            data.notification = e;

            const updatedRevisionData = revisionData.map((rData) => {
              if (rData._id === data._id) {
                return data;
              } else {
                return rData;
              }
            });

            const response = await axios.post(
              "/api/novu/notification/trigger",
              {
                ...data,
                token,
              }
            );

            if (e && response.data.success) {
              setRevisionData(updatedRevisionData);
              onMessage(messaging, (payload) => {
                console.log("Message received. ", payload);
                toast.custom((t) => (
                  <div
                    className={`${
                      t.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                  >
                    <div className="flex-1 w-0 p-4">
                      <div className="flex items-start">
                        <div className="flex justify-center items-center">
                          <Image
                            className="rounded-full"
                            src="/logo.jpeg"
                            alt="App Logo"
                            height={50}
                            width={50}
                            priority={true}
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {payload.notification?.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {payload.notification?.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ));
              });
            } else if (!e && response.data.success) {
              setRevisionData(updatedRevisionData);
              toast.success(response.data.message);
            } else {
              setRevisionData(revisionData);
              toast.error(response.data.message);
            }
          } catch (error) {
            console.error(
              `Some error occured while turning on the notification : ERROR : ${error}`
            );
          }
        } else {
          console.error("Service worker is not supported in your browser.");
        }
      } else if (permission === "denied") {
        toast.error(
          "You have denied the notification permission. Kindly enable the notification to get timely reminders."
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnablingNotification(false);
      setIsEnablingNotificationId("");
    }
  };

  const handleSearchQuery = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const handleSetNoteData = (e: any) => {
    if (e?.target?.type === "text") {
      setNoteData({
        title: e.target.value,
        entryDate: noteData.entryDate,
        time: noteData.time,
      });
    } else if (e?.target?.type === "time") {
      setNoteData({
        title: noteData.title,
        entryDate: noteData.entryDate,
        time: e.target.value,
      });
    }
  };

  const fetchReminderData = async () => {
    try {
      const response = await axios.get("/api/notes/reminder");

      if (response.data.success) {
        setReminderData(response.data.data);
      } else {
        console.log("Could not fetch reminder data.");
      }
    } catch (error) {
      console.error(
        `Something went wrong while fetching reminder data : ERROR : ${error}`
      );
    }
  };

  useEffect(() => {
    fetchNoteData();
  }, []);

  useEffect(() => {
    fetchReminderData();
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-normal items-center gap-y-4">
      <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-y-4 md:gap-y-0 p-2 sm:my-4">
        <h1 className="text-center sm:text-left text-3xl flex flex-row items-center justify-center space-x-2">
          <div className="flex flex-row justify-center items-center gap-x-2">
            <span>Welcome</span>
            <span>
              {session?.user.username ? (
                <strong>{session?.user.username}</strong>
              ) : (
                <Skeleton className="w-[60px] h-[30px] rounded-full" />
              )}
            </span>
          </div>
          <div
            title="Verified Badge"
            className="flex items-center justify-center"
          >
            {session?.user.isVerified ? (
              <BadgeCheck className="text-green-500" />
            ) : (
              <Skeleton className="w-[30px] h-[30px] rounded-full" />
            )}
          </div>
        </h1>

        <div>
          <ReminderDrawer reminderData={reminderData} />
        </div>

        <div className="w-full sm:w-auto">
          <SearchBar
            searchQuery={searchQuery}
            handleSearchQuery={handleSearchQuery}
          />
        </div>
      </div>
      <div className="w-full flex justify-center md:justify-center items-center p-2">
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
          isEnablingNotification={isEnablingNotification}
          isEnablingNotificationId={isEnablingNotificationId}
          isFetchingData={isFetchingData}
        />
      </div>
    </div>
  );
}
