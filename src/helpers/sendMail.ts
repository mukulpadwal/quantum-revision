import conf from "@/conf/conf";
import nodemailer from "nodemailer";
import User from "@/models/user.model";
import jwt from "jsonwebtoken";

interface Mail {
    email: string,
    emailType: string,
    userId: string,
    fullName: string
}


export default async function sendMail({ email, emailType, userId, fullName }: Mail) {
    try {
        const token = jwt.sign({ _id: userId }, conf.tokenSecret);

        const verifyAccountHtmlBody = `
        <h3>Hello ${fullName},</h3>
        <p>Get ready to Transform Your Study Sessions with QuantumRevision!</p>

        <p>Click the below button to Verify Your Account and start revising better.
            <a href='${conf.domain}/verifyaccount?token=${token}' style="color: #555; background: #ffc; padding-right: 8px; padding-left: 8px; padding-top: 2px; padding-bottom: 2px;">
            VERIFY
            </a>
        </p>
        <hr>
        <div>
            If above button does not work. Copy and paste this link directly in your browser <code>${conf.domain}/verifyaccount?token=${token}</code>
        </div>
        <hr>
        `;

        const resetPasswordHtmlBody = `
        <h3>Hello ${fullName},</h3>
        <br>
        <p>Get ready to Transform Your Study Sessions with QuantumRevision!</p>
        <br>
        <p>Click the below button to Reset Your Password and start revising better.
            <a href='${conf.domain}/resetpassword?token=${token}' style="color: #555; background: #ffc; padding-right: 8px; padding-left: 8px; padding-top: 2px; padding-bottom: 2px;">
            VERIFY
            </a>
        </p>
        <hr>
        <br>
        <div>
            If above button does not work. Copy and paste this link directly in your browser <code>${conf.domain}/resetpassword?token=${token}</code>
        </div>
        `;

        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    verifyAccountToken: token,
                    verifyAccountTokenExpiry: Date.now() + 86400000
                }
            });
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    resetPasswordToken: token,
                    resetPasswordTokenExpiry: Date.now() + 86400000
                }
            });
        }


        var transporter = nodemailer.createTransport({
            host: conf.mailtrapHost,
            port: conf.mailtrapPort,
            auth: {
                user: conf.mailtrapUser,
                pass: conf.mailtrapPassword
            }
        });

        // send mail with defined transport object
        const mailResponse = await transporter.sendMail({
            from: 'testuser@testuser.com', // sender address
            to: email, // list of receivers
            subject: emailType === 'VERIFY' ? "Verify your account" : "Reset your password", // Subject line
            html: emailType === 'VERIFY' ? verifyAccountHtmlBody : resetPasswordHtmlBody, // html body
        });

        return mailResponse;

    } catch (error: any) {
        console.log("Internal server error while sending email.", error.message);
    }
}




