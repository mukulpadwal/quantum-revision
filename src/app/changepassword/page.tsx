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
import { useEffect, useState } from "react";
import { MdOutlineLockReset } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";

interface ResetPasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ChangePasswordPage() {
  const query = useSearchParams();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const token = query.get("token") || "";
    if (token) {
      setToken(token);
    }
  }, [query]);

  const handleChangePassword = async () => {
    try {
      setIsDisabled(true);
      if (
        formData.oldPassword.trim().length > 0 &&
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
          Please enter your old and new passwords to complete the password
          change process.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="old-password">Old Password</Label>
            <Input
              id="old-password"
              type="old-password"
              name="old-password"
              placeholder="********"
              value={formData.oldPassword}
              onChange={(e) =>
                setFormData({ ...formData, oldPassword: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>

            <Input
              id="new-password"
              type="new-password"
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
              type="confirm-new-password"
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
          <Button
            type="submit"
            className="w-full flex flex-row items-center justify-center gap-x-2"
            disabled={isDisabled}
            onClick={handleChangePassword}
          >
            <MdOutlineLockReset className="w-5 h-5" />
            Change Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
