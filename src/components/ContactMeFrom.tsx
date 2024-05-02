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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import UserQuery from "@/types/UserQuery";

// Defining contact me form schema
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Invalid email address" }),

  userQuery: z.string().min(2, {
    message: "Kindly provide your query.",
  }),
});

const ContactMeForm = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormdata] = useState<UserQuery>({
    name: "",
    email: "",
    userQuery: "",
  });
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { ...formData },
  });

  const onFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/users/query", data);

      if (response.data.success) {
        toast.success(response.data.message);
        setFormdata({
          name: "",
          email: "",
          userQuery: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.error(`Failed to submit your query : ERROR : ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center ">
      <div className="w-full sm:w-1/2 p-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-4">
                  <FormLabel>Name : </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="my-4">
                  <FormLabel>Email : </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userQuery"
              render={({ field }) => (
                <FormItem className="my-4">
                  <FormLabel>Query : </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell about your query..."
                      className="resize-none"
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="my-4 w-full border-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2" /> Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ContactMeForm;
