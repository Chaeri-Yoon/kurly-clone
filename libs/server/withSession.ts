import { IncomingMessage } from "http";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiRequest, NextApiResponse } from "next";

declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: number,
            name: string
        }
    }
}
const cookieOptions = {
    cookieName: process.env.COOKIENAME!,
    password: process.env.COOKIEPASSWORD!,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    }
}
export function withGetSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(fn: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>) {
    return withIronSessionSsr(fn, cookieOptions);
}
export function withApiSession(fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
    return withIronSessionApiRoute(fn, cookieOptions);
}