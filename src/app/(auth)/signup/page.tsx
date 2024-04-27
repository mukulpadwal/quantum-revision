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
import { Loader2 } from "lucide-react";

interface SignupFormData {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);

  const handleUserSignUp = async () => {
    setIsDisabled(true);
    setCreating(true);

    try {
      // Validate data in all the fields
      if (
        formData.username.trim().length > 0 &&
        formData.fullName.trim().length > 0 &&
        formData.email.trim().length > 0 &&
        formData.password.trim().length > 0
      ) {
        const response = await axios.post("/api/users/signup", formData);

        if (response.data.success) {
          toast.success(response.data.message);

          setTimeout(() => {
            router.replace(`/verifyaccount/${formData.username}`);
          }, 1500);

          setFormData({
            username: "",
            fullName: "",
            email: "",
            password: "",
          });
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.error("Please provide data in all the fields...");
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error(
        "Something went wrong while creating your account. Please try again."
      );
    } finally {
      setIsDisabled(false);
      setCreating(false);
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
              <Label htmlFor="firstName">Username</Label>
              <Input
                id="userName"
                name="username"
                placeholder="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
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
          {!creating ? (
            <Button
              type="submit"
              className="w-full flex flex-row items-center justify-center gap-x-2"
              onClick={handleUserSignUp}
            >
              <MdAccountCircle className="h-6 w-6" />
              Create an account
            </Button>
          ) : (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          )}
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
