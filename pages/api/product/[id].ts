import client from "@libs/server/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        const product = await client.product.findUnique({
            where: {
                id: +req.query.id
            }
        })
        res.json({
            ok: true,
            product: product
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false
        })
    }

}