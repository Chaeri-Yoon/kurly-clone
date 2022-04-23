import client from "@libs/server/client";
import { NextApiRequest, NextApiResponse } from "next"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { body: { userId, email } } = req;
    try {
        const user = await client.user.findFirst({
            where: {
                OR: [{ userId }, { email }]
            },
        });
        res.json({
            ok: true,
            isIdExist: user ? (userId ? true : false) : false,
            isEmailExist: user ? (email ? true : false) : false
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false
        })
    }
}