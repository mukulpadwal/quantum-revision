"use client";

import React, { useEffect, useState } from "react";
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

const ScheduleTable = () => {
  const [revisionData, setRevisionData] = useState<Array<RevisionData>>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDeletingId, setIsDeletingId] = useState<string>("");

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
  }, []);

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

  return (
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
          <TableHead className="border text-center">Notification</TableHead>
          <TableHead className="border text-center">Delete Entry</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="border">
        {revisionData.map((data) => (
          <TableRow className="border" key={data._id}>
            <TableCell className="border text-center">{data.title}</TableCell>
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
  );
};

export default ScheduleTable;
