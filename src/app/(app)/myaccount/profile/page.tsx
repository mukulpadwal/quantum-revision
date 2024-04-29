"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  fullName: z
    .string()
    .min(2, {
      message: "fullName must be at least 2 characters.",
    })
    .max(30, {
      message: "fullName must not be longer than 30 characters.",
    }),
});

export default function ProfilePage() {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    fullName: "",
  });

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
    console.log(data);
  };

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: userDetails.username,
      email: userDetails.email,
      fullName: userDetails.fullName
    },
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
                <Input type="text" {...field} />
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
                <Input type="email" {...field} />
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
                  <Input type="text" {...field} />
                </FormControl>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
