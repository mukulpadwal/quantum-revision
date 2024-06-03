import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import RevisionData from "@/types/RevisionData";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface ScheduleTableProps {
  revisionData: RevisionData[];
  searchQuery: string;
  handleNotification: (e: any, data: RevisionData, noteId: string) => void;
  handleDeleteEntry: (noteId: string) => void;
  isDeleting: boolean;
  isDeletingId: string;
  isEnablingNotification: boolean;
  isEnablingNotificationId: string;
  isFetchingData: boolean;
}

export default function ScheduleTable({
  revisionData,
  searchQuery,
  handleNotification,
  handleDeleteEntry,
  isDeleting,
  isDeletingId,
  isEnablingNotification,
  isEnablingNotificationId,
  isFetchingData,
}: ScheduleTableProps) {
  const handleDisplayRevisionSchedule = () => {};

  return (
    <Table className="border w-full">
      <TableHeader className="border">
        <TableRow className="border">
          <TableHead className="border text-center">Topic</TableHead>
          <TableHead className="border text-center hidden sm:table-cell">
            Created At
          </TableHead>
          <TableHead className="border text-center hidden sm:table-cell">
            1st Revision Date
          </TableHead>
          <TableHead className="border text-center hidden sm:table-cell">
            2nd Revision Date
          </TableHead>
          <TableHead className="border text-center hidden sm:table-cell">
            3rd Revision Date
          </TableHead>
          <TableHead className="border text-center">Notification</TableHead>
          <TableHead className="border text-center hidden sm:table-cell">
            Delete Entry
          </TableHead>
        </TableRow>
      </TableHeader>
      {isFetchingData ? (
        <TableBody className="border">
          <TableRow className="border">
            <TableCell className="flex flex-row justify-center items-center">
              <Skeleton className="w-[100px] h-[20px] rounded-full" />
            </TableCell>
            <TableCell className="border text-center hidden sm:table-cell">
              <div className="flex flex-row justify-center items-center">
                <Skeleton className="w-[100px]  h-[20px] rounded-full" />
              </div>
            </TableCell>
            <TableCell className="border text-center hidden sm:table-cell">
              <div className="flex flex-row justify-center items-center">
                <Skeleton className="w-[100px]  h-[20px] rounded-full " />
              </div>
            </TableCell>
            <TableCell className="border text-center hidden sm:table-cell">
              <div className="flex flex-row justify-center items-center">
                <Skeleton className="w-[100px]  h-[20px] rounded-full" />
              </div>
            </TableCell>
            <TableCell className="border text-center hidden sm:table-cell">
              <div className="flex flex-row justify-center items-center">
                <Skeleton className="w-[100px]  h-[20px] rounded-full" />
              </div>
            </TableCell>
            <TableCell className="border text-center">
              <div className="flex flex-row justify-center items-center">
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </div>
            </TableCell>
            <TableCell className="border text-center hidden sm:table-cell">
              <div className="flex flex-row justify-center items-center">
                <Skeleton className="w-[100px]  h-[20px] rounded-full" />
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
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
            .map((data) => {
              return (
                <TableRow className="border" key={data._id}>
                  <TableCell
                    className="border text-center"
                    onClick={handleDisplayRevisionSchedule}
                  >
                    <Dialog>
                      <DialogTrigger>{data.title}</DialogTrigger>
                      <DialogContent className="max-w-[400px] sm:max-w-[425px] rounded-lg">
                        <DialogHeader className="mt-6">
                          <DialogTitle className="text-xl font-bold text-center">
                            Your Revision Schedule for {data.title}
                          </DialogTitle>
                          <DialogDescription className="py-4">
                            <span className="flex flex-col justify-center items-center space-y-3">
                              <span className="flex flex-row justify-center items-center space-x-1">
                                <span className="font-bold text-base">
                                  Created At :{" "}
                                </span>
                                <span className="font-medium text-base">
                                  {new Date(data?.entryDate!).toDateString()}
                                </span>
                              </span>
                              <span className="flex flex-row justify-center items-center space-x-1">
                                <span className="font-bold text-base">
                                  First Revision Date :{" "}
                                </span>
                                <span className="font-medium text-base">
                                  {new Date(data?.firstDate!).toDateString()}
                                </span>
                              </span>
                              <span className="flex flex-row justify-center items-center space-x-1">
                                <span className="font-bold text-base">
                                  Second Revision Date :{" "}
                                </span>
                                <span className="font-medium text-base">
                                  {new Date(data?.secondDate!).toDateString()}
                                </span>
                              </span>
                              <span className="flex flex-row justify-center items-center space-x-1">
                                <span className="font-bold text-base">
                                  Final Revision Date :{" "}
                                </span>
                                <span className="font-medium text-base">
                                  {new Date(data?.thirdDate!).toDateString()}
                                </span>
                              </span>
                            </span>
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-row justify-center items-center space-x-2">
                          <Button
                            variant={"destructive"}
                            onClick={() => handleDeleteEntry(data._id || "")}
                            className="sm:hidden w-full"
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
                          <DialogClose asChild>
                            <Button
                              type="button"
                              variant="secondary"
                              className="w-full"
                            >
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="border text-center hidden sm:table-cell">
                    {new Date(data?.entryDate!).toDateString()}
                  </TableCell>
                  <TableCell className="border text-center hidden sm:table-cell">
                    {new Date(data?.firstDate!).toDateString()}
                  </TableCell>
                  <TableCell className="border text-center hidden sm:table-cell">
                    {new Date(data?.secondDate!).toDateString()}
                  </TableCell>
                  <TableCell className="border text-center hidden sm:table-cell">
                    {new Date(data?.thirdDate!).toDateString()}
                  </TableCell>
                  <TableCell className="border text-center">
                    {isEnablingNotification &&
                    isEnablingNotificationId === data._id ? (
                      <div className="w-full flex items-center justify-center">
                        <Loader2 className="animate-spin" />
                      </div>
                    ) : (
                      <Switch
                        id={data._id}
                        checked={data.notification}
                        onCheckedChange={(e) =>
                          handleNotification(e, data, data._id || "")
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell className="border text-center hidden sm:table-cell">
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
                            This action cannot be undone. This will permanently
                            delete your note and and the notifications will be
                            switched off.
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
              );
            })}
        </TableBody>
      )}
    </Table>
  );
}
