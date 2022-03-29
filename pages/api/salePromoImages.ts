import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from "next";

const SALE_PROMO = 'sale-promo';
export default async function (req: NextApiRequest, res: NextApiResponse) {
    const directory = path.resolve('./public', SALE_PROMO);
    const filenames = fs.readdirSync(directory).map(file => "/" + SALE_PROMO + "/" + file);
    /* 
        When it fails to load filenames, 
    */

    res.json({
        filenames
    })
}