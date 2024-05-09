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
import { Loader2 } from "lucide-react";

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
          redirect: false,
          ...formData,
        });

        console.log(response);

        if (response?.ok) {
          if (response.error === "CredentialsSignin") {
            toast.error("Incorrect Email or Password.");
          }

          if (response.url) {
            toast.success("Log in Success...");

            router.replace("/homepage");
          }
        } else {
          toast.error("Could not log in. Please try again.");
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
          {isDisabled ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full flex flex-row items-center justify-center gap-x-2"
              onClick={handleUserLogin}
              disabled={isDisabled}
            >
              <MdLogin className="h-5 w-5" /> Login
            </Button>
          )}

          <div className="my-1 flex flex-row items-center justify-center gap-x-2">
            <hr className="w-3/4" />
            Or
            <hr className="w-3/4" />
          </div>
          <Button
            variant="outline"
            className="w-full flex flex-row items-center justify-center gap-x-2"
            onClick={() => signIn("google")}
            disabled
          >
            <FaGoogle className="h-4 w-4" />
            Continue with Google (Coming Soon)
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
