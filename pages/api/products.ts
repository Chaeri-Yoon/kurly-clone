import { IDataResponse } from "@libs/client/useCallApi";
import client from "@libs/server/client";
import { Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export interface IProducts extends IDataResponse {
    products: Product[]
}
export default async function (req: NextApiRequest, res: NextApiResponse<IProducts>) {
    try {
        const products = await client.product.findMany({})
        res.json({
            ok: true,
            products
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            products: []
        })
    }
}