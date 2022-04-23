import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: number,
            name: string
        }
    }
}
const cookieOptions = {
    cookieName: "myapp_cookiename",
    password: process.env.COOKIEPASSWORD!,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    }
}
export default function withApiSession(fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
    return withIronSessionApiRoute(fn, cookieOptions);
}