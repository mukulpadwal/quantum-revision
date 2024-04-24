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

const ScheduleTable = () => {
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
  }, []);

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
            <TableCell>{new Date(data?.entryDate!).toDateString()}</TableCell>
            <TableCell>{new Date(data?.firstDate!).toDateString()}</TableCell>
            <TableCell>{new Date(data?.secondDate!).toDateString()}</TableCell>
            <TableCell>{new Date(data?.thirdDate!).toDateString()}</TableCell>
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
  );
};

export default ScheduleTable;
