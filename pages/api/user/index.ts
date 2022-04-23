import withApiSession from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

export interface ILoggedUser {
    id: number,
    name: string
}
async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { session: { user } } = req;
    if (user) {
        res.json({
            user: {
                id: user.id,
                name: user.name
            }
        })
    }
    else {
        res.json({
            ok: false
        })
    }

}
export default withApiSession(handler);