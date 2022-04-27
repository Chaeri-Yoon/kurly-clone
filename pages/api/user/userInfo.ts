import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { body: { id } } = req;
        if (!id) {
            return res.json({
                ok: true
            })
        }
        const findUser = await client.user.findUnique({
            where: {
                id
            },
            select: {
                email: true,
                contact: true,
                address: true
            }
        })
        if (!findUser) {
            return res.json({
                ok: true
            })
        }
        res.json({
            ok: true,
            email: findUser.email,
            contact: findUser.contact,
            address: findUser.address
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false });
    }
}
export default withApiSession(handler);