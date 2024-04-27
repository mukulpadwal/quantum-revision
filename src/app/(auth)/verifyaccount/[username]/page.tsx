"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineDomainVerification } from "react-icons/md";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyAccountPage() {
  const router = useRouter();
  const params = useParams();
  const [verificationOtp, setVerificationOtp] = useState<string>("");

  const handleAccountVerification = async () => {
    try {
      const response = await axios.post("/api/users/verifyaccount", {
        username: params.username,
        otp: verificationOtp,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <h1 className="text-3xl md:text-7xl text-center">Quantum Revision</h1>
      <p className="text-base md:text-xl text-center">
        Transform Your Study Sessions with QuantumRevision!
      </p>
      <InputOTP
        maxLength={6}
        value={verificationOtp}
        onChange={(verificationOtp: string) =>
          setVerificationOtp(verificationOtp)
        }
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <div className="text-center text-sm">
        <>Enter your one-time password.</>
      </div>
      <Button
        onClick={handleAccountVerification}
        className="flex items-center justify-center gap-x-2"
      >
        <MdOutlineDomainVerification className="h-6 w-6" /> Verify Your Account
      </Button>
    </div>
  );
}
