import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { session: { user }, body: { address } } = req;
    if (!user) {
        return res.json({
            ok: true,
            message: 'No Logged User'
        })
    }
    try {
        await client.user.update({
            where: {
                id: user.id
            },
            data: {
                address
            }
        })
        return res.json({
            ok: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false
        })
    }
}
export default withApiSession(handler);