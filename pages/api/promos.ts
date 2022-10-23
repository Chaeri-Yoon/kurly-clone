import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from "next";
import { IDataResponse } from '@libs/client/useCallApi';

const SALE_PROMO = 'sale-promo';
export interface IPromos extends IDataResponse {
    filenames: string[]
}
export default async function (req: NextApiRequest, res: NextApiResponse<IPromos>) {
    try {
        const directory = path.resolve('./public', SALE_PROMO);
        const filenames = fs.readdirSync(directory).map(file => "/" + SALE_PROMO + "/" + file);

        res.json({
            ok: true,
            filenames
        })
    }
    catch (error) {
        console.log(error);
        res.json({
            ok: false,
            filenames: []
        })
    }
}