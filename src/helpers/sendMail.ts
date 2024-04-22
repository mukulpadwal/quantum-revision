import AccountVerificationEmail from "@/emails/AccountVerificationEmail";
import PasswordResetEmail from "@/emails/PasswordResetEmail";
import ApiResponse from "./ApiResponse";
import jwt from "jsonwebtoken";
import conf from "@/conf/conf";
import User from "@/models/user.model";
import { Resend } from "resend";

export default async function sendVerificationEmail(
    email: string,
    emailType: string,
    username: string,
    userId: string
) {
    try {
        const resend = new Resend(conf.resendApiKey);
        const token = jwt.sign({ _id: userId }, conf.tokenSecret);

        const accountVerificationLink = `${conf.domain}/verifyaccount?token=${token}`;
        const changePasswordLink = `${conf.domain}/changepassword?token=${token}`;


        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    verifyAccountToken: token,
                    verifyAccountTokenExpiry: Date.now() + 86400000,
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

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject:
                emailType === "VERIFY"
                    ? "Quantum Revision | Verification Link"
                    : "Quantum Revision | Reset Password",
            react:
                emailType === "VERIFY"
                    ? AccountVerificationEmail({ username, accountVerificationLink })
                    : PasswordResetEmail({ username, changePasswordLink }),
        });

        return new ApiResponse(
            true,
            200,
            {},
            "Account verificationemail sent successfully."
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
