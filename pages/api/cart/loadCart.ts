import client from "@libs/server/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    // We check if there is a logged user before call this handler in cart.tsx,
    // so there will probably no need to check if any user is logged in.
    const { body: { productIds } } = req;
    try {
        const cartProducts = await client.product.findMany({
            where: {
                id: { in: productIds }
            }
        })
        res.json({
            ok: true,
            cartProducts
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false
        })
    }
}