import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { session: { user }, body: { productId, quantity } } = req;
    if (!user) {
        return res.json({
            ok: true,
            message: 'No Logged User'
        })
    }
    try {
        await client.cart.upsert({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId
                }
            },
            create: {
                user: {
                    connect: {
                        id: user.id
                    }
                },
                product: {
                    connect: {
                        id: productId
                    }
                },
                quantity
            },
            update: {
                quantity: {
                    increment: quantity
                }
            }
        });
        return res.json({
            ok: true
        })
    } catch (error) {
        console.log(error);
        return res.json({
            ok: false,
            message: 'Database Failure'
        })
    }
}
export default withApiSession(handler);