"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineDomainVerification } from "react-icons/md";

export default function VerifyAccountPage() {
  const router = useRouter();
  const query = useSearchParams();
  const [verificationToken, setVerificationToken] = useState<string>("");

  console.log(verificationToken);

  const handleAccountVerification = async () => {
    try {
      const response = await axios.post("/api/users/verifyaccount", {
        verificationToken,
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

  useEffect(() => {
    const token = query.get("token");
    if (token) {
      setVerificationToken(String(token));
    }
  }, [query]);

  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <h1 className="text-3xl md:text-7xl text-center">Quantum Revision</h1>
      <p className="text-base md:text-xl text-center">
        Transform Your Study Sessions with QuantumRevision!
      </p>
      <Button
        onClick={handleAccountVerification}
        className="flex items-center justify-center gap-x-2"
      >
        <MdOutlineDomainVerification className="h-6 w-6" /> Verify Your Account
      </Button>
    </div>
  );
}
