import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query: { id: productId }, session: { user } } = req;
    if (!productId || !user) {
        return res.json({
            ok: false
        })
    }
    if (req.method === 'DELETE') {
        try {
            await client.cart.delete({
                where: {
                    userId_productId: {
                        userId: user.id,
                        productId: + productId
                    }
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
    else if (req.method === 'PATCH') {
        const { body: { quantity } } = req;
        try {
            await client.cart.update({
                where: {
                    userId_productId: {
                        userId: user.id,
                        productId: +productId
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
}
export default withApiSession(handler);