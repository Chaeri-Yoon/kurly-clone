import { IDataResponse } from "@libs/client/useCallApi";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export interface ICartProductsResponse extends IDataResponse {
    products?: {
        product: Product;
        quantity: number;
        isSelected: boolean;
    }[]
}
async function handler(req: NextApiRequest, res: NextApiResponse<ICartProductsResponse>) {
    const { session: { user } } = req;
    if (!user) {
        return res.json({
            ok: false,
            products: []
        })
    }
    if (req.method === "GET") {
        try {
            const findUserCartProducts = await client.cart.findMany({
                where: {
                    userId: user.id
                },
                select: {
                    product: true,
                    quantity: true,
                }
            })
            return res.json({
                ok: true,
                products: findUserCartProducts.map(product => ({ ...product, isSelected: true }))
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false
            })
        }
    }
    else if (req.method === "POST") {
        const { body: { productId, quantity } } = req;
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
}
export default withApiSession(handler);