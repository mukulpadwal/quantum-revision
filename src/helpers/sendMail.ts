import AccountVerificationEmail from "@/emails/AccountVerificationEmail";
import PasswordResetEmail from "@/emails/PasswordResetEmail";
import AccountDeletionEmail from "@/emails/AccountDeletionEmail";
import ApiResponse from "./ApiResponse";
import jwt from "jsonwebtoken";
import conf from "@/conf/conf";
import User from "@/models/user.model";
import Plunk from '@plunk/node';
import { render } from '@react-email/render';
import generateOTP from "./generateOTP";

export default async function sendMail(
    email: string,
    emailType: string,
    username: string,
    userId: string
) {
    try {
        const plunk = new Plunk(conf.plunkSecretKey);
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
            await plunk.emails.send({
                to: email,
                subject: "Quantum Revision | Account Deletion",
                body: render(AccountDeletionEmail({ username })),
            });
        }

        if (emailType === "VERIFY") {
            await plunk.emails.send({
                to: email,
                subject: "Quantum Revision | Account Verification",
                body: render(AccountVerificationEmail({ username, otp })),
            });
        }

        if (emailType === "RESET") {
            await plunk.emails.send({
                to: email,
                subject: "Quantum Revision | Password Reset",
                body: render(PasswordResetEmail({ username, changePasswordLink })),
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
