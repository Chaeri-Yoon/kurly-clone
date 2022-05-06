import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { body: { productId, quantity }, session: { user } } = req;
    if (!productId || !user) {
        return res.json({
            ok: false
        })
    }
    try {
        await client.cart.update({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId
                }
            },
            data: {
                quantity
            }
        })
        return res.json({
            ok: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false
        })
    }
}
export default withApiSession(handler);