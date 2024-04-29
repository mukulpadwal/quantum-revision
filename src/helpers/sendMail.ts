import AccountVerificationEmail from "@/emails/AccountVerificationEmail";
import PasswordResetEmail from "@/emails/PasswordResetEmail";
import AccountDeletionEmail from "@/emails/AccountDeletionEmail";
import ApiResponse from "./ApiResponse";
import jwt from "jsonwebtoken";
import conf from "@/conf/conf";
import User from "@/models/user.model";
import { Resend } from "resend";
import generateOTP from "./generateOTP";

export default async function sendMail(
    email: string,
    emailType: string,
    username: string,
    userId: string
) {
    try {
        const resend = new Resend(conf.resendApiKey);
        const token = jwt.sign({ _id: userId }, conf.tokenSecret);

        const otp = generateOTP();
        const changePasswordLink = `${conf.domain}/changepassword?token=${token}`;

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    verifyAccountOtp: otp,
                    verifyAccountOtpExpiry: Date.now() + 86400000,
                },
            });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    resetPasswordToken: token,
                    resetPasswordTokenExpiry: Date.now() + 86400000,
                },
            });
        }

        if (emailType === "DELETE") {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: email,
                subject: "Quantum Revision | Account Deletion",
                react: AccountDeletionEmail({ username }),
            });
        }

        if (emailType === "VERIFY") {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: email,
                subject: "Quantum Revision | Account Verification",
                react: AccountVerificationEmail({ username, otp }),
            });
        }

        if (emailType === "RESET") {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: email,
                subject: "Quantum Revision | Password Reset",
                react: PasswordResetEmail({ username, changePasswordLink }),
            });
        }

        return new ApiResponse(
            true,
            200,
            {},
            "Email sent successfully."
        );
    } catch (emailError: any) {
        console.error(
            `Error while sending verification email : ERROR : ${emailError}`
        );
        return new ApiResponse(
            false,
            500,
            {},
            "Failed to send verification email."
        );
    }
}
