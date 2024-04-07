"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleUserSignUp = async () => {
    try {
      setIsDisabled(true);
      // Validate data in all the fields
      if (
        formData.firstName.trim().length > 0 &&
        formData.lastName.trim().length > 0 &&
        formData.email.trim().length > 0 &&
        formData.password.trim().length > 0
      ) {
        const response = await axios.post("/api/users/signup", formData);

        if (response.data.success) {
          toast.success(response.data.message);
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          });
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.error("Please provide data in all the fields...");
      }

      setIsDisabled(false);
    } catch (error: any) {
      setIsDisabled(false);
      console.log(error.message);
      toast.error(
        "Something went wrong while creating your account. Please try again."
      );
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="firstname"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="lastname"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="yourname@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full flex flex-row items-center justify-center gap-x-2"
            onClick={handleUserSignUp}
            disabled={isDisabled}
          >
            <MdAccountCircle className="h-6 w-6" />
            Create an account
          </Button>
          <hr className="my-1" />
          <Button
            variant="outline"
            className="w-full flex flex-row items-center justify-center gap-x-2"
            disabled={isDisabled}
          >
            <FaGoogle className="h-4 w-4" />
            Sign up with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
