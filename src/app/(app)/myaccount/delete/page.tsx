"use client";

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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const DeleteAccountPage = () => {
  const { data: session } = useSession();
  const [username, setUsername] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/users/delete/${username}`);

      if (response.data.success) {
        toast.success(response.data.message);
        await signOut({ redirect: true, callbackUrl: "/" });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(`Error while deleting your account : ERROR : ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (session) {
      setUsername(session.user.username);
    }
  }, [session]);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Deleting Your Account</h1>
        <Separator className="my-4" />

        <p>
          We&apos;re sorry to see you go. By proceeding with account deletion,
          please note that all your account data, including personal information
          and preferences, will be permanently removed from our system. This
          action cannot be undone. If you&apos;re certain about deleting your
          account, please proceed by clicking the button below. If you have any
          concerns or questions, feel free to contact our support team for
          assistance. Thank you for being a part of our community.
        </p>
      </div>
      <Separator className="my-4" />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant={"destructive"}
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4" /> Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Separator className="my-4" />
    </>
  );
};

export default DeleteAccountPage;
