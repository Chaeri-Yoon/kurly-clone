import client from "@libs/server/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const recommendations = await client.product.findMany({})
    res.json({
        recommendations
    })
}