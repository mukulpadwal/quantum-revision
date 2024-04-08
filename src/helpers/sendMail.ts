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
        <body>
            <header
            style="
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                margin: 16px;
            "
            >
            <img
                src=${"/public/images/three.jpeg"}
                alt="Quantum Revision Logo"
                style="
                display: inline-block;
                width: auto;
                height: 100px;
                text-align: center;
                border: 1px solid black;
                border-radius: 50%;
                padding: 10px;
                "
            />
            </header>
            <div style="width: auto; height: auto; padding: 16px">
            <p style="font-size: 24px; text-align: center">Hi, ${fullName}</p>
            <p style="font-size: 18px">
                Get ready to Transform Your Study Sessions with QuantumRevision!
            </p>
            <p style="font-size: 18px">
                Click the below button to Verify Your Account and start revising better.

                <a
                href="${conf.domain}/verifyaccount?token=${token}"
                style="
                    border: 1px solid black;
                    border-radius: 16px;
                    padding-right: 8px;
                    padding-left: 8px;
                    padding-top: 2px;
                    padding-bottom: 2px;
                    text-decoration: none;
                "
                >
                VERIFY ACCOUNT
                </a>
            </p>
            <hr style="margin-top: 16px; margin-bottom: 16px" />
            <p style="font-size: 18px">
                If above button does not work. Copy and paste this link directly in your
                browser
            </p>
            
                <code style="
                display: inline-block;
                width: auto;
                height: fit-content;
                border: 1px solid black;
                padding: 10px;
                word-break: break-all;
                font-size: 16px;
              ">${conf.domain}/verifyaccount?token=${token}</code>
          
            </div>
            <footer
            style="
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                margin: 16px;
            "
            >
            <div>&copy; 2024 Quantum revision. All Rights Reserved.</div>
            </footer>
        </body>
        `;

        const resetPasswordHtmlBody = `
        <body>
            <header
            style="
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                margin: 16px;
            "
            >
            <img
                src=${"/public/images/three.jpeg"}
                alt="Quantum Revision Logo"
                style="
                display: inline-block;
                width: auto;
                height: 100px;
                text-align: center;
                border: 1px solid black;
                border-radius: 50%;
                padding: 10px;
                "
            />
            </header>
            <div style="width: auto; height: auto; padding: 16px">
            <p style="font-size: 24px; text-align: center">Hi, ${fullName}</p>
            <p style="font-size: 18px">
                Get ready to Transform Your Study Sessions with QuantumRevision!
            </p>
            <p style="font-size: 18px">
                Click the below button to Reset password for your account and start revising better.

                <a
                href="${conf.domain}/changepassword?token=${token}"
                style="
                    border: 1px solid black;
                    border-radius: 16px;
                    padding-right: 8px;
                    padding-left: 8px;
                    padding-top: 2px;
                    padding-bottom: 2px;
                    text-decoration: none;
                "
                >
                RESET PASSWORD
                </a>
            </p>
            <hr style="margin-top: 16px; margin-bottom: 16px" />
            <p style="font-size: 18px">
                If above button does not work. Copy and paste this link directly in your
                browser
            </p>
            
                <code style="
                display: inline-block;
                width: auto;
                height: fit-content;
                border: 1px solid black;
                padding: 10px;
                word-break: break-all;
                font-size: 16px;
              ">${conf.domain}/changepassword?token=${token}</code>
          
            </div>
            <footer
            style="
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                margin: 16px;
            "
            >
            <div>&copy; 2024 Quantum revision. All Rights Reserved.</div>
            </footer>
        </body>
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




