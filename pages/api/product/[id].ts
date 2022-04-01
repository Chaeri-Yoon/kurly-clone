import client from "@libs/server/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const product = await client.product.findUnique({
        where: {
            id: +req.query.id
        }
    })
    res.json({
        product
    })
}