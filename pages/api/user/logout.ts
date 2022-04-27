import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        req.session.destroy();
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false })
    }
    console.log(req.session)
    res.send({ ok: true });
}
export default withApiSession(handler);