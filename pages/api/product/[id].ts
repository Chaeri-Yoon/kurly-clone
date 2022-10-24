import { IDataResponse } from "@libs/client/useCallApi";
import client from "@libs/server/client";
import { Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export interface IProductResponse extends IDataResponse {
    product?: Product
}
export default async function (req: NextApiRequest, res: NextApiResponse<IProductResponse>) {
    try {
        const product = await client.product.findUnique({
            where: {
                id: +req.query.id
            }
        })
        if (!product) return res.status(404).json({ ok: false })
        res.json({
            ok: true,
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false
        })
    }

}