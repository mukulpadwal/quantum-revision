"use client";

import Link from "next/link";
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
import { MdLogin } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleUserLogin = async () => {
    try {
      setIsDisabled(true);
      // Validate data in all the fields
      if (
        formData.email.trim().length > 0 &&
        formData.password.trim().length > 0
      ) {
        const response = await signIn("credentials", {
          ...formData,
          redirect: false,
        });
        console.log(response);

        if (response?.ok) {
          if (response.error === null) {
            toast.success("Signed In successfully.");
            setTimeout(() => {
              router.push("/homepage");
            }, 1500);
          } else {
            toast.error(
              "Could not log in. Kindly make sure your account is activated."
            );
          }
        } else {
          toast.error("Could not log in. Please try again.");
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
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
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
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/resetpassword"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
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
            onClick={handleUserLogin}
            disabled={isDisabled}
          >
            <MdLogin className="h-5 w-5" /> Login
          </Button>
          <hr className="my-1" />
          <Button
            variant="outline"
            className="w-full flex flex-row items-center justify-center gap-x-2"
            disabled={isDisabled}
          >
            <FaGoogle className="h-4 w-4" />
            Login with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
