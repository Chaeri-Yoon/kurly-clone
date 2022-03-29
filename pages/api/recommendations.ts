import client from "../../lib/server/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Category } from "@prisma/client";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const recommendations = await client.product.findMany({
        where: {
            category: Category.RECOMMENDATION
        }
    })
    res.json({
        recommendations
    })
}