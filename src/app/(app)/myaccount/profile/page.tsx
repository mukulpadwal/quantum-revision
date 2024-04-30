"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Ban, Edit2, Loader2 } from "lucide-react";
import { UpdateIcon } from "@radix-ui/react-icons";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  fullName: z
    .string()
    .min(2, {
      message: "Full Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Full Name must not be longer than 30 characters.",
    }),
});

export default function ProfilePage() {
  const { data: session } = useSession();

  const [userDetails, setUserDetails] = useState({
    username: "",
    email: session?.user.email,
    fullName: "",
  });

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/users/me");
      if (response.data.success) {
        setUserDetails({
          username: response.data.data.username,
          email: response.data.data.email,
          fullName: response.data.data.fullName,
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(`Error while fetching user details.`);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const onSubmit = async (data: any) => {
    setIsUpdating(true);
    try {
      const response = await axios.post("/api/users/update", data);
      console.log(response);

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(`Error while updating user details : ERROR : ${error}`);
    } finally {
      setIsDisabled(true);
      setIsUpdating(false);
    }
  };

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  defaultValue={userDetails.username}
                  type="text"
                  {...field}
                  disabled={isDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  defaultValue={userDetails.email}
                  type="email"
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <FormControl>
                  <Input
                    defaultValue={userDetails.fullName}
                    type="text"
                    {...field}
                    disabled={isDisabled}
                  />
                </FormControl>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isDisabled ? (
          <Button
            onClick={(e) => {
              e.preventDefault();
              setIsDisabled(false);
            }}
            variant={"secondary"}
          >
            <Edit2 className="h-4 w-4 mr-2" /> Edit profile
          </Button>
        ) : (
          <div className="flex flex-row items-center  space-x-4">
            <Button type="submit">
              {!isUpdating ? (
                <>
                  <UpdateIcon className="h-4 w-4 mr-2" />
                  Update profile
                </>
              ) : (
                <>
                  <Loader2 className="h-4 w-4 mr-2" />
                  Updating...
                </>
              )}
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => {
                setIsDisabled(true);
              }}
            >
              <Ban className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
