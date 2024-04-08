"use client";

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
import { useState } from "react";
import { FaLink } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function ResetPasswordPage() {
  const [sending, setSending] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const handlePasswordReset = async () => {
    try {
      if (email) {
        setSending(true);
        const response = await axios.post("/api/users/resetpassword", {
          email,
        });

        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        setSending(false);
      } else {
        setSending(false);
        toast.error("Please enter your email.");
      }
    } catch (error: any) {
      setSending(false);
      console.log(
        `Some error occured while sending password reset link : ERROR : ${error.message}`
      );
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your email below to initiate the password reset process. A link
          will be sent to your email.
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {!sending ? (
            <Button
              onClick={handlePasswordReset}
              type="submit"
              className="w-full flex items-center justify-center gap-x-2"
            >
              <FaLink className="w-4 h-4" />
              Send Reset Link
            </Button>
          ) : (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
