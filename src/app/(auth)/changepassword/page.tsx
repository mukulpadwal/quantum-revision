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
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { MdOutlineLockReset } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ResetPasswordFormData {
  newPassword: string;
  confirmNewPassword: string;
}

function ChangePassword() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: "",
    confirmNewPassword: "",
  });

  const token = queryParams.get("token") || "";

  const handleChangePassword = async () => {
    try {
      setIsDisabled(true);
      if (
        formData.newPassword.trim().length > 0 &&
        formData.confirmNewPassword.trim().length > 0
      ) {
        if (formData.newPassword === formData.confirmNewPassword) {
          const response = await axios.post("/api/users/changepassword", {
            ...formData,
            token: token,
          });

          if (response.data.success) {
            toast.success(response.data.message);
            setTimeout(() => {
              router.push("/login");
            }, 1500);
          } else {
            toast.error(response.data.message);
          }
        } else {
          toast.error("New Password and Confirm New Password Does not Match.");
        }
      } else {
        toast.error("Please provide all the fields.");
      }
      setIsDisabled(false);
    } catch (error: any) {
      setIsDisabled(false);
      console.log(
        `Some error occured while resetting your password : ERROR : ${error.message}`
      );
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Change Password</CardTitle>
        <CardDescription className="w-full">
          Please enter a new password to complete the password change process.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>

            <Input
              id="new-password"
              type="password"
              name="new-password"
              placeholder="********"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-new-password">Confirm New Password</Label>

            <Input
              id="confirm-new-password"
              type="password"
              name="confirm-new-password"
              placeholder="********"
              value={formData.confirmNewPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmNewPassword: e.target.value,
                })
              }
              required
            />
          </div>
          {isDisabled ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full flex flex-row items-center justify-center gap-x-2"
              disabled={isDisabled}
              onClick={handleChangePassword}
            >
              <MdOutlineLockReset className="w-5 h-5" />
              Change Password
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ChangePasswordPage() {
  return (
    <Suspense>
      <ChangePassword />
    </Suspense>
  );
}
