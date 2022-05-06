import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { session: { user } } = req;
    if (!user) {
        return res.json({
            ok: false,
            products: []
        })
    }
    try {
        const findUserCartProducts = await client.cart.findMany({
            where: {
                userId: user.id
            },
            select: {
                product: true,
                quantity: true
            }
        })
        res.json({
            ok: true,
            products: findUserCartProducts
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false
        })
    }

}
export default withApiSession(handler);