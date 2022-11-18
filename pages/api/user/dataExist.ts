import client from "@libs/server/client";
import { NextApiRequest, NextApiResponse } from "next"

export interface IDataExistResponse {
    ok: boolean,
    idCheckPass?: boolean,
    emailCheckPass?: boolean
}
export default async function (req: NextApiRequest, res: NextApiResponse<IDataExistResponse>) {
    const { query } = req;
    const userId = query.userId as string
    const email = query.email as string
    try {
        const user = await client.user.findFirst({
            where: {
                OR: [{ userId }, { email }]
            },
        });
        res.json({
            ok: true,
            idCheckPass: !(userId && user),
            emailCheckPass: !(email && user),
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false
        })
    }
}