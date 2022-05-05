import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { session: { user } } = req;
    if (!user) {
        return res.json({
            ok: false
        })
    }
    try {
        const findUser = await client.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                cartProducts: true
            }
        })
        if (!findUser) {
            return res.json({
                ok: true
            })
        }
        const cartProductIds = findUser.cartProducts.map(cartProducts => cartProducts['productId']);
        const cartProducts = await client.product.findMany({
            where: {
                id: { in: cartProductIds }
            }
        })
        res.json({
            ok: true,
            cartProducts
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false
        })
    }

}
export default withApiSession(handler);