import "next-auth";

declare module "next-auth" {
    interface User {
        _id?: string;
        username?: string;
        isVerified?: boolean;
    }

    interface Session {
        user: {
            _id?: string;
            username?: string;
            isVerified?: boolean;
        } & Session["user"];
    }

    interface JWT {
        _id?: string;
        username?: string;
        isVerified?: boolean;
    }
}
