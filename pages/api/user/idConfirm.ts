import client from "@libs/server/client";
import { NextApiRequest, NextApiResponse } from "next"

export default async function isUserExist(req: NextApiRequest, res: NextApiResponse) {
    try {
        const user = await client.user.findUnique({
            where: {
                userId: req.body.userId
            }
        });
        res.json({
            isUserExist: user !== null
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false
        })
    }
}